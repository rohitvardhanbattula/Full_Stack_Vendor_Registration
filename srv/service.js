const cds = require('@sap/cds');
const fileUpload = require('express-fileupload');
const JSZip = require('jszip');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
const { getDestination } = require('@sap-cloud-sdk/connectivity');

cds.on('bootstrap', app => {
  app.use(fileUpload());
});

const app = cds.app;
app.use(require("express").json());
app.use(fileUpload());
// This function should be in your main server file (e.g., app.js or server.js)
app.post('/fileextraction', async (req, res) => {
    const file = req.files?.file;
    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const base64Data = file.data.toString('base64');
        const fileType = file.mimetype;
        const destination = await getDestination({ destinationName: 'gemini_api' }, { useCache: false });
        const url = destination.url.replace(/\/$/, '');
        
        // Prompt the AI to return structured JSON (this is more reliable)
        const prompt = `
            Extract the Trade Name, GSTIN, and PAN number from the document. 
            Respond with only a valid JSON object in the format: 
            {"tradeName": "<value>", "gstin": "<value>", "pan": "<value>"}.
        `;

       const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: fileType, data: base64Data } }
          ]
        }]
      })
    });
        const result = await response.json();
        let extractedJsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "{}";
        extractedJsonText = extractedJsonText.replace(/```json/g, "").replace(/```/g, "").trim();
        const extractedData = JSON.parse(extractedJsonText);

        // --- KEY CHANGE: Format the JSON into a single string before sending to the frontend ---
        const combinedText = `Trade Name: ${extractedData.tradeName || 'N/A'}\nGSTIN: ${extractedData.gstin || 'N/A'}\nPAN: ${extractedData.pan || 'N/A'}`;

        return res.json({ extractedText: combinedText });

    } catch (err) {
        console.error("Gemini API error:", err);
        return res.status(500).json({ error: "Error extracting details from document" });
    }
});


app.post('/fetchGSTDetails', async (req, res) => {
  const { gstin } = req.body;

  if (!gstin) {
    return res.status(400).json({ error: "GSTIN missing" });
  }

  try {
    //const apiKey = "84de71e50cad6f02804c5bfc60c2b6e9";
    //const url = `destinations/gstcheck_api/check/${apiKey}/${gstin}`;

    const destination = await getDestination({ destinationName: 'gstcheck_api' }, { useCache: false });
    if (!destination || !destination.url) throw new Error("Destination not found or invalid");
    const url = destination.url.replace(/\/$/, '');
    const host = `${url}/${gstin}`;
    const response = await fetch(host);
    const result = await response.json();

    if (!result?.flag || !result?.data) {
      return res.status(404).json({ error: "GST details not found." });
    }

    // Return GST details only
    return res.json({
      gstStatus: result.data.sts,
      gstTradeName: result.data.tradeNam?.trim() || "",
      gstPincode: result.data.pradr?.addr?.pncd || ""
    });

  } catch (e) {
    console.error("GST fetch error:", e);
    return res.status(500).json({ error: "Error while fetching GST details." });
  }
});


app.get('/downloadZip/:supplierName', async (req, res) => {
  const { supplierName } = req.params;
  const files = await SELECT.from('my.supplier.Attachment').where({ supplierName });
  if (!files || files.length === 0) return res.status(404).send("No files found");

  const zip = new JSZip();
  files.forEach(file => {
    const buffer = Buffer.from(file.content, 'base64');
    zip.file(file.fileName, buffer);
  });

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  res.setHeader('Content-Disposition', `attachment; filename="Vendor_${supplierName}_Files.zip"`);
  res.setHeader('Content-Type', 'application/zip');
  res.send(zipBuffer);
});

app.get('/downloadFile/:fileID', async (req, res) => {
  const { fileID } = req.params;
  const file = await SELECT.one.from('my.supplier.Attachment').where({ ID: fileID });
  if (!file) return res.status(404).send("File not found");

  const buffer = Buffer.from(file.content, 'base64');
  res.setHeader('Content-Disposition', `inline; filename="${file.fileName}"`);
  res.setHeader('Content-Type', file.mimeType);
  res.send(buffer);
});

