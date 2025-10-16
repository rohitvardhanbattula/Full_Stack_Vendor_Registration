sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator", "sap/ui/core/library"
], function (Controller, JSONModel, MessageBox, Filter, FilterOperator, coreLibrary) {
    "use strict";
    const ValueState = coreLibrary.ValueState;
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

        formatStatusState: function (sStatus) {
            switch (sStatus) {
                case "APPROVED":
                    return ValueState.Success;
                case "REJECTED":
                    return ValueState.Error;
                case "PENDING":
                    return ValueState.Warning;
                default:
                    return ValueState.None;
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
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(data => {
                    const suppliers = Array.isArray(data.value) ? data.value : [];
                    // Get the specific named model "supplierModel"
                    let oModel = this.getView().getModel("supplierModel");

                    if (oModel) {
                        // If it exists, just set its data
                        oModel.setData({ suppliers: suppliers });
                    } else {
                        // If not, create a new JSONModel
                        oModel = new JSONModel({ suppliers: suppliers });
                        // And set it on the view with the name "supplierModel"
                        this.getView().setModel(oModel, "supplierModel");
                    }
                    
                    oModel.refresh(true); // Ensure all bindings are updated
                    this.byId("deleteModeButton").setVisible(suppliers.length > 0);
                })
                .catch(err => {
                    MessageBox.error("Error fetching suppliers: " + err.message);
                });
        },
        onClearFilters: function () {
            // Clear the input fields
            this.byId("filterName").setValue("");
            this.byId("filterCity").setValue("");
            
            // Reset the Select control to the "All" option
            this.byId("filterStatus").setSelectedKey("");

            // Trigger the filter logic again to refresh the table with no filters
            this.onFilterSuppliers();
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

        onSupplierPress: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const sSupplierName = oItem.getBindingContext("supplierModel").getProperty("supplierName");
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("SupplierDetail", {
                supplierId: sSupplierName
            });
        },

        onDeleteMode: function () {
            const oTable = this.byId("supplierTable");
            oTable.setMode("MultiSelect");
            this.byId("deleteModeButton").setVisible(false);
            this.byId("confirmDeleteButton").setVisible(true);
            this.byId("cancelDeleteButton").setVisible(true);
        },

        onCancelDelete: function () {
            const oTable = this.byId("supplierTable");
            oTable.setMode("None");
            oTable.removeSelections(true);
            this.byId("deleteModeButton").setVisible(true);
            this.byId("confirmDeleteButton").setVisible(false);
            this.byId("cancelDeleteButton").setVisible(false);
        },

        onDeleteSelectedSuppliers: function () {
            const aSelectedItems = this.byId("supplierTable").getSelectedItems();

            if (aSelectedItems.length === 0) {
                MessageBox.warning("Please select at least one supplier to delete.");
                return;
            }

            const sConfirmationMessage = `Are you sure you want to delete these ${aSelectedItems.length} supplier(s)?`;
            MessageBox.confirm(sConfirmationMessage, {
                title: "Confirm Deletion",
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        this._performDeletion(aSelectedItems);
                    }
                }
            });
        },

        _performDeletion: function (aItemsToDelete) {
            const sActionUrl = this.getURL() + "/odata/v4/supplier/deletesuppliers";
            const aPromises = aItemsToDelete.map(oItem => {
                const sSupplierKey = oItem.getBindingContext("supplierModel").getProperty("supplierName");
                return fetch(sActionUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ supplierName: sSupplierKey })
                });
            });

            Promise.all(aPromises)
                .then(aResponses => {
                    const aFailed = aResponses.filter(res => !res.ok);
                    if (aFailed.length > 0) {
                        MessageBox.error(`${aFailed.length} deletion(s) failed.`);
                    } else {
                        MessageBox.success(`${aResponses.length} supplier(s) deleted successfully.`);
                    }
                })
                .catch(err => {
                    MessageBox.error("An error occurred during deletion: " + err.message);
                })
                .finally(() => {
                    this.onCancelDelete();
                    this._fetchSuppliers();
                });
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

        getURL: function () {
            return sap.ui.require.toUrl("vendorportal");
        }
    });
});