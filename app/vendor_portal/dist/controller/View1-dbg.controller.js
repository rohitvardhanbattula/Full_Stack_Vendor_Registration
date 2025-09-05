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
        onNextStep1: function () {
            let sName = this.byId("inpSupplierName").getValue();
            if (!sName) {
                sap.m.MessageBox.warning("Supplier Name is required.");
                return;
            }
            this.byId("createWizard").nextStep();
        },

        onNextStep2: function () {
            let sFirst = this.byId("inpFirstName").getValue();
            let sEmail = this.byId("inpEmail").getValue();
            if (!sFirst || !sEmail) {
                sap.m.MessageBox.warning("First Name and Email are required.");
                return;
            }
            this.byId("createWizard").nextStep();
        },

        onNextStep3: function () {
            let sCategory = this.byId("inpCategory").getValue();
            if (!sCategory) {
                sap.m.MessageBox.warning("Category is required.");
                return;
            }
            this.byId("createWizard").nextStep();
        },

        onNextStep4: function () {
            // You can validate file uploads if required
            this.byId("createWizard").nextStep();

            // ✅ Enable Create Supplier button at last step
            this.byId("btnCreateSupplier").setEnabled(true);
        },

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
                suppliers: []
            });
            this.getView().setModel(oModel);
        },


        onFileChange: function (oEvent) {
            this._files = oEvent.getParameter("files") || [];


            MessageToast.show(`${this._files.length} file(s) selected.`);
        },

        onSaveSupplier: function () {
            const oData = this.getView().getModel().getProperty("/supplierData");
            if (!oData.supplierName) {
                MessageBox.warning("Please enter Supplier Name before saving.");
                return;
            }

            fetch(this.getURL() + `/odata/v4/supplier/createSupplierWithFiles`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ supplierData: oData })
            })
                .then(res => res.json())
                .then(result => {
                    MessageToast.show(result.value);

                    // ✅ Upload all files in a single request
                    if (this._files && this._files.length > 0) {
                        const formData = new FormData();
                        formData.append("supplierName", oData.supplierName);

                        Array.from(this._files).forEach(file => {
                            formData.append("files", file); // 👈 all under "files"
                        });

                        fetch(this.getURL() + `/uploadattachments`, {
                            method: "POST",
                            body: formData
                        })
                            .then(res => res.json())
                            .then(r => {
                                MessageToast.show(r.message);
                            })
                            .catch(err => MessageBox.error("File upload error: " + err.message));
                    }

                    // ✅ Reset wizard
                    this._resetForm();
                    const oWizard = this.byId("createWizard");
                    if (oWizard) {
                        const oFirstStep = this.byId("step1");
                        oWizard.discardProgress(oFirstStep);
                    }
                })
                .catch(err => {
                    MessageBox.error("Error saving supplier: " + err.message);
                });

        },

        _resetForm: function () {
            this.getView().getModel().setProperty("/supplierData", {
                supplierName: "",
                mainAddress: { street: "", line2: "", line3: "", city: "", postalCode: "", country: "", region: "" },
                primaryContact: { firstName: "", lastName: "", email: "", phone: "" },
                categoryAndRegion: { category: "", region: "" },
                additionalInfo: { details: "" }
            });
            this._files = [];
            const oFileUploader = this.byId("fileUploader");
            if (oFileUploader) oFileUploader.clear();
        },

        onOpenSupplierList: function () {
            const oView = this.getView();
            if (!this._oSupplierDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "vendorportal.view.SupplierList",
                    controller: this
                }).then(oDialog => {
                    this._oSupplierDialog = oDialog;
                    oView.addDependent(this._oSupplierDialog);
                    this._fetchSuppliers();
                    this._oSupplierDialog.open();
                });
            } else {
                this._fetchSuppliers();
                this._oSupplierDialog.open();
            }
        },

        onCloseSupplierList: function () {
            if (this._oSupplierDialog) this._oSupplierDialog.close();
        },

        _fetchSuppliers: function () {
            fetch(this.getURL() + `/odata/v4/supplier/getsuppliers`)
                .then(res => res.json())
                .then(data => {
                    const suppliers = Array.isArray(data.value) ? data.value : data;
                    this.getView().getModel().setProperty("/suppliers", suppliers);
                })
                .catch(err => { MessageBox.error("Error fetching suppliers: " + err.message); });
        },

        onViewSupplier: function (oEvent) {
            const oSupplier = oEvent.getSource().getBindingContext().getObject();
            const oView = this.getView();

            if (!this._oSupplierDetailsDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "vendorportal.view.SupplierDetails",
                    controller: this
                }).then(oDialog => {
                    this._oSupplierDetailsDialog = oDialog;
                    oView.addDependent(this._oSupplierDetailsDialog);
                    oDialog.setModel(new JSONModel(oSupplier), "selectedSupplier");
                    this._loadAttachments(oSupplier.supplierName);
                    oDialog.open();
                });
            } else {
                this._oSupplierDetailsDialog.setModel(new JSONModel(oSupplier), "selectedSupplier");
                this._loadAttachments(oSupplier.supplierName);
                this._oSupplierDetailsDialog.open();
            }
        },

        onCloseSupplierDetails: function () {
            if (this._oSupplierDetailsDialog) {
                this._oSupplierDetailsDialog.close();
            }
        },

        _loadAttachments: function (supplierName) {
            fetch(this.getURL() + `/odata/v4/supplier/downloadAttachments(supplierName='${encodeURIComponent(supplierName)}')`)
                .then(res => res.json())
                .then(data => {
                    const files = Array.isArray(data) ? data : data.value || [];
                    const oAttachmentsModel = new JSONModel({ attachments: files });
                    this._oSupplierDetailsDialog.setModel(oAttachmentsModel, "attachmentsModel");
                })
                .catch(err => {
                    MessageBox.error("Error loading attachments: " + err.message);
                });
        },

        onDownloadAttachment: function (oEvent) {
            const oAttachment = oEvent.getSource().getBindingContext("attachmentsModel").getObject();

            if (!oAttachment || !oAttachment.fileName) {
                MessageBox.warning("File information missing.");
                return;
            }

            const blob = this._base64ToBlob(oAttachment.content, oAttachment.mimeType);
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = oAttachment.fileName;
            link.click();
            URL.revokeObjectURL(link.href);
        },

        _base64ToBlob: function (b64Data, contentType) {
            contentType = contentType || "";
            const sliceSize = 512;
            const byteCharacters = atob(b64Data);
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                const slice = byteCharacters.slice(offset, offset + sliceSize);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                byteArrays.push(new Uint8Array(byteNumbers));
            }
            return new Blob(byteArrays, { type: contentType });
        },
        onViewStatus: function (oEvent) {
            const oSupplier = oEvent.getSource().getBindingContext().getObject();
            const oView = this.getView();
            fetch(this.getURL() + `/odata/v4/supplier/Approvals?suppliername=${oSupplier.supplierName}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch supplier status");
                    }
                    return response.json();
                })
                .then(data => {
                    const aStatus = data.value || [];

                    const oStatusModel = new sap.ui.model.json.JSONModel({ status: aStatus });
                    oView.setModel(oStatusModel, "statusModel");

                    if (!this._oSupplierStatusDialog) {
                        sap.ui.core.Fragment.load({
                            id: oView.getId(),
                            name: "vendorportal.view.SupplierStatus",
                            controller: this
                        }).then(oDialog => {
                            this._oSupplierStatusDialog = oDialog;
                            oView.addDependent(this._oSupplierStatusDialog);
                            this._oSupplierStatusDialog.open();
                        });
                    } else {
                        this._oSupplierStatusDialog.open();
                    }
                })
                .catch(err => {
                    sap.m.MessageToast.show("Error: " + err.message);
                });
        },


        onCloseSupplierStatus: function () {
            if (this._oSupplierStatusDialog) {
                this._oSupplierStatusDialog.close();
            }
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
            fetch(this.getURL() + `/odata/v4/supplier/Approvers`)
                .then(res => res.json())
                .then(data => {
                    const approvers = Array.isArray(data.value) ? data.value : data;
                    this.getView().getModel().setProperty("/approvers", approvers);
                })
                .catch(err => { MessageBox.error("Error fetching suppliers: " + err.message); });

            this._oApproverDialog.open();
        },

        onCloseApproverList: function () {
            if (this._oApproverDialog) {
                this._oApproverDialog.close();
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
        }


    });
});