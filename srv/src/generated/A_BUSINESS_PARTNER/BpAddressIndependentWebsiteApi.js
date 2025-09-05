"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpAddressIndependentWebsiteApi = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const BpAddressIndependentWebsite_1 = require("./BpAddressIndependentWebsite");
const BpAddressIndependentWebsiteRequestBuilder_1 = require("./BpAddressIndependentWebsiteRequestBuilder");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
class BpAddressIndependentWebsiteApi {
    constructor(deSerializers = odata_v2_1.defaultDeSerializers) {
        this.entityConstructor = BpAddressIndependentWebsite_1.BpAddressIndependentWebsite;
        this.deSerializers = deSerializers;
    }
    /**
     * Do not use this method or the constructor directly.
     * Use the service function as described in the documentation to get an API instance.
     */
    static _privateFactory(deSerializers = odata_v2_1.defaultDeSerializers) {
        return new BpAddressIndependentWebsiteApi(deSerializers);
    }
    _addNavigationProperties(linkedApis) {
        this.navigationPropertyFields = {};
        return this;
    }
    requestBuilder() {
        return new BpAddressIndependentWebsiteRequestBuilder_1.BpAddressIndependentWebsiteRequestBuilder(this);
    }
    entityBuilder() {
        return (0, odata_v2_1.entityBuilder)(this);
    }
    customField(fieldName, isNullable = false) {
        return new odata_v2_1.CustomField(fieldName, this.entityConstructor, this.deSerializers, isNullable);
    }
    get fieldBuilder() {
        if (!this._fieldBuilder) {
            this._fieldBuilder = new odata_v2_1.FieldBuilder(BpAddressIndependentWebsite_1.BpAddressIndependentWebsite, this.deSerializers);
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
                 * Static representation of the {@link addressId} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                ADDRESS_ID: fieldBuilder.buildEdmTypeField('AddressID', 'Edm.String', false),
                /**
                 * Static representation of the {@link person} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                PERSON: fieldBuilder.buildEdmTypeField('Person', 'Edm.String', false),
                /**
                 * Static representation of the {@link ordinalNumber} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                ORDINAL_NUMBER: fieldBuilder.buildEdmTypeField('OrdinalNumber', 'Edm.String', false),
                /**
                 * Static representation of the {@link isDefaultUrlAddress} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                IS_DEFAULT_URL_ADDRESS: fieldBuilder.buildEdmTypeField('IsDefaultURLAddress', 'Edm.Boolean', true),
                /**
                 * Static representation of the {@link urlFieldLength} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                URL_FIELD_LENGTH: fieldBuilder.buildEdmTypeField('URLFieldLength', 'Edm.Int32', true),
                /**
                 * Static representation of the {@link websiteUrl} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                WEBSITE_URL: fieldBuilder.buildEdmTypeField('WebsiteURL', 'Edm.String', true),
                ...this.navigationPropertyFields,
                /**
                 *
                 * All fields selector.
                 */
                ALL_FIELDS: new odata_v2_1.AllFields('*', BpAddressIndependentWebsite_1.BpAddressIndependentWebsite)
            };
        }
        return this._schema;
    }
}
exports.BpAddressIndependentWebsiteApi = BpAddressIndependentWebsiteApi;
//# sourceMappingURL=BpAddressIndependentWebsiteApi.js.map