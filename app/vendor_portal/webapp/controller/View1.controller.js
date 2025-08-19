sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (Controller, MessageToast, JSONModel, MessageBox, Fragment) {
    "use strict";

    return Controller.extend("vendorportal.controller.View1", {

        onInit: function () {
            const oModel = new JSONModel({
                supplierData: {
                    supplierName: "",
                    mainAddress: { street: "", line2:"", line3:"", city:"", postalCode:"", country:"", region:"" },
                    primaryContact: { firstName: "", lastName: "", email:"", phone:"" },
                    categoryAndRegion: { category:"", region:"" },
                    additionalInfo: { details:"" }
                },
                suppliers: []
            });
            this.getView().setModel(oModel);
            this.getSuppliers();
        },

        getSuppliers: function () {
            fetch("/odata/v4/supplier/getsuppliers")
                .then(res => res.json())
                .then(data => {
                    this.getView().getModel().setProperty("/suppliers", Array.isArray(data.value) ? data.value : data);
                })
                .catch(err => {
                    MessageBox.error("Error fetching suppliers: " + err.message);
                });
        },

        onFileChange: function (oEvent) {
            this._files = oEvent.getParameter("files") || [];
            MessageToast.show(`${this._files.length} file(s) selected.`);
        },

        onSaveSupplier: function () {
            const oData = this.getView().getModel().getProperty("/supplierData");
            console.log("Odata",oData);
            if (!oData.supplierName) {
                MessageBox.warning("Please enter Supplier Name before saving.");
                return;
            }

            fetch("/odata/v4/supplier/createSupplierWithFiles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ supplierData: oData })
            })
            .then(res => res.text())
            .then(msg => {
                MessageToast.show(msg);

                if (this._files && this._files.length > 0) {
                    Array.from(this._files).forEach(file => {
                        const formData = new FormData();
                        formData.append("file", file);
                        
                        formData.append("supplierName", oData.supplierName);
                        console.log("Hit",formData);
                        fetch("/uploadattachments", { method: "POST", body: formData })
                        .catch(err => { MessageBox.error("File upload error: " + err.message); });
                    });
                }

                this.getSuppliers();
                this._resetForm();
            })
            .catch(err => {
                MessageBox.error("Error saving supplier: " + err.message);
            });
        },

        _resetForm: function () {
            this.getView().getModel().setProperty("/supplierData", {
                supplierName: "",
                mainAddress: { street: "", line2:"", line3:"", city:"", postalCode:"", country:"", region:"" },
                primaryContact: { firstName: "", lastName: "", email:"", phone:"" },
                categoryAndRegion: { category:"", region:"" },
                additionalInfo: { details:"" }
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
            fetch("/odata/v4/supplier/getsuppliers")
                .then(res => res.json())
                .then(data => {
                    const suppliers = Array.isArray(data.value) ? data.value : data;
                    this.getView().getModel().setProperty("/suppliers", suppliers);
                })
                .catch(err => { MessageBox.error("Error fetching suppliers: " + err.message); });
        },

        onViewSupplier: function(oEvent) {
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
                    oDialog.open();
                });
            } else {
                this._oSupplierDetailsDialog.setModel(new JSONModel(oSupplier), "selectedSupplier");
                this._oSupplierDetailsDialog.open();
            }
        },

        onCloseSupplierDetails: function() {
            if (this._oSupplierDetailsDialog) this._oSupplierDetailsDialog.close();
        },

        onDownloadAttachment: function(oEvent) {
    const oAttachment = oEvent.getSource().getBindingContext("selectedSupplier").getObject();
    const supplierName = oAttachment.supplierName;   // ensure this is in model
    const fileName = oAttachment.fileName;           // you can also pass ID if needed

    if (!supplierName || !fileName) {
        MessageBox.warning("Missing supplier or file information.");
        return;
    }

    
    fetch("/odata/v4/supplier/downloadAttachments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierName })   
    })
    .then(res => {
        if (!res.ok) throw new Error("Download failed: " + res.statusText);
        return res.json();
    })
    .then(files => {
        const file = files.find(f => f.fileName === fileName);
        if (!file) {
            MessageBox.error("File not found on server.");
            return;
        }

        const blob = this._base64ToBlob(file.content, file.mimeType);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = file.fileName;
        link.click();
        URL.revokeObjectURL(link.href);
    })
    .catch(err => {
        MessageBox.error("Error downloading file: " + err.message);
    });
},


        _base64ToBlob: function(b64Data, contentType) {
            contentType = contentType || '';
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
        }

    });
});
