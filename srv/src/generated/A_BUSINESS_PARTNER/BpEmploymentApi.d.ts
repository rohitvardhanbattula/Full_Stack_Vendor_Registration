/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { BpEmployment } from './BpEmployment';
import { BpEmploymentRequestBuilder } from './BpEmploymentRequestBuilder';
import {
  CustomField,
  DefaultDeSerializers,
  DeSerializers,
  AllFields,
  EntityBuilderType,
  EntityApi,
  FieldBuilder,
  OrderableEdmTypeField
} from '@sap-cloud-sdk/odata-v2';
export declare class BpEmploymentApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<BpEmployment<DeSerializersT>, DeSerializersT>
{
  deSerializers: DeSerializersT;
  private constructor();
  /**
   * Do not use this method or the constructor directly.
   * Use the service function as described in the documentation to get an API instance.
   */
  static _privateFactory<
    DeSerializersT extends DeSerializers = DefaultDeSerializers
  >(deSerializers?: DeSerializersT): BpEmploymentApi<DeSerializersT>;
  private navigationPropertyFields;
  _addNavigationProperties(linkedApis: []): this;
  entityConstructor: typeof BpEmployment;
  requestBuilder(): BpEmploymentRequestBuilder<DeSerializersT>;
  entityBuilder(): EntityBuilderType<
    BpEmployment<DeSerializersT>,
    DeSerializersT
  >;
  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable?: NullableT
  ): CustomField<BpEmployment<DeSerializersT>, DeSerializersT, NullableT>;
  private _fieldBuilder?;
  get fieldBuilder(): FieldBuilder<typeof BpEmployment, DeSerializersT>;
  private _schema?;
  get schema(): {
    BUSINESS_PARTNER: OrderableEdmTypeField<
      BpEmployment<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    BP_EMPLOYMENT_START_DATE: OrderableEdmTypeField<
      BpEmployment<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      false,
      true
    >;
    BP_EMPLOYMENT_END_DATE: OrderableEdmTypeField<
      BpEmployment<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      true,
      true
    >;
    BP_EMPLOYMENT_STATUS: OrderableEdmTypeField<
      BpEmployment<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    BUS_PART_EMPLR_INDSTRY_CODE: OrderableEdmTypeField<
      BpEmployment<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    BUSINESS_PARTNER_EMPLOYER_NAME: OrderableEdmTypeField<
      BpEmployment<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    BUSINESS_PARTNER_OCCUPATION_GROUP: OrderableEdmTypeField<
      BpEmployment<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    ALL_FIELDS: AllFields<BpEmployment<DeSerializers>>;
  };
}
