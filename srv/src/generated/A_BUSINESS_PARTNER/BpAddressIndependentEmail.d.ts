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
import type { BpAddressIndependentEmailApi } from './BpAddressIndependentEmailApi';
/**
 * This class represents the entity "A_BPAddressIndependentEmail" of service "API_BUSINESS_PARTNER".
 */
export declare class BpAddressIndependentEmail<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements BpAddressIndependentEmailType<T>
{
  /**
   * Technical entity name for BpAddressIndependentEmail.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the BpAddressIndependentEmail entity.
   */
  static _keys: string[];
  /**
   * Business Partner Number.
   * Maximum length: 10.
   */
  businessPartner: DeserializedType<T, 'Edm.String'>;
  /**
   * Address Number.
   * Maximum length: 10.
   */
  addressId: DeserializedType<T, 'Edm.String'>;
  /**
   * Person Number.
   * Maximum length: 10.
   */
  person: DeserializedType<T, 'Edm.String'>;
  /**
   * Sequence Number.
   * Maximum length: 3.
   */
  ordinalNumber: DeserializedType<T, 'Edm.String'>;
  /**
   * Email Address.
   * Maximum length: 241.
   * @nullable
   */
  emailAddress?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Indicator : Current Default Email Address.
   * @nullable
   */
  isDefaultEmailAddress?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * Validity Start Date.
   * @nullable
   */
  validityStartDate?: DeserializedType<T, 'Edm.DateTime'> | null;
  /**
   * Validity End Date.
   * @nullable
   */
  validityEndDate?: DeserializedType<T, 'Edm.DateTime'> | null;
  constructor(_entityApi: BpAddressIndependentEmailApi<T>);
}
export interface BpAddressIndependentEmailType<
  T extends DeSerializers = DefaultDeSerializers
> {
  businessPartner: DeserializedType<T, 'Edm.String'>;
  addressId: DeserializedType<T, 'Edm.String'>;
  person: DeserializedType<T, 'Edm.String'>;
  ordinalNumber: DeserializedType<T, 'Edm.String'>;
  emailAddress?: DeserializedType<T, 'Edm.String'> | null;
  isDefaultEmailAddress?: DeserializedType<T, 'Edm.Boolean'> | null;
  validityStartDate?: DeserializedType<T, 'Edm.DateTime'> | null;
  validityEndDate?: DeserializedType<T, 'Edm.DateTime'> | null;
}
