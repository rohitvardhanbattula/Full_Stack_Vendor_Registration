sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (Controller, MessageToast, JSONModel, MessageBox, Fragment) {
    "use strict";

    return Controller.extend("vendorportal.controller.SupplierList", {


        getURL: function () {
            return sap.ui.require.toUrl("vendorportal");
        },
onInit: function () {
        
        this.getOwnerComponent().getRouter().getRoute("SupplierList").attachMatched(this._onRouteMatched, this);
        this.getOwnerComponent().getRouter().getRoute("SupplierList").attachPatternMatched(this._onRouteMatched, this);
        
       
        this._refreshInterval = null;
    },

    _onRouteMatched: function () {
        // Fetch suppliers immediately
        this._fetchSuppliers();

        // Clear any existing interval
        if (this._refreshInterval) {
            clearInterval(this._refreshInterval);
        }

        // Start auto-refresh every 5 sec
        this._refreshInterval = setInterval(() => {
            this._fetchSuppliers();
            // Also refresh the approvals if dialog is open
            if (this._oSupplierDetailsDialog && this._oSupplierDetailsDialog.isOpen()) {
                const oSupplier = this._oSupplierDetailsDialog.getModel("selectedSupplier").getData();
                this._fetchApprovals(oSupplier.supplierName);
            }
        }, 15000);
    },

    onExit: function () {
        // Clear interval when leaving the page
        if (this._refreshInterval) {
            clearInterval(this._refreshInterval);
        }
    },

    _fetchSuppliers: function () {
        fetch(this.getURL() + `/odata/v4/supplier/getsuppliers`)
            .then(res => res.json())
            .then(data => {
                const suppliers = Array.isArray(data.value) ? data.value : data;
                this.getView().setModel(new JSONModel({ suppliers: suppliers }));
            })
            .catch(err => {
                MessageBox.error("Error fetching suppliers: " + err.message);
            });
    },

    _fetchApprovals: function (supplierName) {
        fetch(this.getURL() + `/odata/v4/supplier/Approvals?suppliername=${supplierName}`)
            .then(res => res.json())
            .then(data => {
                const aStatus = data.value || [];
                const oStatusModel = new JSONModel({ status: aStatus });
                this.getView().setModel(oStatusModel, "statusModel");
            })
            .catch(err => {
                MessageToast.show("Error fetching approvals: " + err.message);
            });
    },

    onViewSupplier: function (oEvent) {
        const oSupplier = oEvent.getSource().getBindingContext().getObject();
        const oView = this.getView();

        this._fetchApprovals(oSupplier.supplierName);

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
