"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpAddressIndependentEmailRequestBuilder = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
const BpAddressIndependentEmail_1 = require("./BpAddressIndependentEmail");
/**
 * Request builder class for operations supported on the {@link BpAddressIndependentEmail} entity.
 */
class BpAddressIndependentEmailRequestBuilder extends odata_v2_1.RequestBuilder {
    /**
     * Returns a request builder for querying all `BpAddressIndependentEmail` entities.
     * @returns A request builder for creating requests to retrieve all `BpAddressIndependentEmail` entities.
     */
    getAll() {
        return new odata_v2_1.GetAllRequestBuilder(this.entityApi);
    }
    /**
     * Returns a request builder for creating a `BpAddressIndependentEmail` entity.
     * @param entity The entity to be created
     * @returns A request builder for creating requests that create an entity of type `BpAddressIndependentEmail`.
     */
    create(entity) {
        return new odata_v2_1.CreateRequestBuilder(this.entityApi, entity);
    }
    /**
     * Returns a request builder for retrieving one `BpAddressIndependentEmail` entity based on its keys.
     * @param businessPartner Key property. See {@link BpAddressIndependentEmail.businessPartner}.
     * @param addressId Key property. See {@link BpAddressIndependentEmail.addressId}.
     * @param person Key property. See {@link BpAddressIndependentEmail.person}.
     * @param ordinalNumber Key property. See {@link BpAddressIndependentEmail.ordinalNumber}.
     * @returns A request builder for creating requests to retrieve one `BpAddressIndependentEmail` entity based on its keys.
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
     * Returns a request builder for updating an entity of type `BpAddressIndependentEmail`.
     * @param entity The entity to be updated
     * @returns A request builder for creating requests that update an entity of type `BpAddressIndependentEmail`.
     */
    update(entity) {
        return new odata_v2_1.UpdateRequestBuilder(this.entityApi, entity);
    }
    delete(businessPartnerOrEntity, addressId, person, ordinalNumber) {
        return new odata_v2_1.DeleteRequestBuilder(this.entityApi, businessPartnerOrEntity instanceof BpAddressIndependentEmail_1.BpAddressIndependentEmail
            ? businessPartnerOrEntity
            : {
                BusinessPartner: businessPartnerOrEntity,
                AddressID: addressId,
                Person: person,
                OrdinalNumber: ordinalNumber
            });
    }
}
exports.BpAddressIndependentEmailRequestBuilder = BpAddressIndependentEmailRequestBuilder;
//# sourceMappingURL=BpAddressIndependentEmailRequestBuilder.js.map