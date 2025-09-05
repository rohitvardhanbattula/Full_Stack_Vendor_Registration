"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpEmploymentApi = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const BpEmployment_1 = require("./BpEmployment");
const BpEmploymentRequestBuilder_1 = require("./BpEmploymentRequestBuilder");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
class BpEmploymentApi {
    constructor(deSerializers = odata_v2_1.defaultDeSerializers) {
        this.entityConstructor = BpEmployment_1.BpEmployment;
        this.deSerializers = deSerializers;
    }
    /**
     * Do not use this method or the constructor directly.
     * Use the service function as described in the documentation to get an API instance.
     */
    static _privateFactory(deSerializers = odata_v2_1.defaultDeSerializers) {
        return new BpEmploymentApi(deSerializers);
    }
    _addNavigationProperties(linkedApis) {
        this.navigationPropertyFields = {};
        return this;
    }
    requestBuilder() {
        return new BpEmploymentRequestBuilder_1.BpEmploymentRequestBuilder(this);
    }
    entityBuilder() {
        return (0, odata_v2_1.entityBuilder)(this);
    }
    customField(fieldName, isNullable = false) {
        return new odata_v2_1.CustomField(fieldName, this.entityConstructor, this.deSerializers, isNullable);
    }
    get fieldBuilder() {
        if (!this._fieldBuilder) {
            this._fieldBuilder = new odata_v2_1.FieldBuilder(BpEmployment_1.BpEmployment, this.deSerializers);
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
                 * Static representation of the {@link bpEmploymentStartDate} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BP_EMPLOYMENT_START_DATE: fieldBuilder.buildEdmTypeField('BPEmploymentStartDate', 'Edm.DateTime', false),
                /**
                 * Static representation of the {@link bpEmploymentEndDate} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BP_EMPLOYMENT_END_DATE: fieldBuilder.buildEdmTypeField('BPEmploymentEndDate', 'Edm.DateTime', true),
                /**
                 * Static representation of the {@link bpEmploymentStatus} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BP_EMPLOYMENT_STATUS: fieldBuilder.buildEdmTypeField('BPEmploymentStatus', 'Edm.String', true),
                /**
                 * Static representation of the {@link busPartEmplrIndstryCode} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BUS_PART_EMPLR_INDSTRY_CODE: fieldBuilder.buildEdmTypeField('BusPartEmplrIndstryCode', 'Edm.String', true),
                /**
                 * Static representation of the {@link businessPartnerEmployerName} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BUSINESS_PARTNER_EMPLOYER_NAME: fieldBuilder.buildEdmTypeField('BusinessPartnerEmployerName', 'Edm.String', true),
                /**
                 * Static representation of the {@link businessPartnerOccupationGroup} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BUSINESS_PARTNER_OCCUPATION_GROUP: fieldBuilder.buildEdmTypeField('BusinessPartnerOccupationGroup', 'Edm.String', true),
                ...this.navigationPropertyFields,
                /**
                 *
                 * All fields selector.
                 */
                ALL_FIELDS: new odata_v2_1.AllFields('*', BpEmployment_1.BpEmployment)
            };
        }
        return this._schema;
    }
}
exports.BpEmploymentApi = BpEmploymentApi;
//# sourceMappingURL=BpEmploymentApi.js.map