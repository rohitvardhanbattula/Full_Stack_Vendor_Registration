/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import {
  Entity,
  DefaultDeSerializers,
  DeSerializers,
  DeserializedType
} from '@sap-cloud-sdk/odata-v2';
import type { BusinessPartnerIsBankApi } from './BusinessPartnerIsBankApi';
/**
 * This class represents the entity "A_BusinessPartnerIsBank" of service "API_BUSINESS_PARTNER".
 */
export declare class BusinessPartnerIsBank<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements BusinessPartnerIsBankType<T>
{
  /**
   * Technical entity name for BusinessPartnerIsBank.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the BusinessPartnerIsBank entity.
   */
  static _keys: string[];
  /**
   * Business Partner Number.
   * Maximum length: 10.
   */
  businessPartner: DeserializedType<T, 'Edm.String'>;
  /**
   * Bank Keys.
   * Maximum length: 15.
   * @nullable
   */
  bankKey?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Bank Country/Region Key.
   * Maximum length: 3.
   * @nullable
   */
  bankCountry?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Minimum Reserve Requirement for Bank.
   * Maximum length: 1.
   * @nullable
   */
  bpMinimumReserve?: DeserializedType<T, 'Edm.String'> | null;
  constructor(_entityApi: BusinessPartnerIsBankApi<T>);
}
export interface BusinessPartnerIsBankType<
  T extends DeSerializers = DefaultDeSerializers
> {
  businessPartner: DeserializedType<T, 'Edm.String'>;
  bankKey?: DeserializedType<T, 'Edm.String'> | null;
  bankCountry?: DeserializedType<T, 'Edm.String'> | null;
  bpMinimumReserve?: DeserializedType<T, 'Edm.String'> | null;
}
