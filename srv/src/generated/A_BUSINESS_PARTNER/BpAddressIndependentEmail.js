"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpAddressIndependentEmail = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * This class represents the entity "A_BPAddressIndependentEmail" of service "API_BUSINESS_PARTNER".
 */
class BpAddressIndependentEmail extends odata_v2_1.Entity {
    constructor(_entityApi) {
        super(_entityApi);
    }
}
exports.BpAddressIndependentEmail = BpAddressIndependentEmail;
/**
 * Technical entity name for BpAddressIndependentEmail.
 */
BpAddressIndependentEmail._entityName = 'A_BPAddressIndependentEmail';
/**
 * Default url path for the according service.
 */
BpAddressIndependentEmail._defaultBasePath = '/sap/opu/odata/sap/API_BUSINESS_PARTNER';
/**
 * All key fields of the BpAddressIndependentEmail entity.
 */
BpAddressIndependentEmail._keys = ['BusinessPartner', 'AddressID', 'Person', 'OrdinalNumber'];
//# sourceMappingURL=BpAddressIndependentEmail.js.map