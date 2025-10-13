sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, MessageToast, JSONModel, MessageBox, Fragment, Filter,FilterOperator) {
    "use strict";
    return Controller.extend("vendorportal.controller.View1", {

        getURL: function () {
            return sap.ui.require.toUrl("vendorportal");
        },

        onInit: function () {
            const oView = this.getView();
            const oModel = new JSONModel({
                supplierData: {
                    supplierName: "",
                    businessPartnerId: "",
                    mainAddress: { street: "", city: "", postalCode: "", country: "", region: "" },
                    primaryContact: { firstName: "", lastName: "", email: "", phone: "" },
                    categoryAndRegion: { category: "", region: "" },
                    additionalInfo: { details: "" }
                },
                aiExtractedText: "",
                gstValidation: {
                    results: [],
                    overallStatus: "Pending"
                },
                uploadedFiles: [],
                suppliers: [],
                approvers: []
            });
            this.getView().setModel(oModel);

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

            ["inpSupplierName", "inpCountry", "inpFirstName", "inpEmail", "inpCategory"].forEach(id => {
                let oInput = this.byId(id);
                if (oInput) {
                    oInput.attachChange(evt => {
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
            if (!oBusyIndicator || !oStatusIcon) return;

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
            const oModel = this.getView().getModel();
            const oData = oModel.getProperty("/supplierData");
            const aUploadedFiles = oModel.getProperty("/uploadedFiles") || [];

            if (aUploadedFiles.length === 0) {
                MessageBox.warning("Please upload at least one file to proceed.");
                return;
            }
            try {
                const checkResponse = await fetch(this.getURL() + `/odata/v4/supplier/checkIfSupplierExists`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ supplierName: oData.supplierName })
                });

                if (checkResponse.ok) {
                    const result = await checkResponse.json();
                    if (result.value === true) { // Assuming the action returns { "value": true } if exists
                        MessageBox.error(`A supplier with the name "${oData.supplierName}" already exists.`);
                        return; // Stop the function here
                    }
                } else {
                    // Handle cases where the check itself fails
                    const errorResult = await checkResponse.json();
                    MessageBox.error(errorResult.error?.message || "Failed to check supplier existence.");
                    return;
                }
            } catch (err) {
                MessageBox.error("An error occurred while checking for the supplier. Please try again.");
                console.error("Supplier check error:", err);
                return;
            }
            if (this._oProgressDialog) {
                this._oProgressDialog.open();
                this._setStepStatus("supplier", "InProgress");
                this._setStepStatus("gst", "InProgress");
                this.byId("progressDialogCloseButton").setEnabled(false);
            }

            try {
                const combinedExtractedText = await this._extractTextFromFile(aUploadedFiles[0].file);
                oModel.setProperty("/aiExtractedText", combinedExtractedText);

                const gstinRegex = /\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]\b/;
                const gstinMatch = combinedExtractedText.match(gstinRegex);
                const gstin = gstinMatch ? gstinMatch[0] : null;

                let validationData = null;
                if (gstin) {
                    validationData = await this._validateGST(gstin, oData);
                    oModel.setProperty("/gstValidation", validationData);
                    this._setStepStatus("gst", validationData.overallStatus);
                } else {
                    this._setStepStatus("gst", "Failed");
                    oModel.setProperty("/gstValidation/remarks", "GSTIN could not be parsed from extracted text.");
                }

                await fetch(this.getURL() + `/odata/v4/supplier/createSupplierWithFiles`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ supplierData: oData })
                });
                this._setStepStatus("supplier", "Success");
                this._navigationDetails = { supplierId: oData.supplierName };

                if (combinedExtractedText) {
                    await fetch(this.getURL() + `/odata/v4/supplier/saveextractedtext`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            suppliername: oData.supplierName,
                            extractedGstin: combinedExtractedText
                        })
                    });
                }

                if (validationData && validationData.results.length > 0) {
                    const validationPromises = validationData.results.map(result => {
                        return fetch(this.getURL() + `/odata/v4/supplier/saveValidationResult`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                supplierName: oData.supplierName,
                                field: result.field,
                                validationStatus: result.status,
                                validationRemarks: result.remarks
                            })
                        });
                    });
                    await Promise.all(validationPromises);
                }

                if (aUploadedFiles.length > 0) {
                    const formData = new FormData();
                    formData.append("supplierName", oData.supplierName);
                    aUploadedFiles.forEach(f => formData.append("files", f.file));
                    await fetch(this.getURL() + `/uploadattachments`, {
                        method: "POST",
                        body: formData
                    });
                }

                this._resetForm();
                const oWizard = this.byId("createWizard");
                if (oWizard) oWizard.discardProgress(this.byId("step1"));

            } catch (err) {
                console.error("An unexpected error occurred:", err);
                MessageBox.error("An unexpected error occurred during the submission process.");
                this._setStepStatus("supplier", "Failed");
                this._setStepStatus("gst", "Failed");
            } finally {
                if (this._oProgressDialog) {
                    this.byId("progressDialogCloseButton").setEnabled(true);
                }
            }
        },

        _extractTextFromFile: async function (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                const response = await fetch(this.getURL() + '/fileextraction', { method: 'POST', body: formData });

                if (!response.ok) {
                    const errData = await response.json();
                    MessageToast.show(errData.error || "Failed to extract text from file.");
                    return "";
                }
                const data = await response.json();
                return data.extractedText || "";
            } catch (err) {
                console.error("Backend text extraction error:", err);
                return "";
            }
        },

        _validateGST: async function (gstin, supplierData) {
            // Helper function to clean strings for a better comparison
            const normalizeString = (sValue) => {
                if (!sValue) {
                    return "";
                }
                // Converts to lowercase and removes all spaces, periods, and commas
                return sValue.toLowerCase().replace(/[\s.,]/g, '');
            };

            try {
                const response = await fetch(this.getURL() + '/fetchGSTDetails', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ gstin: gstin })
                });

                if (!response.ok) {
                    const errData = await response.json();
                    return { results: [], overallStatus: 'Failed', remarks: errData.error };
                }

                const gstApiData = await response.json();
                const validationResults = [];
                let overallStatus = "Success";

                // --- FIX #1: Use the normalizeString helper for a smarter comparison ---
                const isNameMatch = normalizeString(gstApiData.gstTradeName) === normalizeString(supplierData.supplierName);

                validationResults.push({
                    field: "Trade Name",
                    status: isNameMatch ? "Success" : "Failed",
                    // --- FIX #2: Show the user's input as the expected name on failure ---
                    remarks: isNameMatch ? "Match" : `Expected: ${gstApiData.gstTradeName}`
                });
                if (!isNameMatch) overallStatus = "Failed";

                const isPincodeMatch = gstApiData.gstPincode === supplierData.mainAddress.postalCode;
                validationResults.push({
                    field: "Pincode",
                    status: isPincodeMatch ? "Success" : "Failed",
                    remarks: isPincodeMatch ? "Match" : `Expected: ${gstApiData.gstPincode}`
                });
                if (!isPincodeMatch) overallStatus = "Failed";

                return { results: validationResults, overallStatus: overallStatus };

            } catch (err) {
                return { results: [], overallStatus: 'Failed', remarks: 'Technical error during validation.' };
            }
        },

        _resetForm: function () {
            const oModel = this.getView().getModel();
            oModel.setProperty("/supplierData", {
                supplierName: "",
                mainAddress: { street: "", city: "", postalCode: "", country: "", region: "" },
                primaryContact: { firstName: "", lastName: "", email: "", phone: "" },
                categoryAndRegion: { category: "", region: "" },
                additionalInfo: { details: "" }
            });
            oModel.setProperty("/uploadedFiles", []);
            oModel.setProperty("/aiExtractedText", "");
            oModel.setProperty("/gstValidation", { results: [], overallStatus: 'Pending' });

            const oFileUploader = this.byId("fileUploader");
            if (oFileUploader) oFileUploader.clear();
        },

        onCloseProgressDialog: function () {
            if (this._oProgressDialog) {
                this._oProgressDialog.close();
            }
            if (this._navigationDetails && this._navigationDetails.supplierId) {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("SupplierDetail", {
                    supplierId: this._navigationDetails.supplierId
                });

                this._navigationDetails = null;
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
            const oView = this.getView();
            if (!this._oApproverDialog) {
                this._oApproverDialog = await Fragment.load({
                    id: oView.getId(),
                    name: "vendorportal.view.ApproverList",
                    controller: this
                });
                oView.addDependent(this._oApproverDialog);
            }

            // Create a dedicated model for the dialog to manage data and UI state
            const oApproverModel = new JSONModel({
                approvers: [],
                newApprover: { name: "", email: "", level: "", country: "" },
                selectedApprover: {},
                isEditEnabled: false
            });
            this._oApproverDialog.setModel(oApproverModel, "approverModel");

            // Fetch the latest data when opening
            this._fetchApprovers();

            // Reset UI state every time
            this.byId("approverTable").removeSelections(true);
            this.byId("approverSearchField").setValue("");
            oApproverModel.setProperty("/isEditEnabled", false);

            this._oApproverDialog.open();
        },

        onCloseApproverList: function () {
            this._oApproverDialog.close();
        },

        _fetchApprovers: function () {
            const oApproverModel = this._oApproverDialog.getModel("approverModel");
            fetch(this.getURL() + `/odata/v4/supplier/Approvers`)
                .then(res => res.json())
                .then(data => {
                    const approvers = Array.isArray(data.value) ? data.value : [];
                    oApproverModel.setProperty("/approvers", approvers);
                    this.byId("approverTableTitle").setText(`Approvers (${approvers.length})`);
                })
                .catch(err => MessageBox.error("Error fetching approvers: " + err.message));
        },

        // --- UI EVENT HANDLERS ---

        onSearchApprovers: function (oEvent) {
            const sQuery = oEvent.getParameter("newValue");
    const oTable = this.byId("approverTable");
    const oBinding = oTable.getBinding("items");

    // Add a check to ensure the binding exists before filtering
    if (!oBinding) {
        return; 
    }

    if (sQuery) {
        // THE FIX: The third parameter 'false' makes the filter case-insensitive.
        const oFilter = new Filter({
            filters: [
                new Filter("name", FilterOperator.Contains, sQuery, false),
                new Filter("email", FilterOperator.Contains, sQuery, false)
            ],
            and: false
        });
        oBinding.filter([oFilter]);
    } else {
        // Remove the filter when the search field is empty
        oBinding.filter([]);
    }
        },

        onApproverSelectionChange: function (oEvent) {
            const isSelected = oEvent.getSource().getSelectedItems().length > 0;
            this._oApproverDialog.getModel("approverModel").setProperty("/isEditEnabled", isSelected);
        },

        // --- CREATE DIALOG ---

        onCreateApprover: async function () {
            const oView = this.getView();
            if (!this._oCreateApproverDialog) {
                this._oCreateApproverDialog = await Fragment.load({
                    id: oView.getId(),
                    name: "vendorportal.view.CreateApprover",
                    controller: this
                });
                oView.addDependent(this._oCreateApproverDialog);
            }
            // Share the same model between dialogs
            this._oCreateApproverDialog.setModel(this._oApproverDialog.getModel("approverModel"), "approverModel");
            this._oCreateApproverDialog.open();
        },

        onSaveApprover: async function () {
            const oApproverModel = this._oApproverDialog.getModel("approverModel");
            const oNewApprover = oApproverModel.getProperty("/newApprover");

            if (!oNewApprover.name || !oNewApprover.email || !oNewApprover.level || !oNewApprover.country) {
                MessageBox.warning("Please fill all required fields.");
                return;
            }

            const body = { approverentry: oNewApprover };

            try {
                const response = await fetch(this.getURL() + `/odata/v4/supplier/approverentry`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                if (response.ok) {
                    const result = await response.json();
                    MessageToast.show(result.value || "Approver created successfully.");
                    this._fetchApprovers();
                    oApproverModel.setProperty("/newApprover", { name: "", email: "", level: "", country: "" }); // Clear the form
                    this.onCancelApprover();
                } else {
                    const error = await response.json();
                    MessageBox.error(error.error?.message || "Failed to create approver.");
                }
            } catch (e) {
                MessageBox.error("Error: " + e.message);
            }
        },

        onCancelApprover: function () {
            this._oCreateApproverDialog.close();
        },

        // --- UPDATE DIALOG ---

        onUpdateApprover: async function () {
            const oSelectedItem = this.byId("approverTable").getSelectedItem();
            if (!oSelectedItem) return;

            const oSelectedApprover = oSelectedItem.getBindingContext("approverModel").getObject();
            this._oApproverDialog.getModel("approverModel").setProperty("/selectedApprover", { ...oSelectedApprover });

            const oView = this.getView();
            if (!this._oUpdateApproverDialog) {
                this._oUpdateApproverDialog = await Fragment.load({
                    id: oView.getId(),
                    name: "vendorportal.view.UpdateApprover",
                    controller: this
                });
                oView.addDependent(this._oUpdateApproverDialog);
            }
            this._oUpdateApproverDialog.setModel(this._oApproverDialog.getModel("approverModel"), "approverModel");
            this._oUpdateApproverDialog.open();
        },

        onSaveUpdateApprover: async function () {
            const oApproverModel = this._oApproverDialog.getModel("approverModel");
            const oSelectedApprover = oApproverModel.getProperty("/selectedApprover");

            // IMPORTANT: Your action needs the key to identify which record to update.
            // Ensure the 'ID' or unique key is part of the oSelectedApprover object.

            const body = { approverentry: oSelectedApprover };

            try {
                const response = await fetch(this.getURL() + `/odata/v4/supplier/approverupdateentry`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                if (response.ok) {
                    const result = await response.json();
                    MessageToast.show(result.value || "Approver updated successfully.");
                    this._fetchApprovers();
                    this.onCancelUpdateApprover();
                } else {
                    const error = await response.json();
                    MessageBox.error(error.error?.message || "Failed to update approver.");
                }
            } catch (e) {
                MessageBox.error("Error: " + e.message);
            }
        },

        onCancelUpdateApprover: function () {
            this._oUpdateApproverDialog.close();
        },

        // --- DELETE ACTION ---

        onDeleteApprover: function () {
            const oSelectedItem = this.byId("approverTable").getSelectedItem();
            if (!oSelectedItem) {
                // No item selected, do nothing.
                return;
            }

            const oSelectedApprover = oSelectedItem.getBindingContext("approverModel").getObject();

            MessageBox.confirm(`Are you sure you want to delete "${oSelectedApprover.name}"?`, {
                title: "Confirm Deletion",
                onClose: async (sAction) => {
                    if (sAction !== MessageBox.Action.OK) {
                        // User cancelled the action.
                        return;
                    }

                    // --- CHANGE IS HERE ---
                    const body = {
                        name: oSelectedApprover.name,
                        country: oSelectedApprover.country,
                        level: oSelectedApprover.level
                    };

                    try {
                        const response = await fetch(this.getURL() + `/odata/v4/supplier/deleteapprover`, {
                            method: "POST", // Actions are called with POST
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(body)
                        });

                        if (response.ok) {
                            MessageToast.show("Approver deleted.");
                            this._fetchApprovers(); // Refresh the list to reflect the change
                        } else {
                            const error = await response.json();
                            MessageBox.error(error.error?.message || "Deletion failed.");
                        }
                    } catch (e) {
                        MessageBox.error("An error occurred: " + e.message);
                    }
                }
            });
        }
    });
});