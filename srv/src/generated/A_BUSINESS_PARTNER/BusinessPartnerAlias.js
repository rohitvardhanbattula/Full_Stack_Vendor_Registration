"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessPartnerAlias = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * This class represents the entity "A_BusinessPartnerAlias" of service "API_BUSINESS_PARTNER".
 */
class BusinessPartnerAlias extends odata_v2_1.Entity {
    constructor(_entityApi) {
        super(_entityApi);
    }
}
exports.BusinessPartnerAlias = BusinessPartnerAlias;
/**
 * Technical entity name for BusinessPartnerAlias.
 */
BusinessPartnerAlias._entityName = 'A_BusinessPartnerAlias';
/**
 * Default url path for the according service.
 */
BusinessPartnerAlias._defaultBasePath = '/sap/opu/odata/sap/API_BUSINESS_PARTNER';
/**
 * All key fields of the BusinessPartnerAlias entity.
 */
BusinessPartnerAlias._keys = ['BusinessPartner', 'BPAliasPositionNumber'];
//# sourceMappingURL=BusinessPartnerAlias.js.map