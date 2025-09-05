"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpAddressIndependentFax = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * This class represents the entity "A_BPAddressIndependentFax" of service "API_BUSINESS_PARTNER".
 */
class BpAddressIndependentFax extends odata_v2_1.Entity {
    constructor(_entityApi) {
        super(_entityApi);
    }
}
exports.BpAddressIndependentFax = BpAddressIndependentFax;
/**
 * Technical entity name for BpAddressIndependentFax.
 */
BpAddressIndependentFax._entityName = 'A_BPAddressIndependentFax';
/**
 * Default url path for the according service.
 */
BpAddressIndependentFax._defaultBasePath = '/sap/opu/odata/sap/API_BUSINESS_PARTNER';
/**
 * All key fields of the BpAddressIndependentFax entity.
 */
BpAddressIndependentFax._keys = ['BusinessPartner', 'AddressID', 'Person', 'OrdinalNumber'];
//# sourceMappingURL=BpAddressIndependentFax.js.map