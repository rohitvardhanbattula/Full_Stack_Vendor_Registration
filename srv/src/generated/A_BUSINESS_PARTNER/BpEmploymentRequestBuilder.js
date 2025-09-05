"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpEmploymentRequestBuilder = void 0;
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
const BpEmployment_1 = require("./BpEmployment");
/**
 * Request builder class for operations supported on the {@link BpEmployment} entity.
 */
class BpEmploymentRequestBuilder extends odata_v2_1.RequestBuilder {
    /**
     * Returns a request builder for querying all `BpEmployment` entities.
     * @returns A request builder for creating requests to retrieve all `BpEmployment` entities.
     */
    getAll() {
        return new odata_v2_1.GetAllRequestBuilder(this.entityApi);
    }
    /**
     * Returns a request builder for creating a `BpEmployment` entity.
     * @param entity The entity to be created
     * @returns A request builder for creating requests that create an entity of type `BpEmployment`.
     */
    create(entity) {
        return new odata_v2_1.CreateRequestBuilder(this.entityApi, entity);
    }
    /**
     * Returns a request builder for retrieving one `BpEmployment` entity based on its keys.
     * @param businessPartner Key property. See {@link BpEmployment.businessPartner}.
     * @param bpEmploymentStartDate Key property. See {@link BpEmployment.bpEmploymentStartDate}.
     * @returns A request builder for creating requests to retrieve one `BpEmployment` entity based on its keys.
     */
    getByKey(businessPartner, bpEmploymentStartDate) {
        return new odata_v2_1.GetByKeyRequestBuilder(this.entityApi, {
            BusinessPartner: businessPartner,
            BPEmploymentStartDate: bpEmploymentStartDate
        });
    }
    /**
     * Returns a request builder for updating an entity of type `BpEmployment`.
     * @param entity The entity to be updated
     * @returns A request builder for creating requests that update an entity of type `BpEmployment`.
     */
    update(entity) {
        return new odata_v2_1.UpdateRequestBuilder(this.entityApi, entity);
    }
    delete(businessPartnerOrEntity, bpEmploymentStartDate) {
        return new odata_v2_1.DeleteRequestBuilder(this.entityApi, businessPartnerOrEntity instanceof BpEmployment_1.BpEmployment
            ? businessPartnerOrEntity
            : {
                BusinessPartner: businessPartnerOrEntity,
                BPEmploymentStartDate: bpEmploymentStartDate
            });
    }
}
exports.BpEmploymentRequestBuilder = BpEmploymentRequestBuilder;
//# sourceMappingURL=BpEmploymentRequestBuilder.js.map