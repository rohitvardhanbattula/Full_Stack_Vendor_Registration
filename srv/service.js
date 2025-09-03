const cds = require('@sap/cds');
const fileUpload = require('express-fileupload');

cds.on('bootstrap', app => {
  app.use(fileUpload());
});

const app = cds.app;
app.use(require("express").json());
app.use(fileUpload());

app.post('/uploadattachments', async (req, res) => {
  const supplierName = req.body.supplierName;
  if (req.files && req.files.file) {
    const uploadedFile = req.files.file;
    const base64Content = uploadedFile.data.toString('base64');
    await INSERT.into('my.supplier.Attachment').entries({
      ID: cds.utils.uuid(),
      supplierName,
      fileName: uploadedFile.name,
      mimeType: uploadedFile.mimetype,
      content: base64Content,
      uploadedAt: new Date()
    });
    res.send('File uploaded successfully');
  } else {
    res.status(400).send('No file uploaded');
  }
});

app.post('/bpa-callback',async(req,res) =>{

  try{
    const { suppliername, level, status, comment, email } = req.body;
    if (!suppliername || !level || !status || !email) return res.status(400).send("Missing fields");

    const comments = comment ?? "No Comments";

    await UPDATE('my.supplier.ApproverComment')
      .set({ status, comment: comments, updatedAt: new Date() })
      .where({ sup_name: suppliername, level, email });
  }
  catch (err) {
    console.error("❌ BPA callback failed:", err);
    res.status(500).send("Callback failed");
  }
});





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

  this.on('Approvals', async (req) => {
    const { suppliername } = req.data;
    if (!suppliername) return "Not found";
    const approvals = await SELECT.from('my.supplier.ApproverComment')
      .columns('level', 'status', 'comment', 'email','name')
      .where({ sup_name: suppliername });

    return approvals;
  });

  this.on("downloadAttachments", async (req) => {
    const { supplierName } = req.data;
    if (!supplierName) return req.error(400, "Missing supplierName");

    const files = await SELECT.from('my.supplier.Attachment')
      .columns("fileName", "mimeType", "content")
      .where({ supplierName });

    if (!files || files.length === 0) {
      return req.error(404, "No files found for supplier " + supplierName);
    }

    return files.map((file) => ({
      fileName: file.fileName,
      mimeType: file.mimeType,
      content: file.content?.toString("base64")
    }));
  });
});
