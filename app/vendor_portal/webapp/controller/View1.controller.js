sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (Controller, MessageToast, JSONModel, MessageBox, Fragment) {
    "use strict";
    return Controller.extend("vendorportal.controller.View1", {
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
            if (aUploaded.length > 2) {
                sap.m.MessageBox.warning("You have uploaded more than 2 files. Please remove extra files before proceeding.");
                return;
            }
            this.byId("createWizard").nextStep();
            this.byId("btnCreateSupplier").setEnabled(true);
        }
        ,

        onInit: function () {
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
        },


        // Reset form and clear files & model
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
        onSaveSupplier: function () {
            const oData = this.getView().getModel().getProperty("/supplierData");

            const aUploaded1 = this.getView().getModel().getProperty("/uploadedFiles") || [];
            console.log(aUploaded1, "A1");
            this._files = aUploaded1.map(f => f.file);
            console.log(this._files, "A2");

            if (this._files.length > 2) {
                MessageBox.warning("Please add at max 2 files before saving.");
                return;
            }
            sap.ui.core.BusyIndicator.show(0);
            fetch(this.getURL() + `/odata/v4/supplier/createSupplierWithFiles`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ supplierData: oData })
            })
                .then(res => res.json())
                .then(result => {
                    MessageBox.show(result.value);

                    if (this._files && this._files.length > 0) {
                        const formData = new FormData();
                        formData.append("supplierName", oData.supplierName);

                        Array.from(this._files).forEach(file => {
                            formData.append("files", file);
                        });

                        return fetch(this.getURL() + `/uploadattachments`, {
                            method: "POST",
                            body: formData
                        });
                    }
                })
                .then(res => res ? res.json() : null)
                .then(r => {
                    console.log(r.value);
                    // ✅ Reset wizard after upload
                    this._resetForm();
                    const oWizard = this.byId("createWizard");
                    if (oWizard) {
                        const oFirstStep = this.byId("step1");
                        oWizard.discardProgress(oFirstStep);
                    }
                })
                .catch(err => {
                    MessageBox.error("Error saving supplier: " + err.message);
                })
                .finally(() => {
                    sap.ui.core.BusyIndicator.hide();
                });
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
                    this.byId("updateApproverDialog").close(); // ✅ consistent
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