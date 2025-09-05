"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpAddressIndependentPhoneRequestBuilder = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
const BpAddressIndependentPhone_1 = require("./BpAddressIndependentPhone");
/**
 * Request builder class for operations supported on the {@link BpAddressIndependentPhone} entity.
 */
class BpAddressIndependentPhoneRequestBuilder extends odata_v2_1.RequestBuilder {
    /**
     * Returns a request builder for querying all `BpAddressIndependentPhone` entities.
     * @returns A request builder for creating requests to retrieve all `BpAddressIndependentPhone` entities.
     */
    getAll() {
        return new odata_v2_1.GetAllRequestBuilder(this.entityApi);
    }
    /**
     * Returns a request builder for creating a `BpAddressIndependentPhone` entity.
     * @param entity The entity to be created
     * @returns A request builder for creating requests that create an entity of type `BpAddressIndependentPhone`.
     */
    create(entity) {
        return new odata_v2_1.CreateRequestBuilder(this.entityApi, entity);
    }
    /**
     * Returns a request builder for retrieving one `BpAddressIndependentPhone` entity based on its keys.
     * @param businessPartner Key property. See {@link BpAddressIndependentPhone.businessPartner}.
     * @param addressId Key property. See {@link BpAddressIndependentPhone.addressId}.
     * @param person Key property. See {@link BpAddressIndependentPhone.person}.
     * @param ordinalNumber Key property. See {@link BpAddressIndependentPhone.ordinalNumber}.
     * @returns A request builder for creating requests to retrieve one `BpAddressIndependentPhone` entity based on its keys.
     */
    getByKey(businessPartner, addressId, person, ordinalNumber) {
        return new odata_v2_1.GetByKeyRequestBuilder(this.entityApi, {
            BusinessPartner: businessPartner,
            AddressID: addressId,
            Person: person,
            OrdinalNumber: ordinalNumber
        });
    }
    /**
     * Returns a request builder for updating an entity of type `BpAddressIndependentPhone`.
     * @param entity The entity to be updated
     * @returns A request builder for creating requests that update an entity of type `BpAddressIndependentPhone`.
     */
    update(entity) {
        return new odata_v2_1.UpdateRequestBuilder(this.entityApi, entity);
    }
    delete(businessPartnerOrEntity, addressId, person, ordinalNumber) {
        return new odata_v2_1.DeleteRequestBuilder(this.entityApi, businessPartnerOrEntity instanceof BpAddressIndependentPhone_1.BpAddressIndependentPhone
            ? businessPartnerOrEntity
            : {
                BusinessPartner: businessPartnerOrEntity,
                AddressID: addressId,
                Person: person,
                OrdinalNumber: ordinalNumber
            });
    }
}
exports.BpAddressIndependentPhoneRequestBuilder = BpAddressIndependentPhoneRequestBuilder;
//# sourceMappingURL=BpAddressIndependentPhoneRequestBuilder.js.map