sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, MessageBox, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("vendorportal.controller.SupplierList", {

        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("SupplierList").attachPatternMatched(this._onRouteMatched, this);
            this._refreshInterval = null;
        },

        onExit: function () {
            if (this._refreshInterval) {
                clearInterval(this._refreshInterval);
            }
        },

        onSupplierPress: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oCtx = oItem.getBindingContext();
            const oSelectedSupplier = oCtx.getObject();
            const sSupplierName = oSelectedSupplier.supplierName;

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("SupplierDetail", {
                supplierId: sSupplierName
            });
        },

        onFilterSuppliers: function () {
            const oTable = this.byId("supplierTable");
            const oBinding = oTable.getBinding("items");

            const sName = this.byId("filterName").getValue();
            const sCity = this.byId("filterCity").getValue();
            const sStatus = this.byId("filterStatus").getSelectedKey();

            const aFilters = [];

            if (sName) {
                aFilters.push(new Filter("supplierName", FilterOperator.Contains, sName));
            }
            if (sCity) {
                aFilters.push(new Filter("mainAddress/city", FilterOperator.Contains, sCity));
            }
            if (sStatus) {
                aFilters.push(new Filter("status", FilterOperator.EQ, sStatus));
            }

            oBinding.filter(aFilters);
        },

        onClearFilters: function () {
            this.byId("filterName").setValue("");
            this.byId("filterCity").setValue("");
            this.byId("filterStatus").setSelectedKey("");
            this.onFilterSuppliers();
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
            if (!sStatus) {
                return "Transparent";
            }
            sStatus = sStatus.toUpperCase();

            switch (sStatus) {
                case "APPROVED":
                    return "Accept";
                case "REJECTED":
                    return "Reject";
                case "PENDING":
                    return "Attention";
                default:
                    return "Transparent";
            }
        },

        _onRouteMatched: function () {
            this._fetchSuppliers();

            if (this._refreshInterval) {
                clearInterval(this._refreshInterval);
            }

            this._refreshInterval = setInterval(() => {
                this._fetchSuppliers();
            }, 15000);
        },

        _fetchSuppliers: function () {
            fetch(this.getURL() + "/odata/v4/supplier/getsuppliers")
                .then(res => res.json())
                .then(data => {
                    const suppliers = Array.isArray(data.value) ? data.value : data;
                    this.getView().setModel(new JSONModel({
                        suppliers: suppliers
                    }));
                })
                .catch(err => {
                    MessageBox.error("Error fetching suppliers: " + err.message);
                });
        },

        getURL: function () {
            return sap.ui.require.toUrl("vendorportal");
        }
    });
});