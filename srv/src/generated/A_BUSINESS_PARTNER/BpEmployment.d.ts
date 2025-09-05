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
import type { BpEmploymentApi } from './BpEmploymentApi';
/**
 * This class represents the entity "A_BPEmployment" of service "API_BUSINESS_PARTNER".
 */
export declare class BpEmployment<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements BpEmploymentType<T>
{
  /**
   * Technical entity name for BpEmployment.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the BpEmployment entity.
   */
  static _keys: string[];
  /**
   * Business Partner Number.
   * Maximum length: 10.
   */
  businessPartner: DeserializedType<T, 'Edm.String'>;
  /**
   * Employed from.
   */
  bpEmploymentStartDate: DeserializedType<T, 'Edm.DateTime'>;
  /**
   * Employed Until.
   * @nullable
   */
  bpEmploymentEndDate?: DeserializedType<T, 'Edm.DateTime'> | null;
  /**
   * Employment Status.
   * Maximum length: 2.
   * @nullable
   */
  bpEmploymentStatus?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Industry.
   * Maximum length: 10.
   * @nullable
   */
  busPartEmplrIndstryCode?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Name of Employer of a Natural Person.
   * Maximum length: 35.
   * @nullable
   */
  businessPartnerEmployerName?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Occupation/group.
   * Maximum length: 4.
   * @nullable
   */
  businessPartnerOccupationGroup?: DeserializedType<T, 'Edm.String'> | null;
  constructor(_entityApi: BpEmploymentApi<T>);
}
export interface BpEmploymentType<
  T extends DeSerializers = DefaultDeSerializers
> {
  businessPartner: DeserializedType<T, 'Edm.String'>;
  bpEmploymentStartDate: DeserializedType<T, 'Edm.DateTime'>;
  bpEmploymentEndDate?: DeserializedType<T, 'Edm.DateTime'> | null;
  bpEmploymentStatus?: DeserializedType<T, 'Edm.String'> | null;
  busPartEmplrIndstryCode?: DeserializedType<T, 'Edm.String'> | null;
  businessPartnerEmployerName?: DeserializedType<T, 'Edm.String'> | null;
  businessPartnerOccupationGroup?: DeserializedType<T, 'Edm.String'> | null;
}
