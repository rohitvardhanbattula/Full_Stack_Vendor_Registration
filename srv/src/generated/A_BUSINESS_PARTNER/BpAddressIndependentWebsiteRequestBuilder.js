"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpAddressIndependentWebsiteRequestBuilder = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
const BpAddressIndependentWebsite_1 = require("./BpAddressIndependentWebsite");
/**
 * Request builder class for operations supported on the {@link BpAddressIndependentWebsite} entity.
 */
class BpAddressIndependentWebsiteRequestBuilder extends odata_v2_1.RequestBuilder {
    /**
     * Returns a request builder for querying all `BpAddressIndependentWebsite` entities.
     * @returns A request builder for creating requests to retrieve all `BpAddressIndependentWebsite` entities.
     */
    getAll() {
        return new odata_v2_1.GetAllRequestBuilder(this.entityApi);
    }
    /**
     * Returns a request builder for creating a `BpAddressIndependentWebsite` entity.
     * @param entity The entity to be created
     * @returns A request builder for creating requests that create an entity of type `BpAddressIndependentWebsite`.
     */
    create(entity) {
        return new odata_v2_1.CreateRequestBuilder(this.entityApi, entity);
    }
    /**
     * Returns a request builder for retrieving one `BpAddressIndependentWebsite` entity based on its keys.
     * @param businessPartner Key property. See {@link BpAddressIndependentWebsite.businessPartner}.
     * @param addressId Key property. See {@link BpAddressIndependentWebsite.addressId}.
     * @param person Key property. See {@link BpAddressIndependentWebsite.person}.
     * @param ordinalNumber Key property. See {@link BpAddressIndependentWebsite.ordinalNumber}.
     * @returns A request builder for creating requests to retrieve one `BpAddressIndependentWebsite` entity based on its keys.
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
     * Returns a request builder for updating an entity of type `BpAddressIndependentWebsite`.
     * @param entity The entity to be updated
     * @returns A request builder for creating requests that update an entity of type `BpAddressIndependentWebsite`.
     */
    update(entity) {
        return new odata_v2_1.UpdateRequestBuilder(this.entityApi, entity);
    }
    delete(businessPartnerOrEntity, addressId, person, ordinalNumber) {
        return new odata_v2_1.DeleteRequestBuilder(this.entityApi, businessPartnerOrEntity instanceof BpAddressIndependentWebsite_1.BpAddressIndependentWebsite
            ? businessPartnerOrEntity
            : {
                BusinessPartner: businessPartnerOrEntity,
                AddressID: addressId,
                Person: person,
                OrdinalNumber: ordinalNumber
            });
    }
}
exports.BpAddressIndependentWebsiteRequestBuilder = BpAddressIndependentWebsiteRequestBuilder;
//# sourceMappingURL=BpAddressIndependentWebsiteRequestBuilder.js.map