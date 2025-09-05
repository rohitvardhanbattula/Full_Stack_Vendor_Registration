/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import {
  CreateRequestBuilder,
  DeSerializers,
  DefaultDeSerializers,
  DeleteRequestBuilder,
  DeserializedType,
  GetAllRequestBuilder,
  GetByKeyRequestBuilder,
  RequestBuilder,
  UpdateRequestBuilder
} from '@sap-cloud-sdk/odata-v2';
import { BpAddressIndependentFax } from './BpAddressIndependentFax';
/**
 * Request builder class for operations supported on the {@link BpAddressIndependentFax} entity.
 */
export declare class BpAddressIndependentFaxRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<BpAddressIndependentFax<T>, T> {
  /**
   * Returns a request builder for querying all `BpAddressIndependentFax` entities.
   * @returns A request builder for creating requests to retrieve all `BpAddressIndependentFax` entities.
   */
  getAll(): GetAllRequestBuilder<BpAddressIndependentFax<T>, T>;
  /**
   * Returns a request builder for creating a `BpAddressIndependentFax` entity.
   * @param entity The entity to be created
   * @returns A request builder for creating requests that create an entity of type `BpAddressIndependentFax`.
   */
  create(
    entity: BpAddressIndependentFax<T>
  ): CreateRequestBuilder<BpAddressIndependentFax<T>, T>;
  /**
   * Returns a request builder for retrieving one `BpAddressIndependentFax` entity based on its keys.
   * @param businessPartner Key property. See {@link BpAddressIndependentFax.businessPartner}.
   * @param addressId Key property. See {@link BpAddressIndependentFax.addressId}.
   * @param person Key property. See {@link BpAddressIndependentFax.person}.
   * @param ordinalNumber Key property. See {@link BpAddressIndependentFax.ordinalNumber}.
   * @returns A request builder for creating requests to retrieve one `BpAddressIndependentFax` entity based on its keys.
   */
  getByKey(
    businessPartner: DeserializedType<T, 'Edm.String'>,
    addressId: DeserializedType<T, 'Edm.String'>,
    person: DeserializedType<T, 'Edm.String'>,
    ordinalNumber: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<BpAddressIndependentFax<T>, T>;
  /**
   * Returns a request builder for updating an entity of type `BpAddressIndependentFax`.
   * @param entity The entity to be updated
   * @returns A request builder for creating requests that update an entity of type `BpAddressIndependentFax`.
   */
  update(
    entity: BpAddressIndependentFax<T>
  ): UpdateRequestBuilder<BpAddressIndependentFax<T>, T>;
  /**
   * Returns a request builder for deleting an entity of type `BpAddressIndependentFax`.
   * @param businessPartner Key property. See {@link BpAddressIndependentFax.businessPartner}.
   * @param addressId Key property. See {@link BpAddressIndependentFax.addressId}.
   * @param person Key property. See {@link BpAddressIndependentFax.person}.
   * @param ordinalNumber Key property. See {@link BpAddressIndependentFax.ordinalNumber}.
   * @returns A request builder for creating requests that delete an entity of type `BpAddressIndependentFax`.
   */
  delete(
    businessPartner: string,
    addressId: string,
    person: string,
    ordinalNumber: string
  ): DeleteRequestBuilder<BpAddressIndependentFax<T>, T>;
  /**
   * Returns a request builder for deleting an entity of type `BpAddressIndependentFax`.
   * @param entity Pass the entity to be deleted.
   * @returns A request builder for creating requests that delete an entity of type `BpAddressIndependentFax` by taking the entity as a parameter.
   */
  delete(
    entity: BpAddressIndependentFax<T>
  ): DeleteRequestBuilder<BpAddressIndependentFax<T>, T>;
}
