"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessPartnerIsBankApi = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const BusinessPartnerIsBank_1 = require("./BusinessPartnerIsBank");
const BusinessPartnerIsBankRequestBuilder_1 = require("./BusinessPartnerIsBankRequestBuilder");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
class BusinessPartnerIsBankApi {
    constructor(deSerializers = odata_v2_1.defaultDeSerializers) {
        this.entityConstructor = BusinessPartnerIsBank_1.BusinessPartnerIsBank;
        this.deSerializers = deSerializers;
    }
    /**
     * Do not use this method or the constructor directly.
     * Use the service function as described in the documentation to get an API instance.
     */
    static _privateFactory(deSerializers = odata_v2_1.defaultDeSerializers) {
        return new BusinessPartnerIsBankApi(deSerializers);
    }
    _addNavigationProperties(linkedApis) {
        this.navigationPropertyFields = {};
        return this;
    }
    requestBuilder() {
        return new BusinessPartnerIsBankRequestBuilder_1.BusinessPartnerIsBankRequestBuilder(this);
    }
    entityBuilder() {
        return (0, odata_v2_1.entityBuilder)(this);
    }
    customField(fieldName, isNullable = false) {
        return new odata_v2_1.CustomField(fieldName, this.entityConstructor, this.deSerializers, isNullable);
    }
    get fieldBuilder() {
        if (!this._fieldBuilder) {
            this._fieldBuilder = new odata_v2_1.FieldBuilder(BusinessPartnerIsBank_1.BusinessPartnerIsBank, this.deSerializers);
        }
        return this._fieldBuilder;
    }
    get schema() {
        if (!this._schema) {
            const fieldBuilder = this.fieldBuilder;
            this._schema = {
                /**
                 * Static representation of the {@link businessPartner} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BUSINESS_PARTNER: fieldBuilder.buildEdmTypeField('BusinessPartner', 'Edm.String', false),
                /**
                 * Static representation of the {@link bankKey} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BANK_KEY: fieldBuilder.buildEdmTypeField('BankKey', 'Edm.String', true),
                /**
                 * Static representation of the {@link bankCountry} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BANK_COUNTRY: fieldBuilder.buildEdmTypeField('BankCountry', 'Edm.String', true),
                /**
                 * Static representation of the {@link bpMinimumReserve} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BP_MINIMUM_RESERVE: fieldBuilder.buildEdmTypeField('BPMinimumReserve', 'Edm.String', true),
                ...this.navigationPropertyFields,
                /**
                 *
                 * All fields selector.
                 */
                ALL_FIELDS: new odata_v2_1.AllFields('*', BusinessPartnerIsBank_1.BusinessPartnerIsBank)
            };
        }
        return this._schema;
    }
}
exports.BusinessPartnerIsBankApi = BusinessPartnerIsBankApi;
//# sourceMappingURL=BusinessPartnerIsBankApi.js.map