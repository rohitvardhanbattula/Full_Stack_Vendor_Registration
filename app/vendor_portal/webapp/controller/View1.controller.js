sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/export/Spreadsheet"
], function (Controller, MessageToast, JSONModel, MessageBox, Fragment, Spreadsheet) {
    "use strict";
    return Controller.extend("vendorportal.controller.View1", {
        _validateGST: async function (gstin, supplierData) {
            if (!gstin) {
                await new Promise((resolve) => {
                    sap.m.MessageBox.warning("Please upload GST Number related PDF", {
                        onClose: () => resolve()
                    });
                });
                return false;
            }

            try {
                const response = await fetch(this.getURL() + '/fetchGSTDetails', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ gstin })
                });

                const gstData = await response.json();

                if (!response.ok) {
                    await new Promise((resolve) => {
                        sap.m.MessageBox.error(gstData.error || "Error fetching GST details", {
                            onClose: () => resolve()
                        });
                    });
                    return false;
                }

                const errors = [];

                if (gstData.gstStatus !== "Active") {
                    errors.push("GST Number is not active.");
                }

                const clean = str => str?.toLowerCase().replace(/\s+/g, " ").trim();

                if (clean(gstData.gstTradeName) !== clean(supplierData.supplierName)) {
                    errors.push(`Trade Name (${gstData.gstTradeName}) does not match your Supplier Name (${supplierData.supplierName})`);
                }
                if (gstData.gstPincode !== supplierData.mainAddress.postalCode) {
                    errors.push(`Pincode (${gstData.gstPincode}) does not match your Postal Code (${supplierData.mainAddress.postalCode})`);
                }

                if (errors.length > 0) {
                    await new Promise((resolve) => {
                        sap.m.MessageBox.error(
                            "GST details do not match:\n" + errors.join("\n"),
                            { onClose: () => resolve() }
                        );
                    });
                    return false;
                }

                // All good
                return true;

            } catch (err) {
                console.error("Validation error:", err);
                await new Promise((resolve) => {
                    sap.m.MessageBox.error("Error while validating GST Number.", {
                        onClose: () => resolve()
                    });
                });
            }
        }

        ,
        _extractGSTFromFile: async function (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch(this.getURL() + '/fileextraction', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to extract GST');
                }

                const data = await response.json();
                return data.gstin || "";
            } catch (err) {
                console.error("Backend GST extraction error:", err);
                return "";
            }
        },
        _readFileAsBase64: function (file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const base64 = btoa(new Uint8Array(e.target.result).reduce((data, byte) => data + String.fromCharCode(byte), ""));
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        },
        onExcel: function () {
            var sSuppliersUrl = this.getURL() + `/odata/v4/supplier/getsuppliers`;
            var sApproversUrl = this.getURL() + `/odata/v4/supplier/Approvers`;

            Promise.all([
                fetch(sSuppliersUrl).then(res => res.json()),
                fetch(sApproversUrl).then(res => res.json())
            ]).then(function ([oSuppliersRes, oApproversRes]) {
                var aSuppliersData = oSuppliersRes.value || [];
                var aApproversData = oApproversRes.value || [];
                var aSuppliersExcelData = aSuppliersData.map(item => ({
                    SupplierName: item.supplierName,
                    City: item.mainAddress.city,
                    Country: item.mainAddress.country
                }));

                var aApproversExcelData = aApproversData.map(item => ({
                    Level: item.level,
                    Name: item.name,
                    Email: item.email
                }));

                if (!Array.isArray(aSuppliersExcelData) || !Array.isArray(aApproversExcelData)) {
                    MessageBox.error("Export failed: invalid data format.");
                    return;
                }
                if (aSuppliersExcelData.length === 0 && aApproversExcelData.length === 0) {
                    MessageBox.warning("No data available to export.");
                    return;
                }


                var wb = XLSX.utils.book_new();
                var wsSuppliersData = XLSX.utils.json_to_sheet(aSuppliersExcelData);
                var wsApproversData = XLSX.utils.json_to_sheet(aApproversExcelData);
                XLSX.utils.book_append_sheet(wb, wsSuppliersData, "Suppliers");
                XLSX.utils.book_append_sheet(wb, wsApproversData, "Approvers");
                XLSX.writeFile(wb, "Suppliers_and_Approvers.xlsx");

                MessageToast.show("Excel downloaded successfully!");

            }).catch(function (err) {
                MessageBox.error("Failed to fetch data: " + err.message);
            });

        }
        ,

        getURL: function () {
            return sap.ui.require.toUrl("vendorportal");
        },
        _validateInputs: function (aInputIds) {
            let bValid = true;

            const fieldMessages = {
                "inpSupplierName": "Supplier Name is required",
                "inpCountry": "Country is required",
                "inpFirstName": "First Name is required",
                "inpEmail": "Email is required",
                "inpCategory": "Category is required"
            };

            aInputIds.forEach(id => {
                let oInput = this.byId(id);
                if (oInput) {
                    if (!oInput.getValue()) {
                        oInput.setValueState("Error");
                        oInput.setValueStateText(fieldMessages[id] || "This field is required.");
                        bValid = false;
                    } else {
                        oInput.setValueState("None");
                    }
                }
            });

            return bValid;
        },


        onNextStep1: function () {
            if (this._validateInputs(["inpSupplierName", "inpCountry"])) {
                this.byId("createWizard").nextStep();
            }
        },
        onNextStep2: function () {
            if (this._validateInputs(["inpFirstName", "inpEmail"])) {
                this.byId("createWizard").nextStep();
            }
        },
        onNextStep3: function () {
            if (this._validateInputs(["inpCategory"])) {
                this.byId("createWizard").nextStep();
            }
        },
        onNextStep4: function () {
            const aUploaded = this.getView().getModel().getProperty("/uploadedFiles") || [];
            if (aUploaded.length === 0) {
                MessageBox.warning("Please upload at least 1 file to proceed.");
                return;
            }
            if (aUploaded.length > 2) {
                sap.m.MessageBox.warning("You have uploaded more than 2 files. Please remove extra files before proceeding.");
                return;
            }
            this.byId("createWizard").nextStep();
            this.byId("btnCreateSupplier").setEnabled(true);
        }
        ,

        onInit: function () {
            const oView = this.getView();
            if (!this._oProgressDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "vendorportal.view.ProgressDialog",
                    controller: this
                }).then(dialog => {
                    this._oProgressDialog = dialog;
                    oView.addDependent(dialog);
                });
            }
            const oModel = new JSONModel({
                supplierData: {
                    supplierName: "",
                    businessPartnerId: "",
                    mainAddress: { street: "", line2: "", line3: "", city: "", postalCode: "", country: "", region: "" },
                    primaryContact: { firstName: "", lastName: "", email: "", phone: "" },
                    categoryAndRegion: { category: "", region: "" },
                    additionalInfo: { details: "" }
                },
                suppliers: [],
                uploadedFiles: []
            });
            this.getView().setModel(oModel);


            ["inpSupplierName", "inpCountry", "inpFirstName", "inpEmail", "inpCategory"].forEach(id => {
                let oInput = this.byId(id);
                if (oInput) {
                    oInput.attachChange(function (evt) {
                        if (evt.getParameter("value")) {
                            evt.getSource().setValueState("None");
                        }
                    });
                }
            });
        }
        ,
        onCloseProgressDialog: function () {
            if (this._oProgressDialog) this._oProgressDialog.close();
        },

        onFileChange: function (oEvent) {
            this._newFiles = Array.from(oEvent.getParameter("files") || []);
        },

        onAddFiles: function () {
            const oModel = this.getView().getModel();
            const oFileUploader = this.byId("fileUploader");
            let aFiles = oModel.getProperty("/uploadedFiles") || [];

            const totalFiles = aFiles.length + this._newFiles.length;
            if (totalFiles > 2) {
                MessageBox.warning("You can upload a maximum of 2 files.");
                if (oFileUploader) oFileUploader.clear();
                return;
            }

            this._newFiles.forEach(file => {
                const bExists = aFiles.some(f => f.name === file.name && f.size === file.size);
                if (!bExists) {
                    aFiles.push({
                        documentId: Date.now().toString() + Math.random(),
                        name: file.name,
                        type: file.type,
                        size: Math.round(file.size / 1024),
                        file: file
                    });
                }
            });

            oModel.setProperty("/uploadedFiles", aFiles);
            this._newFiles = [];

            if (oFileUploader) oFileUploader.clear();


        },


        onFileDeleted: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const sDocId = oContext.getProperty("documentId");

            const oModel = this.getView().getModel();
            let aFiles = oModel.getProperty("/uploadedFiles") || [];
            aFiles = aFiles.filter(f => f.documentId !== sDocId);
            oModel.setProperty("/uploadedFiles", aFiles);
            this.byId("btnCreateSupplier").setEnabled(aFiles.length > 0);
        },

        _resetForm: function () {
            this.getView().getModel().setProperty("/supplierData", {
                supplierName: "",
                mainAddress: { street: "", line2: "", line3: "", city: "", postalCode: "", country: "", region: "" },
                primaryContact: { firstName: "", lastName: "", email: "", phone: "" },
                categoryAndRegion: { category: "", region: "" },
                additionalInfo: { details: "" }
            });

            this.getView().getModel().setProperty("/uploadedFiles", [])
            const oFileUploader = this.byId("fileUploader");
            if (oFileUploader) oFileUploader.clear();

        },
        onSaveSupplier: async function () {
            const oData = this.getView().getModel().getProperty("/supplierData");
            const aUploadedFiles = this.getView().getModel().getProperty("/uploadedFiles") || [];

            if (aUploadedFiles.length > 2) {
                MessageBox.warning("Please add at max 2 files before saving.");
                return;
            }


            if (this._oProgressDialog) {
                this._oProgressDialog.open();
                this.byId("gstIcon").setSrc("sap-icon://synchronize").setColor("Neutral");
                this.byId("supplierIcon").setSrc("sap-icon://circle-task").setColor("Neutral");
            }

            sap.ui.core.BusyIndicator.show(0);

            try {

                let validGSTFound = false;
                for (const fileObj of aUploadedFiles) {
                    const gstin = await this._extractGSTFromFile(fileObj.file);
                    if (gstin) {
                        const isValid = await this._validateGST(gstin, oData);
                        if (isValid) {
                            validGSTFound = true;
                            this.byId("gstIcon").setSrc("sap-icon://accept").setColor("Positive");
                            break;
                        }
                    }
                }

                if (!validGSTFound) {
                    this.byId("gstIcon").setSrc("sap-icon://decline").setColor("Negative");
                    return;
                }


                const res = await fetch(this.getURL() + `/odata/v4/supplier/createSupplierWithFiles`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ supplierData: oData })
                });
                const result = await res.json();
                this.byId("supplierIcon").setSrc("sap-icon://accept").setColor("Positive");


                if (aUploadedFiles.length > 0) {
                    const formData = new FormData();
                    formData.append("supplierName", oData.supplierName);
                    aUploadedFiles.forEach(f => formData.append("files", f.file));

                    await fetch(this.getURL() + `/uploadattachments`, { method: "POST", body: formData });
                }

                sap.m.MessageBox.success("Supplier created successfully with all validations & attachments!", {
                    onClose: () => {
                        // Reset wizard + form after confirmation
                        this._resetForm();
                        const oWizard = this.byId("createWizard");
                        if (oWizard) oWizard.discardProgress(this.byId("step1"));
                    }
                });


            } catch (err) {
                console.error(err);
                this.byId("supplierIcon").setSrc("sap-icon://decline").setColor("Negative");
            } finally {
                sap.ui.core.BusyIndicator.hide();
                if (this._oProgressDialog) {
                    this._oProgressDialog.close();
                }
            }
        }
        ,


        onOpenSupplierList: function () {
            this.getOwnerComponent().getRouter().navTo("SupplierList");
        },

        onCloseSupplierList: function () {
            if (this._oSupplierDialog) this._oSupplierDialog.close();
        },

        onOpenApproverList: async function () {
            var oView = this.getView();

            if (!this._oApproverDialog) {
                this._oApproverDialog = await Fragment.load({
                    id: oView.getId(),
                    name: "vendorportal.view.ApproverList",
                    controller: this
                });
                oView.addDependent(this._oApproverDialog);
            }

            const fetchApprovers = () => {
                fetch(this.getURL() + `/odata/v4/supplier/Approvers`)
                    .then(res => res.json())
                    .then(data => {
                        const approvers = Array.isArray(data.value) ? data.value : data;
                        this.getView().getModel().setProperty("/approvers", approvers);
                    })
                    .catch(err => { MessageBox.error("Error fetching approvers: " + err.message); });
            };

            fetchApprovers();

            this._approverInterval = setInterval(() => {
                if (this._oApproverDialog && this._oApproverDialog.isOpen()) {
                    fetchApprovers();
                }
            }, 3000);

            this._oApproverDialog.open();
        },

        onCloseApproverList: function () {
            if (this._oApproverDialog) {
                this._oApproverDialog.close();
            }
            if (this._approverInterval) {
                clearInterval(this._approverInterval);
                this._approverInterval = null;
            }
        }
        ,
        onCreateApprover: function () {
            var oView = this.getView();

            if (!this.byId("createApproverDialog")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "vendorportal.view.CreateApprover",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("createApproverDialog").open();
            }
        },
        onUpdateApprover: function () {
            var oView = this.getView();

            if (!this.byId("updateApproverDialog")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "vendorportal.view.UpdateApprover",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("updateApproverDialog").open();
            }
        },
        onSaveUpdateApprover: async function () {
            try {
                const level = this.byId("inputLevel1").getValue();

                const country = this.byId("inputCountry1").getValue();
                const name = this.byId("inputName1").getValue();
                const email = this.byId("inputEmail1").getValue();

                if (!level || !country || !name || !email) {
                    MessageBox.warning("Please fill all required fields.");
                    return;
                }

                const body = {
                    approverentry: {
                        level: level,
                        country: country,
                        name: name,
                        email: email
                    }
                };

                const response = await fetch(this.getURL() + `/odata/v4/supplier/approverupdateentry`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                const result = await response.json();
                this.byId("inputLevel1").setValue("");
                this.byId("inputCountry1").setValue("");
                this.byId("inputName1").setValue("");
                this.byId("inputEmail1").setValue("");
                if (response.ok) {
                    MessageToast.show(result.value);
                    this.byId("updateApproverDialog").close();
                } else {
                    MessageBox.error(result.error?.message || "Failed to update approver");
                }
            } catch (e) {
                MessageBox.error("Error: " + e.message);
            }
        },
        // Save new approver
        onSaveApprover: async function () {
            try {
                const level = this.byId("inputLevel").getValue();

                const country = this.byId("inputCountry").getValue();
                const name = this.byId("inputName").getValue();
                const email = this.byId("inputEmail").getValue();

                if (!level || !country || !name || !email) {
                    MessageBox.warning("Please fill all required fields.");
                    return;
                }

                const body = {
                    approverentry: {
                        level: level,
                        country: country,
                        name: name,
                        email: email
                    }
                };

                const response = await fetch(this.getURL() + `/odata/v4/supplier/approverentry`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                const result = await response.json();
                this.byId("inputLevel").setValue("");
                this.byId("inputCountry").setValue("");
                this.byId("inputName").setValue("");
                this.byId("inputEmail").setValue("");
                if (response.ok) {
                    MessageToast.show(result.value);
                    this.byId("createApproverDialog").close(); // ✅ consistent
                } else {
                    MessageBox.error(result.error?.message || "Failed to insert approver");
                }
            } catch (e) {
                MessageBox.error("Error: " + e.message);
            }
        }
        ,

        // Cancel creation
        onCancelApprover: function () {
            this.byId("createApproverDialog").close();
        },

        onCancelUpdateApprover: function () {
            this.byId("updateApproverDialog").close();
        }


    });
});