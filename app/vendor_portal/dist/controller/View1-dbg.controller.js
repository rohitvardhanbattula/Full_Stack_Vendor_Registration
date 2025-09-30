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
        
        getURL: function () {
            return sap.ui.require.toUrl("vendorportal");
        },

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
                    aiExtractedText: "",
                    gstValidationStatus: "",
                    gstValidationRemarks: "",
                    mainAddress: {
                        street: "",
                        line2: "",
                        line3: "",
                        city: "",
                        postalCode: "",
                        country: "",
                        region: ""
                    },
                    primaryContact: {
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: ""
                    },
                    categoryAndRegion: {
                        category: "",
                        region: ""
                    },
                    additionalInfo: {
                        details: ""
                    }
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
                MessageBox.warning("You have uploaded more than 2 files. Please remove extra files before proceeding.");
                return;
            }
            this.byId("createWizard").nextStep();
            this.byId("btnCreateSupplier").setEnabled(true);
        },

        onFileChange: function (oEvent) {
            this._newFiles = Array.from(oEvent.getParameter("files") || []);
        },

        onAddFiles: function () {
            const oModel = this.getView().getModel();
            const oFileUploader = this.byId("fileUploader");
            let aFiles = oModel.getProperty("/uploadedFiles") || [];

            if (!this._newFiles || this._newFiles.length === 0) {
                MessageToast.show("Please choose files to add.");
                return;
            }

            const totalFiles = aFiles.length + this._newFiles.length;
            if (totalFiles > 2) {
                MessageBox.warning("You can upload a maximum of 2 files.");
                if (oFileUploader) oFileUploader.clear();
                this._newFiles = [];
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
                } else {
                    MessageToast.show(`File "${file.name}" is already in the list.`);
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
        },

        _setStepStatus: function (sStep, sStatus) {
            const oBusyIndicator = this.byId(`${sStep}BusyIndicator`);
            const oStatusIcon = this.byId(`${sStep}StatusIcon`);

            if (!oBusyIndicator || !oStatusIcon) {
                return;
            }

            oBusyIndicator.setVisible(sStatus === "InProgress");
            oStatusIcon.setVisible(sStatus !== "InProgress");

            if (sStatus === "Success") {
                oStatusIcon.setSrc("sap-icon://accept");
                oStatusIcon.setColor("Positive");
            } else if (sStatus === "Failed") {
                oStatusIcon.setSrc("sap-icon://decline");
                oStatusIcon.setColor("Negative");
            }
        },

        onSaveSupplier: async function () {
            const oData = this.getView().getModel().getProperty("/supplierData");
            const aUploadedFiles = this.getView().getModel().getProperty("/uploadedFiles") || [];

            let extractedGstin = "";
            let validationStatus = "Not Performed";
            let validationRemarks = "No GST document found.";

            if (this._oProgressDialog) {
                this._oProgressDialog.open();
                this._setStepStatus("gst", "InProgress");
                this._setStepStatus("supplier", "InProgress");
                this.byId("progressDialogCloseButton").setEnabled(false);
            }

            try {
                if (aUploadedFiles.length > 0) {
                    for (const fileObj of aUploadedFiles) {
                        const gstin = await this._extractGSTFromFile(fileObj.file);
                        if (gstin) {
                            extractedGstin = gstin;
                            const validationResult = await this._validateGST(gstin, oData);
                            validationStatus = validationResult.status;
                            validationRemarks = validationResult.remarks;
                            break;
                        }
                    }
                }

                if (!extractedGstin) {
                    validationStatus = "Failed";
                }

                this._setStepStatus("gst", validationStatus);

                const res = await fetch(this.getURL() + `/odata/v4/supplier/createSupplierWithFiles`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        supplierData: oData
                    })
                });

                if (!res.ok) {
                    const errorResult = await res.json();
                    this._setStepStatus("supplier", "Failed");
                    MessageBox.error(errorResult.error?.message || "Supplier creation failed.");
                    return;
                }

                this._setStepStatus("supplier", "Success");

                if (aUploadedFiles.length > 0) {
                    const formData = new FormData();
                    formData.append("supplierName", oData.supplierName);
                    aUploadedFiles.forEach(f => formData.append("files", f.file));
                    await fetch(this.getURL() +`/uploadattachments`, {
                        method: "POST",
                        body: formData
                    });
                }

                await fetch(this.getURL() + `/odata/v4/supplier/saveValidationResult`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        supplierName: oData.supplierName,
                        extractedGstin: extractedGstin,
                        validationStatus: validationStatus,
                        validationRemarks: validationRemarks
                    })
                });

                this._resetForm();
                const oWizard = this.byId("createWizard");
                if (oWizard) oWizard.discardProgress(this.byId("step1"));

            } catch (err) {
                console.error("An unexpected error occurred:", err);
                this._setStepStatus("supplier", "Failed");
                MessageBox.error("An unexpected error occurred during the submission process.");
            } finally {
                if (this._oProgressDialog) {
                    this.byId("progressDialogCloseButton").setEnabled(true);
                }
            }
        },

        _extractGSTFromFile: async function (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch(this.getURL() +'/fileextraction', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    console.error('Failed to extract GST from file.');
                    return "";
                }

                const data = await response.json();
                return data.gstin || "";
            } catch (err) {
                console.error("Backend GST extraction error:", err);
                return "";
            }
        },

        _validateGST: async function (gstin, supplierData) {
            if (!gstin) {
                return {
                    status: "Failed",
                    remarks: "GST Number could not be found for validation."
                };
            }

            try {
                const response = await fetch(this.getURL() +'/fetchGSTDetails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        gstin
                    })
                });

                const gstData = await response.json();

                if (!response.ok) {
                    return {
                        status: "Failed",
                        remarks: gstData.error || "Error fetching GST details from external service."
                    };
                }

                const errors = [];
                const clean = str => str?.toLowerCase().replace(/\s+/g, " ").trim();

                if (gstData.gstStatus !== "Active") {
                    errors.push("GST Number is not active.");
                }
                if (clean(gstData.gstTradeName) !== clean(supplierData.supplierName)) {
                    errors.push(`Trade Name mismatch: GST record has "${gstData.gstTradeName}".`);
                }
                if (gstData.gstPincode !== supplierData.mainAddress.postalCode) {
                    errors.push(`Pincode mismatch: GST record has "${gstData.gstPincode}".`);
                }

                if (errors.length > 0) {
                    return {
                        status: "Failed",
                        remarks: errors.join("\n")
                    };
                }

                return {
                    status: "Success",
                    remarks: "Validated successfully."
                };

            } catch (err) {
                console.error("GST validation error:", err);
                return {
                    status: "Failed",
                    remarks: "A technical error occurred while validating the GST Number."
                };
            }
        },

        _resetForm: function () {
            const oModel = this.getView().getModel();
            oModel.setProperty("/supplierData", {
                supplierName: "",
                mainAddress: {
                    street: "",
                    line2: "",
                    line3: "",
                    city: "",
                    postalCode: "",
                    country: "",
                    region: ""
                },
                primaryContact: {
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: ""
                },
                categoryAndRegion: {
                    category: "",
                    region: ""
                },
                additionalInfo: {
                    details: ""
                }
            });
            oModel.setProperty("/uploadedFiles", []);

            const oFileUploader = this.byId("fileUploader");
            if (oFileUploader) oFileUploader.clear();
        },

        onCloseProgressDialog: function () {
            if (this._oProgressDialog) {
                this._oProgressDialog.close();
            }
        },

        onExcel: function () {
            var sSuppliersUrl = this.getURL() + `/odata/v4/supplier/getsuppliers`;
            var sApproversUrl = this.getURL() + `/odata/v4/supplier/Approvers`;

            Promise.all([
                fetch(sSuppliersUrl).then(res => res.json()),
                fetch(sApproversUrl).then(res => res.json())
            ]).then(([oSuppliersRes, oApproversRes]) => {
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
        },

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
                    .catch(err => {
                        MessageBox.error("Error fetching approvers: " + err.message);
                    });
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
        },

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
                    headers: {
                        "Content-Type": "application/json"
                    },
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
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                });
                const result = await response.json();
                this.byId("inputLevel").setValue("");
                this.byId("inputCountry").setValue("");
                this.byId("inputName").setValue("");
                this.byId("inputEmail").setValue("");
                if (response.ok) {
                    MessageToast.show(result.value);
                    this.byId("createApproverDialog").close();
                } else {
                    MessageBox.error(result.error?.message || "Failed to insert approver");
                }
            } catch (e) {
                MessageBox.error("Error: " + e.message);
            }
        },

        onCancelApprover: function () {
            this.byId("createApproverDialog").close();
        },

        onCancelUpdateApprover: function () {
            this.byId("updateApproverDialog").close();
        }
    });
});