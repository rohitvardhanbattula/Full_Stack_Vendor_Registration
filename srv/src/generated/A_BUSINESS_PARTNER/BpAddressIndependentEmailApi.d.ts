/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { BpAddressIndependentEmail } from './BpAddressIndependentEmail';
import { BpAddressIndependentEmailRequestBuilder } from './BpAddressIndependentEmailRequestBuilder';
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
export declare class BpAddressIndependentEmailApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements
    EntityApi<BpAddressIndependentEmail<DeSerializersT>, DeSerializersT>
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
  ): BpAddressIndependentEmailApi<DeSerializersT>;
  private navigationPropertyFields;
  _addNavigationProperties(linkedApis: []): this;
  entityConstructor: typeof BpAddressIndependentEmail;
  requestBuilder(): BpAddressIndependentEmailRequestBuilder<DeSerializersT>;
  entityBuilder(): EntityBuilderType<
    BpAddressIndependentEmail<DeSerializersT>,
    DeSerializersT
  >;
  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable?: NullableT
  ): CustomField<
    BpAddressIndependentEmail<DeSerializersT>,
    DeSerializersT,
    NullableT
  >;
  private _fieldBuilder?;
  get fieldBuilder(): FieldBuilder<
    typeof BpAddressIndependentEmail,
    DeSerializersT
  >;
  private _schema?;
  get schema(): {
    BUSINESS_PARTNER: OrderableEdmTypeField<
      BpAddressIndependentEmail<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ADDRESS_ID: OrderableEdmTypeField<
      BpAddressIndependentEmail<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    PERSON: OrderableEdmTypeField<
      BpAddressIndependentEmail<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ORDINAL_NUMBER: OrderableEdmTypeField<
      BpAddressIndependentEmail<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    EMAIL_ADDRESS: OrderableEdmTypeField<
      BpAddressIndependentEmail<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    IS_DEFAULT_EMAIL_ADDRESS: OrderableEdmTypeField<
      BpAddressIndependentEmail<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    VALIDITY_START_DATE: OrderableEdmTypeField<
      BpAddressIndependentEmail<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      true,
      true
    >;
    VALIDITY_END_DATE: OrderableEdmTypeField<
      BpAddressIndependentEmail<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      true,
      true
    >;
    ALL_FIELDS: AllFields<BpAddressIndependentEmail<DeSerializers>>;
  };
}