app.post('/uploadattachments', async (req, res) => {
  const supplierName = req.body.supplierName;

  if (req.files && req.files.files) {
    // Normalize to array (even if only 1 file)
    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    console.log(files);
    // Save all attachments
    for (const uploadedFile of files) {
      const base64Content = uploadedFile.data.toString('base64');
      await INSERT.into('my.supplier.Attachment').entries({
        ID: cds.utils.uuid(),
        supplierName,
        fileName: uploadedFile.name,
        mimeType: uploadedFile.mimetype,
        filesize: Math.round(uploadedFile.size / 1024),
        content: base64Content,
        uploadedAt: new Date()
      });
    }

    try {
      const [vendor] = await SELECT.from('my.supplier.Supplier').where({ supplierName });
      if (!vendor) {
        console.error("Vendor not found for BPA");
        return res.status(404).send({ message: "Vendor not found" });
      }

      // ✅ Trigger BPA only once per supplier
      setTimeout(async () => {
        try {
          await triggerNextApprover(supplierName);
          console.log(`✅ BPA triggered for supplier ${supplierName}`);
        } catch (err) {
          console.error(`❌ BPA trigger failed for supplier ${supplierName}:`, err);
        }
      }, 10000);

      res.send({ message: `${files.length} file(s) uploaded, BPA trigger scheduled` });
    } catch (err) {
      console.error("❌ Error after file upload:", err);
      res.status(500).send({ message: "Error after file upload" });
    }
  } else {
    res.status(400).send({ message: "No file uploaded" });
  }
});




async function triggerNextApprover(supplierName) {
  const vendor = await SELECT.one
    .from('my.supplier.Supplier')
    .columns(
      'supplierName',
      'primaryContact.email',
      'primaryContact.phone',
      'mainAddress.country'
    )
    .where({ supplierName });


  const approvals = await SELECT.from('my.supplier.ApproverComment')
    .where({ sup_name: supplierName })
    .orderBy('level asc');

  const allPreviousComments = approvals
    .filter(a => a.status !== 'PENDING' && a.comment)
    .map(a => `${a.email} ${new Date(a.updatedAt || new Date()).toLocaleString()} - ${a.comment}`)
    .join("\n");

  for (const approver of approvals) {
    if (approver.status === 'PENDING') {
      await startBPAWorkflow({
        name: vendor.supplierName,
        email: vendor.primaryContact_email,
        country: vendor.mainAddress_country,
        phone: vendor.primaryContact_phone,
        status: "PENDING",
        approver_name: approver.name,
        approver_email: approver.email,
        approver_level: approver.level,
        prior_comments: allPreviousComments || "No prior comments"
      });
      break;
    }
  }
}

app.post('/bpa-callback', async (req, res) => {
  try {
    const { suppliername, level, status, comment, email } = req.body;
    if (!suppliername || !level || !status || !email) return res.status(400).send("Missing fields");

    const comments = comment ?? "No Comments";

    await UPDATE('my.supplier.ApproverComment')
      .set({ status, comment: comments, updatedAt: new Date() })
      .where({ sup_name: suppliername, level, email });

    if (status === 'Rejected') {
      const currentLevelNum = Number(level);
      const approvers = await SELECT.from('my.supplier.ApproverComment')
        .where({ sup_name: suppliername });
      for (let approver of approvers) {
        const lvlNum = Number(approver.level);
        if (lvlNum > currentLevelNum) {
          await UPDATE('my.supplier.ApproverComment')
            .set({
              status: 'REJECTED',
              comment: 'Auto-rejected due to previous rejection'
            })
            .where({ sup_name: suppliername, level: approver.level });
        }

      }
      await UPDATE('my.supplier.Supplier')
        .set({ status: "REJECTED" })
        .where({ supplierName: suppliername });
      return res.send({ message: "Approval rejected." });
    }

    const nextLevel = (parseInt(level, 10) + 1).toString();
    const next = await SELECT.one.from('my.supplier.ApproverComment')
      .where({ sup_name: suppliername, level: nextLevel });

    if (next) {
      await triggerNextApprover(suppliername);
    } else {
      const vendor = await SELECT.one.from('my.supplier.Supplier').where({ supplierName: suppliername });
      await createBusinessPartnerInS4(vendor);
      return res.send({ message: "All levels approved." });
    }

    res.send({ message: "Approval recorded. Next level in progress." });
  } catch (err) {
    console.error("❌ BPA callback failed:", err);
    res.status(500).send("Callback failed");
  }
});


const { aBusinessPartner } = require('./src/generated/A_BUSINESS_PARTNER');

