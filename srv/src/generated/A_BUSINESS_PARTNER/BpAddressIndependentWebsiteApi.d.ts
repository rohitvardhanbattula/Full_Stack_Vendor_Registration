/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { BpAddressIndependentWebsite } from './BpAddressIndependentWebsite';
import { BpAddressIndependentWebsiteRequestBuilder } from './BpAddressIndependentWebsiteRequestBuilder';
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
export declare class BpAddressIndependentWebsiteApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements
    EntityApi<BpAddressIndependentWebsite<DeSerializersT>, DeSerializersT>
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
  ): BpAddressIndependentWebsiteApi<DeSerializersT>;
  private navigationPropertyFields;
  _addNavigationProperties(linkedApis: []): this;
  entityConstructor: typeof BpAddressIndependentWebsite;
  requestBuilder(): BpAddressIndependentWebsiteRequestBuilder<DeSerializersT>;
  entityBuilder(): EntityBuilderType<
    BpAddressIndependentWebsite<DeSerializersT>,
    DeSerializersT
  >;
  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable?: NullableT
  ): CustomField<
    BpAddressIndependentWebsite<DeSerializersT>,
    DeSerializersT,
    NullableT
  >;
  private _fieldBuilder?;
  get fieldBuilder(): FieldBuilder<
    typeof BpAddressIndependentWebsite,
    DeSerializersT
  >;
  private _schema?;
  get schema(): {
    BUSINESS_PARTNER: OrderableEdmTypeField<
      BpAddressIndependentWebsite<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ADDRESS_ID: OrderableEdmTypeField<
      BpAddressIndependentWebsite<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    PERSON: OrderableEdmTypeField<
      BpAddressIndependentWebsite<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ORDINAL_NUMBER: OrderableEdmTypeField<
      BpAddressIndependentWebsite<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    IS_DEFAULT_URL_ADDRESS: OrderableEdmTypeField<
      BpAddressIndependentWebsite<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    URL_FIELD_LENGTH: OrderableEdmTypeField<
      BpAddressIndependentWebsite<DeSerializers>,
      DeSerializersT,
      'Edm.Int32',
      true,
      true
    >;
    WEBSITE_URL: OrderableEdmTypeField<
      BpAddressIndependentWebsite<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    ALL_FIELDS: AllFields<BpAddressIndependentWebsite<DeSerializers>>;
  };
}
