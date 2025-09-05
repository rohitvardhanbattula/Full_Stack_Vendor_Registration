/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { BpAddressIndependentMobile } from './BpAddressIndependentMobile';
import { BpAddressIndependentMobileRequestBuilder } from './BpAddressIndependentMobileRequestBuilder';
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
export declare class BpAddressIndependentMobileApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements
    EntityApi<BpAddressIndependentMobile<DeSerializersT>, DeSerializersT>
{
  deSerializers: DeSerializersT;
  private constructor();
  /**
   * Do not use this method or the constructor directly.
   * Use the service function as described in the documentation to get an API instance.
   */
  static _privateFactory<
    DeSerializersT extends DeSerializers = DefaultDeSerializers
  >(
    deSerializers?: DeSerializersT
  ): BpAddressIndependentMobileApi<DeSerializersT>;
  private navigationPropertyFields;
  _addNavigationProperties(linkedApis: []): this;
  entityConstructor: typeof BpAddressIndependentMobile;
  requestBuilder(): BpAddressIndependentMobileRequestBuilder<DeSerializersT>;
  entityBuilder(): EntityBuilderType<
    BpAddressIndependentMobile<DeSerializersT>,
    DeSerializersT
  >;
  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable?: NullableT
  ): CustomField<
    BpAddressIndependentMobile<DeSerializersT>,
    DeSerializersT,
    NullableT
  >;
  private _fieldBuilder?;
  get fieldBuilder(): FieldBuilder<
    typeof BpAddressIndependentMobile,
    DeSerializersT
  >;
  private _schema?;
  get schema(): {
    BUSINESS_PARTNER: OrderableEdmTypeField<
      BpAddressIndependentMobile<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ADDRESS_ID: OrderableEdmTypeField<
      BpAddressIndependentMobile<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    PERSON: OrderableEdmTypeField<
      BpAddressIndependentMobile<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ORDINAL_NUMBER: OrderableEdmTypeField<
      BpAddressIndependentMobile<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    INTERNATIONAL_PHONE_NUMBER: OrderableEdmTypeField<
      BpAddressIndependentMobile<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    IS_DEFAULT_PHONE_NUMBER: OrderableEdmTypeField<
      BpAddressIndependentMobile<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    MOBILE_PHONE_COUNTRY: OrderableEdmTypeField<
      BpAddressIndependentMobile<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    MOBILE_PHONE_NUMBER: OrderableEdmTypeField<
      BpAddressIndependentMobile<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    PHONE_NUMBER_EXTENSION: OrderableEdmTypeField<
      BpAddressIndependentMobile<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    PHONE_NUMBER_TYPE: OrderableEdmTypeField<
      BpAddressIndependentMobile<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    VALIDITY_START_DATE: OrderableEdmTypeField<
      BpAddressIndependentMobile<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      true,
      true
    >;
    VALIDITY_END_DATE: OrderableEdmTypeField<
      BpAddressIndependentMobile<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      true,
      true
    >;
    ALL_FIELDS: AllFields<BpAddressIndependentMobile<DeSerializers>>;
  };
}
