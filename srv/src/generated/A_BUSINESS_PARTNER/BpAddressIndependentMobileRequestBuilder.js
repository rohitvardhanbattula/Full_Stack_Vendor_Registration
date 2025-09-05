"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpAddressIndependentMobileRequestBuilder = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
const BpAddressIndependentMobile_1 = require("./BpAddressIndependentMobile");
/**
 * Request builder class for operations supported on the {@link BpAddressIndependentMobile} entity.
 */
class BpAddressIndependentMobileRequestBuilder extends odata_v2_1.RequestBuilder {
    /**
     * Returns a request builder for querying all `BpAddressIndependentMobile` entities.
     * @returns A request builder for creating requests to retrieve all `BpAddressIndependentMobile` entities.
     */
    getAll() {
        return new odata_v2_1.GetAllRequestBuilder(this.entityApi);
    }
    /**
     * Returns a request builder for creating a `BpAddressIndependentMobile` entity.
     * @param entity The entity to be created
     * @returns A request builder for creating requests that create an entity of type `BpAddressIndependentMobile`.
     */
    create(entity) {
        return new odata_v2_1.CreateRequestBuilder(this.entityApi, entity);
    }
    /**
     * Returns a request builder for retrieving one `BpAddressIndependentMobile` entity based on its keys.
     * @param businessPartner Key property. See {@link BpAddressIndependentMobile.businessPartner}.
     * @param addressId Key property. See {@link BpAddressIndependentMobile.addressId}.
     * @param person Key property. See {@link BpAddressIndependentMobile.person}.
     * @param ordinalNumber Key property. See {@link BpAddressIndependentMobile.ordinalNumber}.
     * @returns A request builder for creating requests to retrieve one `BpAddressIndependentMobile` entity based on its keys.
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
     * Returns a request builder for updating an entity of type `BpAddressIndependentMobile`.
     * @param entity The entity to be updated
     * @returns A request builder for creating requests that update an entity of type `BpAddressIndependentMobile`.
     */
    update(entity) {
        return new odata_v2_1.UpdateRequestBuilder(this.entityApi, entity);
    }
    delete(businessPartnerOrEntity, addressId, person, ordinalNumber) {
        return new odata_v2_1.DeleteRequestBuilder(this.entityApi, businessPartnerOrEntity instanceof BpAddressIndependentMobile_1.BpAddressIndependentMobile
            ? businessPartnerOrEntity
            : {
                BusinessPartner: businessPartnerOrEntity,
                AddressID: addressId,
                Person: person,
                OrdinalNumber: ordinalNumber
            });
    }
}
exports.BpAddressIndependentMobileRequestBuilder = BpAddressIndependentMobileRequestBuilder;
//# sourceMappingURL=BpAddressIndependentMobileRequestBuilder.js.map