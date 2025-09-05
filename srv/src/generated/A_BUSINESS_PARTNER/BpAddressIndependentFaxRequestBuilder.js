"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpAddressIndependentFaxRequestBuilder = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
const BpAddressIndependentFax_1 = require("./BpAddressIndependentFax");
/**
 * Request builder class for operations supported on the {@link BpAddressIndependentFax} entity.
 */
class BpAddressIndependentFaxRequestBuilder extends odata_v2_1.RequestBuilder {
    /**
     * Returns a request builder for querying all `BpAddressIndependentFax` entities.
     * @returns A request builder for creating requests to retrieve all `BpAddressIndependentFax` entities.
     */
    getAll() {
        return new odata_v2_1.GetAllRequestBuilder(this.entityApi);
    }
    /**
     * Returns a request builder for creating a `BpAddressIndependentFax` entity.
     * @param entity The entity to be created
     * @returns A request builder for creating requests that create an entity of type `BpAddressIndependentFax`.
     */
    create(entity) {
        return new odata_v2_1.CreateRequestBuilder(this.entityApi, entity);
    }
    /**
     * Returns a request builder for retrieving one `BpAddressIndependentFax` entity based on its keys.
     * @param businessPartner Key property. See {@link BpAddressIndependentFax.businessPartner}.
     * @param addressId Key property. See {@link BpAddressIndependentFax.addressId}.
     * @param person Key property. See {@link BpAddressIndependentFax.person}.
     * @param ordinalNumber Key property. See {@link BpAddressIndependentFax.ordinalNumber}.
     * @returns A request builder for creating requests to retrieve one `BpAddressIndependentFax` entity based on its keys.
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
     * Returns a request builder for updating an entity of type `BpAddressIndependentFax`.
     * @param entity The entity to be updated
     * @returns A request builder for creating requests that update an entity of type `BpAddressIndependentFax`.
     */
    update(entity) {
        return new odata_v2_1.UpdateRequestBuilder(this.entityApi, entity);
    }
    delete(businessPartnerOrEntity, addressId, person, ordinalNumber) {
        return new odata_v2_1.DeleteRequestBuilder(this.entityApi, businessPartnerOrEntity instanceof BpAddressIndependentFax_1.BpAddressIndependentFax
            ? businessPartnerOrEntity
            : {
                BusinessPartner: businessPartnerOrEntity,
                AddressID: addressId,
                Person: person,
                OrdinalNumber: ordinalNumber
            });
    }
}
exports.BpAddressIndependentFaxRequestBuilder = BpAddressIndependentFaxRequestBuilder;
//# sourceMappingURL=BpAddressIndependentFaxRequestBuilder.js.map