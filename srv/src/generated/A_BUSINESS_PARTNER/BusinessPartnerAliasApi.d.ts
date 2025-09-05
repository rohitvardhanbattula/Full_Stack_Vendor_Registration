/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { BusinessPartnerAlias } from './BusinessPartnerAlias';
import { BusinessPartnerAliasRequestBuilder } from './BusinessPartnerAliasRequestBuilder';
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
export declare class BusinessPartnerAliasApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<BusinessPartnerAlias<DeSerializersT>, DeSerializersT>
{
  deSerializers: DeSerializersT;
  private constructor();
  /**
   * Do not use this method or the constructor directly.
   * Use the service function as described in the documentation to get an API instance.
   */
  static _privateFactory<
    DeSerializersT extends DeSerializers = DefaultDeSerializers
  >(deSerializers?: DeSerializersT): BusinessPartnerAliasApi<DeSerializersT>;
  private navigationPropertyFields;
  _addNavigationProperties(linkedApis: []): this;
  entityConstructor: typeof BusinessPartnerAlias;
  requestBuilder(): BusinessPartnerAliasRequestBuilder<DeSerializersT>;
  entityBuilder(): EntityBuilderType<
    BusinessPartnerAlias<DeSerializersT>,
    DeSerializersT
  >;
  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable?: NullableT
  ): CustomField<
    BusinessPartnerAlias<DeSerializersT>,
    DeSerializersT,
    NullableT
  >;
  private _fieldBuilder?;
  get fieldBuilder(): FieldBuilder<typeof BusinessPartnerAlias, DeSerializersT>;
  private _schema?;
  get schema(): {
    BUSINESS_PARTNER: OrderableEdmTypeField<
      BusinessPartnerAlias<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    BP_ALIAS_POSITION_NUMBER: OrderableEdmTypeField<
      BusinessPartnerAlias<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    BUSINESS_PARTNER_ALIAS_NAME: OrderableEdmTypeField<
      BusinessPartnerAlias<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    ALL_FIELDS: AllFields<BusinessPartnerAlias<DeSerializers>>;
  };
}
