/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { BpAddressIndependentFax } from './BpAddressIndependentFax';
import { BpAddressIndependentFaxRequestBuilder } from './BpAddressIndependentFaxRequestBuilder';
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
export declare class BpAddressIndependentFaxApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<BpAddressIndependentFax<DeSerializersT>, DeSerializersT>
{
  deSerializers: DeSerializersT;
  private constructor();
  /**
   * Do not use this method or the constructor directly.
   * Use the service function as described in the documentation to get an API instance.
   */
  static _privateFactory<
    DeSerializersT extends DeSerializers = DefaultDeSerializers
  >(deSerializers?: DeSerializersT): BpAddressIndependentFaxApi<DeSerializersT>;
  private navigationPropertyFields;
  _addNavigationProperties(linkedApis: []): this;
  entityConstructor: typeof BpAddressIndependentFax;
  requestBuilder(): BpAddressIndependentFaxRequestBuilder<DeSerializersT>;
  entityBuilder(): EntityBuilderType<
    BpAddressIndependentFax<DeSerializersT>,
    DeSerializersT
  >;
  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable?: NullableT
  ): CustomField<
    BpAddressIndependentFax<DeSerializersT>,
    DeSerializersT,
    NullableT
  >;
  private _fieldBuilder?;
  get fieldBuilder(): FieldBuilder<
    typeof BpAddressIndependentFax,
    DeSerializersT
  >;
  private _schema?;
  get schema(): {
    BUSINESS_PARTNER: OrderableEdmTypeField<
      BpAddressIndependentFax<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ADDRESS_ID: OrderableEdmTypeField<
      BpAddressIndependentFax<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    PERSON: OrderableEdmTypeField<
      BpAddressIndependentFax<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ORDINAL_NUMBER: OrderableEdmTypeField<
      BpAddressIndependentFax<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    FAX_COUNTRY: OrderableEdmTypeField<
      BpAddressIndependentFax<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    FAX_AREA_CODE_SUBSCRIBER_NUMBER: OrderableEdmTypeField<
      BpAddressIndependentFax<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    FAX_NUMBER_EXTENSION: OrderableEdmTypeField<
      BpAddressIndependentFax<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    INTERNATIONAL_FAX_NUMBER: OrderableEdmTypeField<
      BpAddressIndependentFax<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    IS_DEFAULT_FAX_NUMBER: OrderableEdmTypeField<
      BpAddressIndependentFax<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    VALIDITY_END_DATE: OrderableEdmTypeField<
      BpAddressIndependentFax<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      true,
      true
    >;
    VALIDITY_START_DATE: OrderableEdmTypeField<
      BpAddressIndependentFax<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      true,
      true
    >;
    ALL_FIELDS: AllFields<BpAddressIndependentFax<DeSerializers>>;
  };
}
