sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, History, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("vendorportal.controller.SupplierDetail", {
        formatMimeType: function (sMimeType) {
            if (!sMimeType) {
                return "";
            }

            switch (sMimeType.toLowerCase()) {
                case "application/pdf":
                    return "PDF";
                case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    return "XLSX";
                case "application/vnd.ms-excel":
                    return "XLS";
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    return "DOCX";
                case "application/msword":
                    return "DOC";
                case "image/png":
                    return "PNG";
                case "image/jpeg":
                    return "JPEG";
                case "image/jpg":
                    return "JPG";
                default:
                    
                    const aParts = sMimeType.split("/");
                    return aParts.length > 1 ? aParts[1].toUpperCase() : sMimeType.toUpperCase();
            }
        },
        onInit: function () {
            this.getView().setModel(new JSONModel({ attachments: [] }), "attachmentsModel");
            this.getView().setModel(new JSONModel({ status: [] }), "statusModel");
            this.getView().setModel(new JSONModel({ gstChecks: [] }), "gstValidationModel");
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("SupplierDetail").attachPatternMatched(this._onObjectMatched, this);
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

        onNavBack: function () {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("SupplierList", {}, true);
            }
        },

        _onObjectMatched: function (oEvent) {
            const oView = this.getView();
            const sSupplierName = oEvent.getParameter("arguments").supplierId;

            oView.setModel(new JSONModel({}));
            oView.getModel("attachmentsModel").setProperty("/attachments", []);
            oView.getModel("statusModel").setProperty("/status", []);
             oView.getModel("gstValidationModel").setProperty("/gstChecks", []);
            oView.setBusy(true);

            const pSupplierDetails = this._fetchSupplierDetails(sSupplierName);
            const pApprovals = this._fetchApprovals(sSupplierName);
            const pAttachments = this._fetchAttachments(sSupplierName);
               const pGstDetails = this._fetchGstDetails(sSupplierName);
            Promise.all([pSupplierDetails, pApprovals, pAttachments, pGstDetails]).finally(() => {
                oView.setBusy(false);
            });
        },
        _fetchGstDetails: function (sSupplierName) {
            const sUrl = this.getURL() + `/odata/v4/supplier/gst?$filter=supplierName eq '${encodeURIComponent(sSupplierName)}'`;
            return fetch(sUrl)
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch GST details.");
                    }
                    return res.json();
                })
                .then(data => {
                    const aGstChecks = data.value || [];
                    this.getView().getModel("gstValidationModel").setProperty("/gstChecks", aGstChecks);
                })
                .catch(err => {
                    // Don't show a popup for this, as it might not exist for all suppliers
                    console.error("Error fetching GST details:", err.message);
                });
        },
        _fetchSupplierDetails: function (sSupplierName) {
            return fetch(this.getURL() + `/odata/v4/supplier/getsuppliers`)
                .then(res => res.json())
                .then(data => {
                    const aSuppliers = Array.isArray(data.value) ? data.value : [];
                    const oSupplier = aSuppliers.find(supplier => supplier.supplierName === sSupplierName);

                    if (oSupplier) {
                        this.getView().setModel(new JSONModel(oSupplier));
                        this.getView().bindElement("/");
                    } else {
                        MessageBox.error("Supplier not found: " + sSupplierName);
                    }
                })
                .catch(err => {
                    MessageBox.error("Error fetching supplier details: " + err.message);
                });
        },

        _fetchApprovals: function (supplierName) {
            return fetch(this.getURL() + `/odata/v4/supplier/Approvals?suppliername=${supplierName}`)
                .then(res => res.json())
                .then(data => {
                    const aStatus = data.value || [];
                    this.getView().getModel("statusModel").setProperty("/status", aStatus);
                })
                .catch(err => {
                    MessageBox.error("Error fetching approvals: " + err.message);
                });
        },

        _fetchAttachments: function (supplierName) {
            return fetch(this.getURL() + `/odata/v4/supplier/downloadAttachments(supplierName='${encodeURIComponent(supplierName)}')`)
                .then(res => res.json())
                .then(data => {
                    const files = Array.isArray(data) ? data : data.value || [];
                    this.getView().getModel("attachmentsModel").setProperty("/attachments", files);
                })
                .catch(err => {
                    MessageBox.error("Error loading attachments: " + err.message);
                });
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

        getURL: function () {
            return sap.ui.require.toUrl("vendorportal");
        }
    });
});