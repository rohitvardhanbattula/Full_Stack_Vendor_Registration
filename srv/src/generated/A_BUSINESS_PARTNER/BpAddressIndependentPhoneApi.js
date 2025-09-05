"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpAddressIndependentPhoneApi = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const BpAddressIndependentPhone_1 = require("./BpAddressIndependentPhone");
const BpAddressIndependentPhoneRequestBuilder_1 = require("./BpAddressIndependentPhoneRequestBuilder");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
class BpAddressIndependentPhoneApi {
    constructor(deSerializers = odata_v2_1.defaultDeSerializers) {
        this.entityConstructor = BpAddressIndependentPhone_1.BpAddressIndependentPhone;
        this.deSerializers = deSerializers;
    }
    /**
     * Do not use this method or the constructor directly.
     * Use the service function as described in the documentation to get an API instance.
     */
    static _privateFactory(deSerializers = odata_v2_1.defaultDeSerializers) {
        return new BpAddressIndependentPhoneApi(deSerializers);
    }
    _addNavigationProperties(linkedApis) {
        this.navigationPropertyFields = {};
        return this;
    }
    requestBuilder() {
        return new BpAddressIndependentPhoneRequestBuilder_1.BpAddressIndependentPhoneRequestBuilder(this);
    }
    entityBuilder() {
        return (0, odata_v2_1.entityBuilder)(this);
    }
    customField(fieldName, isNullable = false) {
        return new odata_v2_1.CustomField(fieldName, this.entityConstructor, this.deSerializers, isNullable);
    }
    get fieldBuilder() {
        if (!this._fieldBuilder) {
            this._fieldBuilder = new odata_v2_1.FieldBuilder(BpAddressIndependentPhone_1.BpAddressIndependentPhone, this.deSerializers);
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
                 * Static representation of the {@link destinationLocationCountry} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DESTINATION_LOCATION_COUNTRY: fieldBuilder.buildEdmTypeField('DestinationLocationCountry', 'Edm.String', true),
                /**
                 * Static representation of the {@link internationalPhoneNumber} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                INTERNATIONAL_PHONE_NUMBER: fieldBuilder.buildEdmTypeField('InternationalPhoneNumber', 'Edm.String', true),
                /**
                 * Static representation of the {@link isDefaultPhoneNumber} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                IS_DEFAULT_PHONE_NUMBER: fieldBuilder.buildEdmTypeField('IsDefaultPhoneNumber', 'Edm.Boolean', true),
                /**
                 * Static representation of the {@link phoneNumber} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                PHONE_NUMBER: fieldBuilder.buildEdmTypeField('PhoneNumber', 'Edm.String', true),
                /**
                 * Static representation of the {@link phoneNumberExtension} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                PHONE_NUMBER_EXTENSION: fieldBuilder.buildEdmTypeField('PhoneNumberExtension', 'Edm.String', true),
                /**
                 * Static representation of the {@link phoneNumberType} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                PHONE_NUMBER_TYPE: fieldBuilder.buildEdmTypeField('PhoneNumberType', 'Edm.String', true),
                /**
                 * Static representation of the {@link validityStartDate} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                VALIDITY_START_DATE: fieldBuilder.buildEdmTypeField('ValidityStartDate', 'Edm.DateTime', true),
                /**
                 * Static representation of the {@link validityEndDate} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                VALIDITY_END_DATE: fieldBuilder.buildEdmTypeField('ValidityEndDate', 'Edm.DateTime', true),
                ...this.navigationPropertyFields,
                /**
                 *
                 * All fields selector.
                 */
                ALL_FIELDS: new odata_v2_1.AllFields('*', BpAddressIndependentPhone_1.BpAddressIndependentPhone)
            };
        }
        return this._schema;
    }
}
exports.BpAddressIndependentPhoneApi = BpAddressIndependentPhoneApi;
//# sourceMappingURL=BpAddressIndependentPhoneApi.js.map