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
import type { BpAddressIndependentFaxApi } from './BpAddressIndependentFaxApi';
/**
 * This class represents the entity "A_BPAddressIndependentFax" of service "API_BUSINESS_PARTNER".
 */
export declare class BpAddressIndependentFax<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements BpAddressIndependentFaxType<T>
{
  /**
   * Technical entity name for BpAddressIndependentFax.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the BpAddressIndependentFax entity.
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
   * Country/Region for Telephone/Fax Number.
   * Maximum length: 3.
   * @nullable
   */
  faxCountry?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Fax Number: Dialing Code and Number.
   * Maximum length: 30.
   * @nullable
   */
  faxAreaCodeSubscriberNumber?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Fax no.: Extension.
   * Maximum length: 10.
   * @nullable
   */
  faxNumberExtension?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Complete Number: Dialing Code+Number+Extension.
   * Maximum length: 30.
   * @nullable
   */
  internationalFaxNumber?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Indicator : Current Default Fax Number.
   * @nullable
   */
  isDefaultFaxNumber?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * Validity End Date.
   * @nullable
   */
  validityEndDate?: DeserializedType<T, 'Edm.DateTime'> | null;
  /**
   * Validity Start Date.
   * @nullable
   */
  validityStartDate?: DeserializedType<T, 'Edm.DateTime'> | null;
  constructor(_entityApi: BpAddressIndependentFaxApi<T>);
}
export interface BpAddressIndependentFaxType<
  T extends DeSerializers = DefaultDeSerializers
> {
  businessPartner: DeserializedType<T, 'Edm.String'>;
  addressId: DeserializedType<T, 'Edm.String'>;
  person: DeserializedType<T, 'Edm.String'>;
  ordinalNumber: DeserializedType<T, 'Edm.String'>;
  faxCountry?: DeserializedType<T, 'Edm.String'> | null;
  faxAreaCodeSubscriberNumber?: DeserializedType<T, 'Edm.String'> | null;
  faxNumberExtension?: DeserializedType<T, 'Edm.String'> | null;
  internationalFaxNumber?: DeserializedType<T, 'Edm.String'> | null;
  isDefaultFaxNumber?: DeserializedType<T, 'Edm.Boolean'> | null;
  validityEndDate?: DeserializedType<T, 'Edm.DateTime'> | null;
  validityStartDate?: DeserializedType<T, 'Edm.DateTime'> | null;
}
