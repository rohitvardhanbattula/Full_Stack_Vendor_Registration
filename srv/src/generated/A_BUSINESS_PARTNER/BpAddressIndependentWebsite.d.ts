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
import type { BpAddressIndependentWebsiteApi } from './BpAddressIndependentWebsiteApi';
/**
 * This class represents the entity "A_BPAddressIndependentWebsite" of service "API_BUSINESS_PARTNER".
 */
export declare class BpAddressIndependentWebsite<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements BpAddressIndependentWebsiteType<T>
{
  /**
   * Technical entity name for BpAddressIndependentWebsite.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the BpAddressIndependentWebsite entity.
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
   * Flag: this address is the default address.
   * @nullable
   */
  isDefaultUrlAddress?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * Url Field Length.
   * @nullable
   */
  urlFieldLength?: DeserializedType<T, 'Edm.Int32'> | null;
  /**
   * Website Url.
   * Maximum length: 2048.
   * @nullable
   */
  websiteUrl?: DeserializedType<T, 'Edm.String'> | null;
  constructor(_entityApi: BpAddressIndependentWebsiteApi<T>);
}
export interface BpAddressIndependentWebsiteType<
  T extends DeSerializers = DefaultDeSerializers
> {
  businessPartner: DeserializedType<T, 'Edm.String'>;
  addressId: DeserializedType<T, 'Edm.String'>;
  person: DeserializedType<T, 'Edm.String'>;
  ordinalNumber: DeserializedType<T, 'Edm.String'>;
  isDefaultUrlAddress?: DeserializedType<T, 'Edm.Boolean'> | null;
  urlFieldLength?: DeserializedType<T, 'Edm.Int32'> | null;
  websiteUrl?: DeserializedType<T, 'Edm.String'> | null;
}
