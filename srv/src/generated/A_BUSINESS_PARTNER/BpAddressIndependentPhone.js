"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpAddressIndependentPhone = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * This class represents the entity "A_BPAddressIndependentPhone" of service "API_BUSINESS_PARTNER".
 */
class BpAddressIndependentPhone extends odata_v2_1.Entity {
    constructor(_entityApi) {
        super(_entityApi);
    }
}
exports.BpAddressIndependentPhone = BpAddressIndependentPhone;
/**
 * Technical entity name for BpAddressIndependentPhone.
 */
BpAddressIndependentPhone._entityName = 'A_BPAddressIndependentPhone';
/**
 * Default url path for the according service.
 */
BpAddressIndependentPhone._defaultBasePath = '/sap/opu/odata/sap/API_BUSINESS_PARTNER';
/**
 * All key fields of the BpAddressIndependentPhone entity.
 */
BpAddressIndependentPhone._keys = ['BusinessPartner', 'AddressID', 'Person', 'OrdinalNumber'];
//# sourceMappingURL=BpAddressIndependentPhone.js.map