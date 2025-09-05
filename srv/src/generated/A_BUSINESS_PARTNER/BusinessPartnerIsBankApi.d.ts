/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { BusinessPartnerIsBank } from './BusinessPartnerIsBank';
import { BusinessPartnerIsBankRequestBuilder } from './BusinessPartnerIsBankRequestBuilder';
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
export declare class BusinessPartnerIsBankApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<BusinessPartnerIsBank<DeSerializersT>, DeSerializersT>
{
  deSerializers: DeSerializersT;
  private constructor();
  /**
   * Do not use this method or the constructor directly.
   * Use the service function as described in the documentation to get an API instance.
   */
  static _privateFactory<
    DeSerializersT extends DeSerializers = DefaultDeSerializers
  >(deSerializers?: DeSerializersT): BusinessPartnerIsBankApi<DeSerializersT>;
  private navigationPropertyFields;
  _addNavigationProperties(linkedApis: []): this;
  entityConstructor: typeof BusinessPartnerIsBank;
  requestBuilder(): BusinessPartnerIsBankRequestBuilder<DeSerializersT>;
  entityBuilder(): EntityBuilderType<
    BusinessPartnerIsBank<DeSerializersT>,
    DeSerializersT
  >;
  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable?: NullableT
  ): CustomField<
    BusinessPartnerIsBank<DeSerializersT>,
    DeSerializersT,
    NullableT
  >;
  private _fieldBuilder?;
  get fieldBuilder(): FieldBuilder<
    typeof BusinessPartnerIsBank,
    DeSerializersT
  >;
  private _schema?;
  get schema(): {
    BUSINESS_PARTNER: OrderableEdmTypeField<
      BusinessPartnerIsBank<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    BANK_KEY: OrderableEdmTypeField<
      BusinessPartnerIsBank<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    BANK_COUNTRY: OrderableEdmTypeField<
      BusinessPartnerIsBank<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    BP_MINIMUM_RESERVE: OrderableEdmTypeField<
      BusinessPartnerIsBank<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    ALL_FIELDS: AllFields<BusinessPartnerIsBank<DeSerializers>>;
  };
}