async function createBusinessPartnerInS4(vendor) {
  const { businessPartnerApi } = aBusinessPartner();

  try {
    const partnerEntity = businessPartnerApi.entityBuilder()
      .businessPartnerCategory("2")
      .businessPartnerGrouping("BP02")
      .firstName(vendor.supplierName)
      .personFullName(vendor.supplierName)
      .businessPartnerFullName(vendor.supplierName)
      .nameCountry("US")
      .businessPartnerName(vendor.supplierName)
      .organizationBpName1(vendor.supplierName)
      .build();

    console.log("Payload:", partnerEntity);

    const result = await businessPartnerApi
      .requestBuilder()
      .create(partnerEntity)
      .execute({ destinationName: 'vendordestination' });

    console.log("Business Partner created:", result);
    const bpId = result.businessPartner;
    await UPDATE('my.supplier.Supplier')
      .set({ businessPartnerId: bpId, status: "APPROVED" })
      .where({ supplierName: vendor.supplierName });
    return result;
  } catch (error) {
    console.error("Error creating Business Partner:", error.rootCause?.response?.data?.error?.message?.value || error.message);
    throw error;
  }

}
async function getAppHostURLFromDestination() {


  const destination = await getDestination({ destinationName: 'vendorportaldest' }, { useCache: true });
  console.log("destination fetched", destination)
  if (!destination || !destination.url) throw new Error("Destination not found or invalid");
  return destination.url.replace(/\/$/, '');
}

async function startBPAWorkflow({ name, email, country, phone, status, approver_name, approver_email, approver_level, prior_comments }) {
  const files = await SELECT.from('my.supplier.Attachment').columns('ID', 'fileName').where({ supplierName: name });
  var host = '';
  //host = `https://the-hackett-group-d-b-a-answerthink--inc--at-development1a73fa6.cfapps.us10.hana.ondemand.com`;
  host = await getAppHostURLFromDestination();
  const fileLinks = files.map(file => `${host}/downloadFile/${file.ID}`);
  const fileZipLink = `${host}/downloadZip/${name}`;

  const [attachment1, attachment2] = [fileLinks[0] || "", fileLinks[1] || ""];

  return await executeHttpRequest(
    { destinationName: 'spa_process_destination' },
    {
      method: 'POST',
      url: "/",
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        definitionId: "us10.at-development-hgv7q18y.vendorportalbuildautomation.vendorportalprocess",
        context: {
          _name: name,
          email,
          country,
          phone,
          status,
          attachment1,
          attachment2,
          attachments: fileZipLink,
          approver_name,
          approver_level,
          approver_email,
          prior_comments
        }
      }
    }
  );

}

