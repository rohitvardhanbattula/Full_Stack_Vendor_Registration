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
import { BusinessPartnerAlias } from './BusinessPartnerAlias';
/**
 * Request builder class for operations supported on the {@link BusinessPartnerAlias} entity.
 */
export declare class BusinessPartnerAliasRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<BusinessPartnerAlias<T>, T> {
  /**
   * Returns a request builder for querying all `BusinessPartnerAlias` entities.
   * @returns A request builder for creating requests to retrieve all `BusinessPartnerAlias` entities.
   */
  getAll(): GetAllRequestBuilder<BusinessPartnerAlias<T>, T>;
  /**
   * Returns a request builder for creating a `BusinessPartnerAlias` entity.
   * @param entity The entity to be created
   * @returns A request builder for creating requests that create an entity of type `BusinessPartnerAlias`.
   */
  create(
    entity: BusinessPartnerAlias<T>
  ): CreateRequestBuilder<BusinessPartnerAlias<T>, T>;
  /**
   * Returns a request builder for retrieving one `BusinessPartnerAlias` entity based on its keys.
   * @param businessPartner Key property. See {@link BusinessPartnerAlias.businessPartner}.
   * @param bpAliasPositionNumber Key property. See {@link BusinessPartnerAlias.bpAliasPositionNumber}.
   * @returns A request builder for creating requests to retrieve one `BusinessPartnerAlias` entity based on its keys.
   */
  getByKey(
    businessPartner: DeserializedType<T, 'Edm.String'>,
    bpAliasPositionNumber: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<BusinessPartnerAlias<T>, T>;
  /**
   * Returns a request builder for updating an entity of type `BusinessPartnerAlias`.
   * @param entity The entity to be updated
   * @returns A request builder for creating requests that update an entity of type `BusinessPartnerAlias`.
   */
  update(
    entity: BusinessPartnerAlias<T>
  ): UpdateRequestBuilder<BusinessPartnerAlias<T>, T>;
  /**
   * Returns a request builder for deleting an entity of type `BusinessPartnerAlias`.
   * @param businessPartner Key property. See {@link BusinessPartnerAlias.businessPartner}.
   * @param bpAliasPositionNumber Key property. See {@link BusinessPartnerAlias.bpAliasPositionNumber}.
   * @returns A request builder for creating requests that delete an entity of type `BusinessPartnerAlias`.
   */
  delete(
    businessPartner: string,
    bpAliasPositionNumber: string
  ): DeleteRequestBuilder<BusinessPartnerAlias<T>, T>;
  /**
   * Returns a request builder for deleting an entity of type `BusinessPartnerAlias`.
   * @param entity Pass the entity to be deleted.
   * @returns A request builder for creating requests that delete an entity of type `BusinessPartnerAlias` by taking the entity as a parameter.
   */
  delete(
    entity: BusinessPartnerAlias<T>
  ): DeleteRequestBuilder<BusinessPartnerAlias<T>, T>;
}
