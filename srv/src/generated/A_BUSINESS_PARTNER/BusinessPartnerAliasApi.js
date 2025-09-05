"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessPartnerAliasApi = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const BusinessPartnerAlias_1 = require("./BusinessPartnerAlias");
const BusinessPartnerAliasRequestBuilder_1 = require("./BusinessPartnerAliasRequestBuilder");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
class BusinessPartnerAliasApi {
    constructor(deSerializers = odata_v2_1.defaultDeSerializers) {
        this.entityConstructor = BusinessPartnerAlias_1.BusinessPartnerAlias;
        this.deSerializers = deSerializers;
    }
    /**
     * Do not use this method or the constructor directly.
     * Use the service function as described in the documentation to get an API instance.
     */
    static _privateFactory(deSerializers = odata_v2_1.defaultDeSerializers) {
        return new BusinessPartnerAliasApi(deSerializers);
    }
    _addNavigationProperties(linkedApis) {
        this.navigationPropertyFields = {};
        return this;
    }
    requestBuilder() {
        return new BusinessPartnerAliasRequestBuilder_1.BusinessPartnerAliasRequestBuilder(this);
    }
    entityBuilder() {
        return (0, odata_v2_1.entityBuilder)(this);
    }
    customField(fieldName, isNullable = false) {
        return new odata_v2_1.CustomField(fieldName, this.entityConstructor, this.deSerializers, isNullable);
    }
    get fieldBuilder() {
        if (!this._fieldBuilder) {
            this._fieldBuilder = new odata_v2_1.FieldBuilder(BusinessPartnerAlias_1.BusinessPartnerAlias, this.deSerializers);
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
                 * Static representation of the {@link bpAliasPositionNumber} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BP_ALIAS_POSITION_NUMBER: fieldBuilder.buildEdmTypeField('BPAliasPositionNumber', 'Edm.String', false),
                /**
                 * Static representation of the {@link businessPartnerAliasName} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BUSINESS_PARTNER_ALIAS_NAME: fieldBuilder.buildEdmTypeField('BusinessPartnerAliasName', 'Edm.String', true),
                ...this.navigationPropertyFields,
                /**
                 *
                 * All fields selector.
                 */
                ALL_FIELDS: new odata_v2_1.AllFields('*', BusinessPartnerAlias_1.BusinessPartnerAlias)
            };
        }
        return this._schema;
    }
}
exports.BusinessPartnerAliasApi = BusinessPartnerAliasApi;
//# sourceMappingURL=BusinessPartnerAliasApi.js.map