sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (Controller, MessageToast, JSONModel, MessageBox, Fragment) {
    "use strict";

    return Controller.extend("vendorportal.controller.SupplierList", {
        onInit: function () {
    this._startAutoRefresh();
},

_startAutoRefresh: function () {
    if (this._refreshInterval) {
        clearInterval(this._refreshInterval);
    }
    this._fetchSuppliers();
    this._refreshInterval = setInterval(() => {
        if (this.getView().getDomRef()) {
            this._fetchSuppliers();
        }
    }, 5000);
},

onExit: function () {
    if (this._refreshInterval) {
        clearInterval(this._refreshInterval);
        this._refreshInterval = null;
    }
},

        getURL: function () {
            return sap.ui.require.toUrl("vendorportal");
        },

        _fetchSuppliers: function () {
    const oView = this.getView();
    const oTable = oView.byId("supplierTable");
    const oBinding = oTable ? oTable.getBinding("items") : null;
    const oModel = oView.getModel() || new JSONModel({ suppliers: [] });
    if (!oView.getModel()) oView.setModel(oModel);

    const aCurrentFilters = oBinding ? oBinding.aFilters : [];

    fetch(this.getURL() + `/odata/v4/supplier/getsuppliers`)
        .then(res => res.json())
        .then(data => {
            const suppliers = Array.isArray(data.value) ? data.value : data;
            oModel.setProperty("/suppliers", suppliers);

            if (oBinding) {
                oBinding.filter(aCurrentFilters);
            }
        })
        .catch(err => {
            MessageBox.error("Error fetching suppliers: " + err.message);
        });
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

        onNavBack: function () {
            const oHistory = sap.ui.core.routing.History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("View1", {}, true);
            }
        },
        formatStatusType: function (sStatus) {
    if (!sStatus) return "Transparent";
    sStatus = sStatus.toUpperCase();

    if (sStatus === "APPROVED") return "Accept";     // Green
    if (sStatus === "REJECTED") return "Reject";     // Red
    if (sStatus === "PENDING")  return "Attention";  // Orange

    return "Transparent";
},

onFilterSuppliers: function () {
    var oTable = this.byId("supplierTable");
    var oBinding = oTable.getBinding("items");

    var sName = this.byId("filterName").getValue();
    var sCity = this.byId("filterCity").getValue();
    var sStatus = this.byId("filterStatus").getSelectedKey();

    var aFilters = [];

    if (sName) {
        aFilters.push(new sap.ui.model.Filter("supplierName", sap.ui.model.FilterOperator.Contains, sName));
    }
    if (sCity) {
        aFilters.push(new sap.ui.model.Filter("mainAddress/city", sap.ui.model.FilterOperator.Contains, sCity));
    }
    if (sStatus) {
        aFilters.push(new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, sStatus));
    }

    oBinding.filter(aFilters);
},

onClearFilters: function () {
    this.byId("filterName").setValue("");
    this.byId("filterCity").setValue("");
    this.byId("filterStatus").setSelectedKey("");

    this.onFilterSuppliers(); // reapply with no filters
}

    });
});
