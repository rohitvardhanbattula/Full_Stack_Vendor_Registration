"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpAddressIndependentFaxApi = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const BpAddressIndependentFax_1 = require("./BpAddressIndependentFax");
const BpAddressIndependentFaxRequestBuilder_1 = require("./BpAddressIndependentFaxRequestBuilder");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
class BpAddressIndependentFaxApi {
    constructor(deSerializers = odata_v2_1.defaultDeSerializers) {
        this.entityConstructor = BpAddressIndependentFax_1.BpAddressIndependentFax;
        this.deSerializers = deSerializers;
    }
    /**
     * Do not use this method or the constructor directly.
     * Use the service function as described in the documentation to get an API instance.
     */
    static _privateFactory(deSerializers = odata_v2_1.defaultDeSerializers) {
        return new BpAddressIndependentFaxApi(deSerializers);
    }
    _addNavigationProperties(linkedApis) {
        this.navigationPropertyFields = {};
        return this;
    }
    requestBuilder() {
        return new BpAddressIndependentFaxRequestBuilder_1.BpAddressIndependentFaxRequestBuilder(this);
    }
    entityBuilder() {
        return (0, odata_v2_1.entityBuilder)(this);
    }
    customField(fieldName, isNullable = false) {
        return new odata_v2_1.CustomField(fieldName, this.entityConstructor, this.deSerializers, isNullable);
    }
    get fieldBuilder() {
        if (!this._fieldBuilder) {
            this._fieldBuilder = new odata_v2_1.FieldBuilder(BpAddressIndependentFax_1.BpAddressIndependentFax, this.deSerializers);
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
                 * Static representation of the {@link faxCountry} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                FAX_COUNTRY: fieldBuilder.buildEdmTypeField('FaxCountry', 'Edm.String', true),
                /**
                 * Static representation of the {@link faxAreaCodeSubscriberNumber} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                FAX_AREA_CODE_SUBSCRIBER_NUMBER: fieldBuilder.buildEdmTypeField('FaxAreaCodeSubscriberNumber', 'Edm.String', true),
                /**
                 * Static representation of the {@link faxNumberExtension} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                FAX_NUMBER_EXTENSION: fieldBuilder.buildEdmTypeField('FaxNumberExtension', 'Edm.String', true),
                /**
                 * Static representation of the {@link internationalFaxNumber} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                INTERNATIONAL_FAX_NUMBER: fieldBuilder.buildEdmTypeField('InternationalFaxNumber', 'Edm.String', true),
                /**
                 * Static representation of the {@link isDefaultFaxNumber} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                IS_DEFAULT_FAX_NUMBER: fieldBuilder.buildEdmTypeField('IsDefaultFaxNumber', 'Edm.Boolean', true),
                /**
                 * Static representation of the {@link validityEndDate} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                VALIDITY_END_DATE: fieldBuilder.buildEdmTypeField('ValidityEndDate', 'Edm.DateTime', true),
                /**
                 * Static representation of the {@link validityStartDate} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                VALIDITY_START_DATE: fieldBuilder.buildEdmTypeField('ValidityStartDate', 'Edm.DateTime', true),
                ...this.navigationPropertyFields,
                /**
                 *
                 * All fields selector.
                 */
                ALL_FIELDS: new odata_v2_1.AllFields('*', BpAddressIndependentFax_1.BpAddressIndependentFax)
            };
        }
        return this._schema;
    }
}
exports.BpAddressIndependentFaxApi = BpAddressIndependentFaxApi;
//# sourceMappingURL=BpAddressIndependentFaxApi.js.map