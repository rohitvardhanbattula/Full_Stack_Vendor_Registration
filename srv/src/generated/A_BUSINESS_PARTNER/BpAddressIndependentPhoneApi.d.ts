/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { BpAddressIndependentPhone } from './BpAddressIndependentPhone';
import { BpAddressIndependentPhoneRequestBuilder } from './BpAddressIndependentPhoneRequestBuilder';
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
export declare class BpAddressIndependentPhoneApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements
    EntityApi<BpAddressIndependentPhone<DeSerializersT>, DeSerializersT>
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
  ): BpAddressIndependentPhoneApi<DeSerializersT>;
  private navigationPropertyFields;
  _addNavigationProperties(linkedApis: []): this;
  entityConstructor: typeof BpAddressIndependentPhone;
  requestBuilder(): BpAddressIndependentPhoneRequestBuilder<DeSerializersT>;
  entityBuilder(): EntityBuilderType<
    BpAddressIndependentPhone<DeSerializersT>,
    DeSerializersT
  >;
  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable?: NullableT
  ): CustomField<
    BpAddressIndependentPhone<DeSerializersT>,
    DeSerializersT,
    NullableT
  >;
  private _fieldBuilder?;
  get fieldBuilder(): FieldBuilder<
    typeof BpAddressIndependentPhone,
    DeSerializersT
  >;
  private _schema?;
  get schema(): {
    BUSINESS_PARTNER: OrderableEdmTypeField<
      BpAddressIndependentPhone<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ADDRESS_ID: OrderableEdmTypeField<
      BpAddressIndependentPhone<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    PERSON: OrderableEdmTypeField<
      BpAddressIndependentPhone<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ORDINAL_NUMBER: OrderableEdmTypeField<
      BpAddressIndependentPhone<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DESTINATION_LOCATION_COUNTRY: OrderableEdmTypeField<
      BpAddressIndependentPhone<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    INTERNATIONAL_PHONE_NUMBER: OrderableEdmTypeField<
      BpAddressIndependentPhone<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    IS_DEFAULT_PHONE_NUMBER: OrderableEdmTypeField<
      BpAddressIndependentPhone<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    PHONE_NUMBER: OrderableEdmTypeField<
      BpAddressIndependentPhone<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    PHONE_NUMBER_EXTENSION: OrderableEdmTypeField<
      BpAddressIndependentPhone<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    PHONE_NUMBER_TYPE: OrderableEdmTypeField<
      BpAddressIndependentPhone<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    VALIDITY_START_DATE: OrderableEdmTypeField<
      BpAddressIndependentPhone<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      true,
      true
    >;
    VALIDITY_END_DATE: OrderableEdmTypeField<
      BpAddressIndependentPhone<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      true,
      true
    >;
    ALL_FIELDS: AllFields<BpAddressIndependentPhone<DeSerializers>>;
  };
}
