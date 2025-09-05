"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpEmployment = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * This class represents the entity "A_BPEmployment" of service "API_BUSINESS_PARTNER".
 */
class BpEmployment extends odata_v2_1.Entity {
    constructor(_entityApi) {
        super(_entityApi);
    }
}
exports.BpEmployment = BpEmployment;
/**
 * Technical entity name for BpEmployment.
 */
BpEmployment._entityName = 'A_BPEmployment';
/**
 * Default url path for the according service.
 */
BpEmployment._defaultBasePath = '/sap/opu/odata/sap/API_BUSINESS_PARTNER';
/**
 * All key fields of the BpEmployment entity.
 */
BpEmployment._keys = ['BusinessPartner', 'BPEmploymentStartDate'];
//# sourceMappingURL=BpEmployment.js.map