module.exports = cds.service.impl(function () {
  this.on('getsuppliers', async (req) => {
    try {
      return await cds.run(
        SELECT.from('my.supplier.Supplier').columns(
          '*',
          { ref: ['mainAddress'], expand: ['*'] },
          { ref: ['categoryAndRegion'], expand: ['*'] },
          { ref: ['primaryContact'], expand: ['*'] },
          { ref: ['additionalInfo'], expand: ['*'] }
        )
      );
    } catch (e) {
      return req.error(500, 'Error fetching suppliers: ' + e.message);
    }
  });

  this.on('createSupplierWithFiles', async (req) => {
    try {
      const supplierData = req.data.supplierData;
      const exists = await SELECT.one.from('my.supplier.Supplier').where({ supplierName: supplierData.supplierName });
      if (exists) return req.error(400, `Supplier '${supplierData.supplierName}' already exists`);

      const addressId = cds.utils.uuid();
      await INSERT.into('my.supplier.Address').entries({ ID: addressId, ...supplierData.mainAddress });

      const contactId = cds.utils.uuid();
      await INSERT.into('my.supplier.Contact').entries({ ID: contactId, ...supplierData.primaryContact });

      const catRegId = cds.utils.uuid();
      await INSERT.into('my.supplier.CategoryRegion').entries({ ID: catRegId, ...supplierData.categoryAndRegion });

      const addInfoId = cds.utils.uuid();
      await INSERT.into('my.supplier.AdditionalInfo').entries({ ID: addInfoId, ...supplierData.additionalInfo });

      const supplierId = cds.utils.uuid();
      await INSERT.into('my.supplier.Supplier').entries({
        ID: supplierId,
        supplierName: supplierData.supplierName,
        aiExtractedText : "-",
    gstValidationStatus : "Failed",
    gstValidationRemarks : "-",
        status: "PENDING",
        businessPartnerId: "-",
        mainAddress_ID: addressId,
        primaryContact_ID: contactId,
        categoryAndRegion_ID: catRegId,
        additionalInfo_ID: addInfoId
      });

      const approversList = await SELECT.from('my.supplier.Approver').orderBy('level').where({ country: supplierData.mainAddress.country });

      const approvalEntries = approversList.map(approver => ({
        sup_name: supplierData.supplierName,
        level: approver.level,
        email: approver.email,
        name: approver.name,
        status: 'PENDING',
        updatedAt: new Date().toISOString()
      }));

      if (approvalEntries.length) {
        await INSERT.into('my.supplier.ApproverComment').entries(approvalEntries);
      }

      return `Supplier ${supplierData.supplierName} created successfully`;
    } catch (err) {
      req.error(500, 'Error creating supplier: ' + err.message);
    }
  });

  this.on("Approvers", async (req) => {
    try {
      return await cds.run(
        SELECT.from('my.supplier.Approver')
      );
    } catch (e) {
      return req.error(500, 'Error fetching approvers: ' + e.message);
    }
  });


  this.on("resetAllData", async () => {
    try {

      const destination = await getDestination({ destinationName: 'gstcheck_api' }, { useCache: false });
      console.log("destination fetched", destination)
      if (!destination || !destination.url) throw new Error("Destination not found or invalid");
      console.log(destination.url.replace(/\/$/, ''));
      await DELETE.from("my.supplier.Attachment");
      await DELETE.from("my.supplier.ApproverComment");
      await DELETE.from("my.supplier.Supplier");
      await DELETE.from("my.supplier.Address");
      await DELETE.from("my.supplier.Contact");
      await DELETE.from("my.supplier.gst");
      await DELETE.from("my.supplier.CategoryRegion");
      await DELETE.from("my.supplier.AdditionalInfo");

      return "All data deleted successfully!";
    } catch (e) {
      return `Error deleting data: ${e.message}`;
    }
  });


  this.on("approverentry", async (req) => {
    try {
      const { approverentry } = req.data;
      const { level, country } = approverentry;

      const exists = await SELECT.one.from("my.supplier.Approver")
        .where({ level: level, country: country });

      if (exists) {
        return `Approver already exists for Level ${level} and Country ${country}`;
      }

      await INSERT.into("my.supplier.Approver").entries(approverentry);

      return `Approver entry inserted successfully for Level ${level}, country ${country}`;
    } catch (e) {
      return req.error(500, "Error inserting approver entry: " + e.message);
    }
  });

  this.on("approverupdateentry", async (req) => {
    try {
      const { approverentry } = req.data;
      const { level, country } = approverentry;

      // check if record exists
      const exists = await SELECT.one.from("my.supplier.Approver")
        .where({ level: level, country: country });

      if (!exists) {
        return req.error(404, `No approver found for Level ${level} and Country ${country}`);
      }


      await UPDATE("my.supplier.Approver")
        .set(approverentry)
        .where({ level: level, country: country });

      return `Approver entry updated successfully for Level ${level}, Country ${country}`;
    } catch (e) {
      return req.error(500, "Error updating approver entry: " + e.message);
    }
  });


  this.on('Approvals', async (req) => {
    const { suppliername } = req.data;
    if (!suppliername) return "Not found";
    const approvals = await SELECT.from('my.supplier.ApproverComment')
      .columns('level', 'status', 'comment', 'email', 'name')
      .where({ sup_name: suppliername });

    return approvals;
  });

   this.on('saveextractedtext', async (req) => {
        const { suppliername, extractedGstin } = req.data; // Matches your CDS action definition
        
        // Note: The field in the Supplier entity should match, e.g., 'extractedText'
        const result = await UPDATE('my.supplier.Supplier')
            .set({ aiExtractedText: extractedGstin }) 
            .where({ supplierName: suppliername });

        if (result === 0) {
            return req.error(404, `Supplier '${suppliername}' not found.`);
        }
        return `Extracted text for ${suppliername} has been saved.`;
    });

    // Correct implementation for saveValidationResult
    this.on('saveValidationResult', async (req) => {
        const { supplierName, field, validationStatus, validationRemarks } = req.data;

        // You are CREATING new validation entries, so you must use INSERT.
        await INSERT.into('my.supplier.gst').entries({
            supplierName: supplierName,
            field: field,
            status: validationStatus,
            remarks: validationRemarks
        });
        
        return `Validation result for field '${field}' has been saved.`;
    });
  this.on("downloadAttachments", async (req) => {
    const { supplierName } = req.data;
    if (!supplierName) return req.error(400, "Missing supplierName");

    const files = await SELECT.from('my.supplier.Attachment')
      .columns("fileName", "mimeType", "content","filesize","uploadedAt")
      .where({ supplierName });

    if (!files || files.length === 0) {
      return req.error(404, "No files found for supplier " + supplierName);
    }

    return files.map((file) => ({
      fileName: file.fileName,
      mimeType: file.mimeType,
      content: file.content?.toString("base64"),
      filesize:file.filesize,
      uploadedAt:file.uploadedAt
    }));
  });
});