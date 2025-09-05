"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessPartnerAliasRequestBuilder = void 0;
/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
const BusinessPartnerAlias_1 = require("./BusinessPartnerAlias");
/**
 * Request builder class for operations supported on the {@link BusinessPartnerAlias} entity.
 */
class BusinessPartnerAliasRequestBuilder extends odata_v2_1.RequestBuilder {
    /**
     * Returns a request builder for querying all `BusinessPartnerAlias` entities.
     * @returns A request builder for creating requests to retrieve all `BusinessPartnerAlias` entities.
     */
    getAll() {
        return new odata_v2_1.GetAllRequestBuilder(this.entityApi);
    }
    /**
     * Returns a request builder for creating a `BusinessPartnerAlias` entity.
     * @param entity The entity to be created
     * @returns A request builder for creating requests that create an entity of type `BusinessPartnerAlias`.
     */
    create(entity) {
        return new odata_v2_1.CreateRequestBuilder(this.entityApi, entity);
    }
    /**
     * Returns a request builder for retrieving one `BusinessPartnerAlias` entity based on its keys.
     * @param businessPartner Key property. See {@link BusinessPartnerAlias.businessPartner}.
     * @param bpAliasPositionNumber Key property. See {@link BusinessPartnerAlias.bpAliasPositionNumber}.
     * @returns A request builder for creating requests to retrieve one `BusinessPartnerAlias` entity based on its keys.
     */
    getByKey(businessPartner, bpAliasPositionNumber) {
        return new odata_v2_1.GetByKeyRequestBuilder(this.entityApi, {
            BusinessPartner: businessPartner,
            BPAliasPositionNumber: bpAliasPositionNumber
        });
    }
    /**
     * Returns a request builder for updating an entity of type `BusinessPartnerAlias`.
     * @param entity The entity to be updated
     * @returns A request builder for creating requests that update an entity of type `BusinessPartnerAlias`.
     */
    update(entity) {
        return new odata_v2_1.UpdateRequestBuilder(this.entityApi, entity);
    }
    delete(businessPartnerOrEntity, bpAliasPositionNumber) {
        return new odata_v2_1.DeleteRequestBuilder(this.entityApi, businessPartnerOrEntity instanceof BusinessPartnerAlias_1.BusinessPartnerAlias
            ? businessPartnerOrEntity
            : {
                BusinessPartner: businessPartnerOrEntity,
                BPAliasPositionNumber: bpAliasPositionNumber
            });
    }
}
exports.BusinessPartnerAliasRequestBuilder = BusinessPartnerAliasRequestBuilder;
//# sourceMappingURL=BusinessPartnerAliasRequestBuilder.js.map