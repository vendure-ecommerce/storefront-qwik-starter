import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
	[_ in K]?: never;
};
export type Incremental<T> =
	| T
	| { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
	/** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
	DateTime: { input: any; output: any };
	/** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
	JSON: { input: any; output: any };
	/** The `Money` scalar type represents monetary values and supports signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
	Money: { input: any; output: any };
	/** The `Upload` scalar type represents a file upload. */
	Upload: { input: any; output: any };
};

export type ActiveOrderResult = NoActiveOrderError | Order;

export type AddItemInput = {
	customFields?: InputMaybe<OrderLineCustomFieldsInput>;
	productVariantId: Scalars['ID']['input'];
	quantity: Scalars['Int']['input'];
};

export type AddPaymentToOrderResult =
	| IneligiblePaymentMethodError
	| NoActiveOrderError
	| Order
	| OrderPaymentStateError
	| OrderStateTransitionError
	| PaymentDeclinedError
	| PaymentFailedError;

export type Address = Node & {
	__typename?: 'Address';
	city?: Maybe<Scalars['String']['output']>;
	company?: Maybe<Scalars['String']['output']>;
	country: Country;
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	defaultBillingAddress?: Maybe<Scalars['Boolean']['output']>;
	defaultShippingAddress?: Maybe<Scalars['Boolean']['output']>;
	fullName?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	phoneNumber?: Maybe<Scalars['String']['output']>;
	postalCode?: Maybe<Scalars['String']['output']>;
	province?: Maybe<Scalars['String']['output']>;
	streetLine1: Scalars['String']['output'];
	streetLine2?: Maybe<Scalars['String']['output']>;
	updatedAt: Scalars['DateTime']['output'];
};

export type AddressValidationResults = {
	__typename?: 'AddressValidationResults';
	isValid?: Maybe<Scalars['Boolean']['output']>;
	/** An array of messages related to the address validation. */
	messages?: Maybe<Array<Maybe<ShippoResponseMessage>>>;
};

export type Adjustment = {
	__typename?: 'Adjustment';
	adjustmentSource: Scalars['String']['output'];
	amount: Scalars['Money']['output'];
	data?: Maybe<Scalars['JSON']['output']>;
	description: Scalars['String']['output'];
	type: AdjustmentType;
};

export const AdjustmentType = {
	DistributedOrderPromotion: 'DISTRIBUTED_ORDER_PROMOTION',
	Other: 'OTHER',
	Promotion: 'PROMOTION',
} as const;

export type AdjustmentType = (typeof AdjustmentType)[keyof typeof AdjustmentType];
/** Returned when attempting to set the Customer for an Order when already logged in. */
export type AlreadyLoggedInError = ErrorResult & {
	__typename?: 'AlreadyLoggedInError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

export type ApplyCouponCodeResult =
	| CouponCodeExpiredError
	| CouponCodeInvalidError
	| CouponCodeLimitError
	| Order;

export type Asset = Node & {
	__typename?: 'Asset';
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<AssetCustomFields>;
	fileSize: Scalars['Int']['output'];
	focalPoint?: Maybe<Coordinate>;
	height: Scalars['Int']['output'];
	id: Scalars['ID']['output'];
	mimeType: Scalars['String']['output'];
	name: Scalars['String']['output'];
	preview: Scalars['String']['output'];
	source: Scalars['String']['output'];
	tags: Array<Tag>;
	type: AssetType;
	updatedAt: Scalars['DateTime']['output'];
	width: Scalars['Int']['output'];
};

export type AssetCustomFields = {
	__typename?: 'AssetCustomFields';
	review?: Maybe<ProductReview>;
};

export type AssetList = PaginatedList & {
	__typename?: 'AssetList';
	items: Array<Asset>;
	totalItems: Scalars['Int']['output'];
};

export const AssetType = {
	Binary: 'BINARY',
	Image: 'IMAGE',
	Video: 'VIDEO',
} as const;

export type AssetType = (typeof AssetType)[keyof typeof AssetType];
export type AuthenticationInput = {
	native?: InputMaybe<NativeAuthInput>;
};

export type AuthenticationMethod = Node & {
	__typename?: 'AuthenticationMethod';
	createdAt: Scalars['DateTime']['output'];
	id: Scalars['ID']['output'];
	strategy: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type AuthenticationResult = CurrentUser | InvalidCredentialsError | NotVerifiedError;

export type BatchAddCustomizedImagesToOrderResult =
	| BatchAddCustomizedImagesToOrderSuccess
	| CreateCustomizedImageAssetError;

export type BatchAddCustomizedImagesToOrderSuccess = {
	__typename?: 'BatchAddCustomizedImagesToOrderSuccess';
	assetIds: Array<Scalars['ID']['output']>;
	message: Scalars['String']['output'];
	orderLineIds: Array<Scalars['ID']['output']>;
};

export type BooleanCustomFieldConfig = CustomField & {
	__typename?: 'BooleanCustomFieldConfig';
	deprecated?: Maybe<Scalars['Boolean']['output']>;
	deprecationReason?: Maybe<Scalars['String']['output']>;
	description?: Maybe<Array<LocalizedString>>;
	internal?: Maybe<Scalars['Boolean']['output']>;
	label?: Maybe<Array<LocalizedString>>;
	list: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	nullable?: Maybe<Scalars['Boolean']['output']>;
	readonly?: Maybe<Scalars['Boolean']['output']>;
	requiresPermission?: Maybe<Array<Permission>>;
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

/** Operators for filtering on a list of Boolean fields */
export type BooleanListOperators = {
	inList: Scalars['Boolean']['input'];
};

/** Operators for filtering on a Boolean field */
export type BooleanOperators = {
	eq?: InputMaybe<Scalars['Boolean']['input']>;
	isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BooleanStructFieldConfig = StructField & {
	__typename?: 'BooleanStructFieldConfig';
	description?: Maybe<Array<LocalizedString>>;
	label?: Maybe<Array<LocalizedString>>;
	list: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type Channel = Node & {
	__typename?: 'Channel';
	availableCurrencyCodes: Array<CurrencyCode>;
	availableLanguageCodes?: Maybe<Array<LanguageCode>>;
	code: Scalars['String']['output'];
	createdAt: Scalars['DateTime']['output'];
	/** @deprecated Use defaultCurrencyCode instead */
	currencyCode: CurrencyCode;
	customFields?: Maybe<Scalars['JSON']['output']>;
	defaultCurrencyCode: CurrencyCode;
	defaultLanguageCode: LanguageCode;
	defaultShippingZone?: Maybe<Zone>;
	defaultTaxZone?: Maybe<Zone>;
	id: Scalars['ID']['output'];
	/** Not yet used - will be implemented in a future release. */
	outOfStockThreshold?: Maybe<Scalars['Int']['output']>;
	pricesIncludeTax: Scalars['Boolean']['output'];
	seller?: Maybe<Seller>;
	token: Scalars['String']['output'];
	/** Not yet used - will be implemented in a future release. */
	trackInventory?: Maybe<Scalars['Boolean']['output']>;
	updatedAt: Scalars['DateTime']['output'];
};

export type Collection = Node & {
	__typename?: 'Collection';
	assets: Array<Asset>;
	breadcrumbs: Array<CollectionBreadcrumb>;
	children?: Maybe<Array<Collection>>;
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	description: Scalars['String']['output'];
	featuredAsset?: Maybe<Asset>;
	filters: Array<ConfigurableOperation>;
	id: Scalars['ID']['output'];
	languageCode?: Maybe<LanguageCode>;
	name: Scalars['String']['output'];
	parent?: Maybe<Collection>;
	parentId: Scalars['ID']['output'];
	position: Scalars['Int']['output'];
	productVariants: ProductVariantList;
	slug: Scalars['String']['output'];
	translations: Array<CollectionTranslation>;
	updatedAt: Scalars['DateTime']['output'];
};

export type CollectionProductVariantsArgs = {
	options?: InputMaybe<ProductVariantListOptions>;
};

export type CollectionBreadcrumb = {
	__typename?: 'CollectionBreadcrumb';
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	slug: Scalars['String']['output'];
};

export type CollectionFilterParameter = {
	_and?: InputMaybe<Array<CollectionFilterParameter>>;
	_or?: InputMaybe<Array<CollectionFilterParameter>>;
	createdAt?: InputMaybe<DateOperators>;
	description?: InputMaybe<StringOperators>;
	id?: InputMaybe<IdOperators>;
	languageCode?: InputMaybe<StringOperators>;
	name?: InputMaybe<StringOperators>;
	parentId?: InputMaybe<IdOperators>;
	position?: InputMaybe<NumberOperators>;
	slug?: InputMaybe<StringOperators>;
	updatedAt?: InputMaybe<DateOperators>;
};

export type CollectionList = PaginatedList & {
	__typename?: 'CollectionList';
	items: Array<Collection>;
	totalItems: Scalars['Int']['output'];
};

export type CollectionListOptions = {
	/** Allows the results to be filtered */
	filter?: InputMaybe<CollectionFilterParameter>;
	/** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
	filterOperator?: InputMaybe<LogicalOperator>;
	/** Skips the first n results, for use in pagination */
	skip?: InputMaybe<Scalars['Int']['input']>;
	/** Specifies which properties to sort the results by */
	sort?: InputMaybe<CollectionSortParameter>;
	/** Takes n results, for use in pagination */
	take?: InputMaybe<Scalars['Int']['input']>;
	topLevelOnly?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * Which Collections are present in the products returned
 * by the search, and in what quantity.
 */
export type CollectionResult = {
	__typename?: 'CollectionResult';
	collection: Collection;
	count: Scalars['Int']['output'];
};

export type CollectionSortParameter = {
	createdAt?: InputMaybe<SortOrder>;
	description?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	parentId?: InputMaybe<SortOrder>;
	position?: InputMaybe<SortOrder>;
	slug?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type CollectionTranslation = {
	__typename?: 'CollectionTranslation';
	createdAt: Scalars['DateTime']['output'];
	description: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	slug: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type ConfigArg = {
	__typename?: 'ConfigArg';
	name: Scalars['String']['output'];
	value: Scalars['String']['output'];
};

export type ConfigArgDefinition = {
	__typename?: 'ConfigArgDefinition';
	defaultValue?: Maybe<Scalars['JSON']['output']>;
	description?: Maybe<Scalars['String']['output']>;
	label?: Maybe<Scalars['String']['output']>;
	list: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	required: Scalars['Boolean']['output'];
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type ConfigArgInput = {
	name: Scalars['String']['input'];
	/** A JSON stringified representation of the actual value */
	value: Scalars['String']['input'];
};

export type ConfigurableOperation = {
	__typename?: 'ConfigurableOperation';
	args: Array<ConfigArg>;
	code: Scalars['String']['output'];
};

export type ConfigurableOperationDefinition = {
	__typename?: 'ConfigurableOperationDefinition';
	args: Array<ConfigArgDefinition>;
	code: Scalars['String']['output'];
	description: Scalars['String']['output'];
};

export type ConfigurableOperationInput = {
	arguments: Array<ConfigArgInput>;
	code: Scalars['String']['input'];
};

export type Coordinate = {
	__typename?: 'Coordinate';
	x: Scalars['Float']['output'];
	y: Scalars['Float']['output'];
};

/**
 * A Country of the world which your shop operates in.
 *
 * The `code` field is typically a 2-character ISO code such as "GB", "US", "DE" etc. This code is used in certain inputs such as
 * `UpdateAddressInput` and `CreateAddressInput` to specify the country.
 */
export type Country = Node &
	Region & {
		__typename?: 'Country';
		code: Scalars['String']['output'];
		createdAt: Scalars['DateTime']['output'];
		customFields?: Maybe<Scalars['JSON']['output']>;
		enabled: Scalars['Boolean']['output'];
		id: Scalars['ID']['output'];
		languageCode: LanguageCode;
		name: Scalars['String']['output'];
		parent?: Maybe<Region>;
		parentId?: Maybe<Scalars['ID']['output']>;
		translations: Array<RegionTranslation>;
		type: Scalars['String']['output'];
		updatedAt: Scalars['DateTime']['output'];
	};

export type CountryList = PaginatedList & {
	__typename?: 'CountryList';
	items: Array<Country>;
	totalItems: Scalars['Int']['output'];
};

/** Returned if the provided coupon code is invalid */
export type CouponCodeExpiredError = ErrorResult & {
	__typename?: 'CouponCodeExpiredError';
	couponCode: Scalars['String']['output'];
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

/** Returned if the provided coupon code is invalid */
export type CouponCodeInvalidError = ErrorResult & {
	__typename?: 'CouponCodeInvalidError';
	couponCode: Scalars['String']['output'];
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

/** Returned if the provided coupon code is invalid */
export type CouponCodeLimitError = ErrorResult & {
	__typename?: 'CouponCodeLimitError';
	couponCode: Scalars['String']['output'];
	errorCode: ErrorCode;
	limit: Scalars['Int']['output'];
	message: Scalars['String']['output'];
};

/**
 * Input used to create an Address.
 *
 * The countryCode must correspond to a `code` property of a Country that has been defined in the
 * Vendure server. The `code` property is typically a 2-character ISO code such as "GB", "US", "DE" etc.
 * If an invalid code is passed, the mutation will fail.
 */
export type CreateAddressInput = {
	city?: InputMaybe<Scalars['String']['input']>;
	company?: InputMaybe<Scalars['String']['input']>;
	countryCode: Scalars['String']['input'];
	customFields?: InputMaybe<Scalars['JSON']['input']>;
	defaultBillingAddress?: InputMaybe<Scalars['Boolean']['input']>;
	defaultShippingAddress?: InputMaybe<Scalars['Boolean']['input']>;
	fullName?: InputMaybe<Scalars['String']['input']>;
	phoneNumber?: InputMaybe<Scalars['String']['input']>;
	postalCode?: InputMaybe<Scalars['String']['input']>;
	province?: InputMaybe<Scalars['String']['input']>;
	streetLine1: Scalars['String']['input'];
	streetLine2?: InputMaybe<Scalars['String']['input']>;
};

export type CreateAssetSuccess = {
	__typename?: 'CreateAssetSuccess';
	assetId: Scalars['ID']['output'];
};

export type CreateCustomerCustomFieldsInput = {
	upvoteReviews?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateCustomerInput = {
	customFields?: InputMaybe<CreateCustomerCustomFieldsInput>;
	emailAddress: Scalars['String']['input'];
	firstName: Scalars['String']['input'];
	lastName: Scalars['String']['input'];
	phoneNumber?: InputMaybe<Scalars['String']['input']>;
	title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCustomizedImageAssetError = ErrorResult & {
	__typename?: 'CreateCustomizedImageAssetError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

/**
 * @description
 * ISO 4217 currency code
 *
 * @docsCategory common
 */
export const CurrencyCode = {
	/** United Arab Emirates dirham */
	Aed: 'AED',
	/** Afghan afghani */
	Afn: 'AFN',
	/** Albanian lek */
	All: 'ALL',
	/** Armenian dram */
	Amd: 'AMD',
	/** Netherlands Antillean guilder */
	Ang: 'ANG',
	/** Angolan kwanza */
	Aoa: 'AOA',
	/** Argentine peso */
	Ars: 'ARS',
	/** Australian dollar */
	Aud: 'AUD',
	/** Aruban florin */
	Awg: 'AWG',
	/** Azerbaijani manat */
	Azn: 'AZN',
	/** Bosnia and Herzegovina convertible mark */
	Bam: 'BAM',
	/** Barbados dollar */
	Bbd: 'BBD',
	/** Bangladeshi taka */
	Bdt: 'BDT',
	/** Bulgarian lev */
	Bgn: 'BGN',
	/** Bahraini dinar */
	Bhd: 'BHD',
	/** Burundian franc */
	Bif: 'BIF',
	/** Bermudian dollar */
	Bmd: 'BMD',
	/** Brunei dollar */
	Bnd: 'BND',
	/** Boliviano */
	Bob: 'BOB',
	/** Brazilian real */
	Brl: 'BRL',
	/** Bahamian dollar */
	Bsd: 'BSD',
	/** Bhutanese ngultrum */
	Btn: 'BTN',
	/** Botswana pula */
	Bwp: 'BWP',
	/** Belarusian ruble */
	Byn: 'BYN',
	/** Belize dollar */
	Bzd: 'BZD',
	/** Canadian dollar */
	Cad: 'CAD',
	/** Congolese franc */
	Cdf: 'CDF',
	/** Swiss franc */
	Chf: 'CHF',
	/** Chilean peso */
	Clp: 'CLP',
	/** Renminbi (Chinese) yuan */
	Cny: 'CNY',
	/** Colombian peso */
	Cop: 'COP',
	/** Costa Rican colon */
	Crc: 'CRC',
	/** Cuban convertible peso */
	Cuc: 'CUC',
	/** Cuban peso */
	Cup: 'CUP',
	/** Cape Verde escudo */
	Cve: 'CVE',
	/** Czech koruna */
	Czk: 'CZK',
	/** Djiboutian franc */
	Djf: 'DJF',
	/** Danish krone */
	Dkk: 'DKK',
	/** Dominican peso */
	Dop: 'DOP',
	/** Algerian dinar */
	Dzd: 'DZD',
	/** Egyptian pound */
	Egp: 'EGP',
	/** Eritrean nakfa */
	Ern: 'ERN',
	/** Ethiopian birr */
	Etb: 'ETB',
	/** Euro */
	Eur: 'EUR',
	/** Fiji dollar */
	Fjd: 'FJD',
	/** Falkland Islands pound */
	Fkp: 'FKP',
	/** Pound sterling */
	Gbp: 'GBP',
	/** Georgian lari */
	Gel: 'GEL',
	/** Ghanaian cedi */
	Ghs: 'GHS',
	/** Gibraltar pound */
	Gip: 'GIP',
	/** Gambian dalasi */
	Gmd: 'GMD',
	/** Guinean franc */
	Gnf: 'GNF',
	/** Guatemalan quetzal */
	Gtq: 'GTQ',
	/** Guyanese dollar */
	Gyd: 'GYD',
	/** Hong Kong dollar */
	Hkd: 'HKD',
	/** Honduran lempira */
	Hnl: 'HNL',
	/** Croatian kuna */
	Hrk: 'HRK',
	/** Haitian gourde */
	Htg: 'HTG',
	/** Hungarian forint */
	Huf: 'HUF',
	/** Indonesian rupiah */
	Idr: 'IDR',
	/** Israeli new shekel */
	Ils: 'ILS',
	/** Indian rupee */
	Inr: 'INR',
	/** Iraqi dinar */
	Iqd: 'IQD',
	/** Iranian rial */
	Irr: 'IRR',
	/** Icelandic króna */
	Isk: 'ISK',
	/** Jamaican dollar */
	Jmd: 'JMD',
	/** Jordanian dinar */
	Jod: 'JOD',
	/** Japanese yen */
	Jpy: 'JPY',
	/** Kenyan shilling */
	Kes: 'KES',
	/** Kyrgyzstani som */
	Kgs: 'KGS',
	/** Cambodian riel */
	Khr: 'KHR',
	/** Comoro franc */
	Kmf: 'KMF',
	/** North Korean won */
	Kpw: 'KPW',
	/** South Korean won */
	Krw: 'KRW',
	/** Kuwaiti dinar */
	Kwd: 'KWD',
	/** Cayman Islands dollar */
	Kyd: 'KYD',
	/** Kazakhstani tenge */
	Kzt: 'KZT',
	/** Lao kip */
	Lak: 'LAK',
	/** Lebanese pound */
	Lbp: 'LBP',
	/** Sri Lankan rupee */
	Lkr: 'LKR',
	/** Liberian dollar */
	Lrd: 'LRD',
	/** Lesotho loti */
	Lsl: 'LSL',
	/** Libyan dinar */
	Lyd: 'LYD',
	/** Moroccan dirham */
	Mad: 'MAD',
	/** Moldovan leu */
	Mdl: 'MDL',
	/** Malagasy ariary */
	Mga: 'MGA',
	/** Macedonian denar */
	Mkd: 'MKD',
	/** Myanmar kyat */
	Mmk: 'MMK',
	/** Mongolian tögrög */
	Mnt: 'MNT',
	/** Macanese pataca */
	Mop: 'MOP',
	/** Mauritanian ouguiya */
	Mru: 'MRU',
	/** Mauritian rupee */
	Mur: 'MUR',
	/** Maldivian rufiyaa */
	Mvr: 'MVR',
	/** Malawian kwacha */
	Mwk: 'MWK',
	/** Mexican peso */
	Mxn: 'MXN',
	/** Malaysian ringgit */
	Myr: 'MYR',
	/** Mozambican metical */
	Mzn: 'MZN',
	/** Namibian dollar */
	Nad: 'NAD',
	/** Nigerian naira */
	Ngn: 'NGN',
	/** Nicaraguan córdoba */
	Nio: 'NIO',
	/** Norwegian krone */
	Nok: 'NOK',
	/** Nepalese rupee */
	Npr: 'NPR',
	/** New Zealand dollar */
	Nzd: 'NZD',
	/** Omani rial */
	Omr: 'OMR',
	/** Panamanian balboa */
	Pab: 'PAB',
	/** Peruvian sol */
	Pen: 'PEN',
	/** Papua New Guinean kina */
	Pgk: 'PGK',
	/** Philippine peso */
	Php: 'PHP',
	/** Pakistani rupee */
	Pkr: 'PKR',
	/** Polish złoty */
	Pln: 'PLN',
	/** Paraguayan guaraní */
	Pyg: 'PYG',
	/** Qatari riyal */
	Qar: 'QAR',
	/** Romanian leu */
	Ron: 'RON',
	/** Serbian dinar */
	Rsd: 'RSD',
	/** Russian ruble */
	Rub: 'RUB',
	/** Rwandan franc */
	Rwf: 'RWF',
	/** Saudi riyal */
	Sar: 'SAR',
	/** Solomon Islands dollar */
	Sbd: 'SBD',
	/** Seychelles rupee */
	Scr: 'SCR',
	/** Sudanese pound */
	Sdg: 'SDG',
	/** Swedish krona/kronor */
	Sek: 'SEK',
	/** Singapore dollar */
	Sgd: 'SGD',
	/** Saint Helena pound */
	Shp: 'SHP',
	/** Sierra Leonean leone */
	Sll: 'SLL',
	/** Somali shilling */
	Sos: 'SOS',
	/** Surinamese dollar */
	Srd: 'SRD',
	/** South Sudanese pound */
	Ssp: 'SSP',
	/** São Tomé and Príncipe dobra */
	Stn: 'STN',
	/** Salvadoran colón */
	Svc: 'SVC',
	/** Syrian pound */
	Syp: 'SYP',
	/** Swazi lilangeni */
	Szl: 'SZL',
	/** Thai baht */
	Thb: 'THB',
	/** Tajikistani somoni */
	Tjs: 'TJS',
	/** Turkmenistan manat */
	Tmt: 'TMT',
	/** Tunisian dinar */
	Tnd: 'TND',
	/** Tongan paʻanga */
	Top: 'TOP',
	/** Turkish lira */
	Try: 'TRY',
	/** Trinidad and Tobago dollar */
	Ttd: 'TTD',
	/** New Taiwan dollar */
	Twd: 'TWD',
	/** Tanzanian shilling */
	Tzs: 'TZS',
	/** Ukrainian hryvnia */
	Uah: 'UAH',
	/** Ugandan shilling */
	Ugx: 'UGX',
	/** United States dollar */
	Usd: 'USD',
	/** Uruguayan peso */
	Uyu: 'UYU',
	/** Uzbekistan som */
	Uzs: 'UZS',
	/** Venezuelan bolívar soberano */
	Ves: 'VES',
	/** Vietnamese đồng */
	Vnd: 'VND',
	/** Vanuatu vatu */
	Vuv: 'VUV',
	/** Samoan tala */
	Wst: 'WST',
	/** CFA franc BEAC */
	Xaf: 'XAF',
	/** East Caribbean dollar */
	Xcd: 'XCD',
	/** CFA franc BCEAO */
	Xof: 'XOF',
	/** CFP franc (franc Pacifique) */
	Xpf: 'XPF',
	/** Yemeni rial */
	Yer: 'YER',
	/** South African rand */
	Zar: 'ZAR',
	/** Zambian kwacha */
	Zmw: 'ZMW',
	/** Zimbabwean dollar */
	Zwl: 'ZWL',
} as const;

export type CurrencyCode = (typeof CurrencyCode)[keyof typeof CurrencyCode];
export type CurrentUser = {
	__typename?: 'CurrentUser';
	channels: Array<CurrentUserChannel>;
	id: Scalars['ID']['output'];
	identifier: Scalars['String']['output'];
};

export type CurrentUserChannel = {
	__typename?: 'CurrentUserChannel';
	code: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	permissions: Array<Permission>;
	token: Scalars['String']['output'];
};

export type CustomField = {
	deprecated?: Maybe<Scalars['Boolean']['output']>;
	deprecationReason?: Maybe<Scalars['String']['output']>;
	description?: Maybe<Array<LocalizedString>>;
	internal?: Maybe<Scalars['Boolean']['output']>;
	label?: Maybe<Array<LocalizedString>>;
	list: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	nullable?: Maybe<Scalars['Boolean']['output']>;
	readonly?: Maybe<Scalars['Boolean']['output']>;
	requiresPermission?: Maybe<Array<Permission>>;
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type CustomFieldConfig =
	| BooleanCustomFieldConfig
	| DateTimeCustomFieldConfig
	| FloatCustomFieldConfig
	| IntCustomFieldConfig
	| LocaleStringCustomFieldConfig
	| LocaleTextCustomFieldConfig
	| RelationCustomFieldConfig
	| StringCustomFieldConfig
	| StructCustomFieldConfig
	| TextCustomFieldConfig;

export type Customer = Node & {
	__typename?: 'Customer';
	addresses?: Maybe<Array<Address>>;
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<CustomerCustomFields>;
	emailAddress: Scalars['String']['output'];
	firstName: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	lastName: Scalars['String']['output'];
	orders: OrderList;
	phoneNumber?: Maybe<Scalars['String']['output']>;
	title?: Maybe<Scalars['String']['output']>;
	updatedAt: Scalars['DateTime']['output'];
	user?: Maybe<User>;
};

export type CustomerOrdersArgs = {
	options?: InputMaybe<OrderListOptions>;
};

export type CustomerCustomFields = {
	__typename?: 'CustomerCustomFields';
	upvoteReviews?: Maybe<Array<Scalars['String']['output']>>;
};

export type CustomerFilterParameter = {
	_and?: InputMaybe<Array<CustomerFilterParameter>>;
	_or?: InputMaybe<Array<CustomerFilterParameter>>;
	createdAt?: InputMaybe<DateOperators>;
	emailAddress?: InputMaybe<StringOperators>;
	firstName?: InputMaybe<StringOperators>;
	id?: InputMaybe<IdOperators>;
	lastName?: InputMaybe<StringOperators>;
	phoneNumber?: InputMaybe<StringOperators>;
	title?: InputMaybe<StringOperators>;
	updatedAt?: InputMaybe<DateOperators>;
	upvoteReviews?: InputMaybe<StringListOperators>;
};

export type CustomerGroup = Node & {
	__typename?: 'CustomerGroup';
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	customers: CustomerList;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type CustomerGroupCustomersArgs = {
	options?: InputMaybe<CustomerListOptions>;
};

export type CustomerList = PaginatedList & {
	__typename?: 'CustomerList';
	items: Array<Customer>;
	totalItems: Scalars['Int']['output'];
};

export type CustomerListOptions = {
	/** Allows the results to be filtered */
	filter?: InputMaybe<CustomerFilterParameter>;
	/** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
	filterOperator?: InputMaybe<LogicalOperator>;
	/** Skips the first n results, for use in pagination */
	skip?: InputMaybe<Scalars['Int']['input']>;
	/** Specifies which properties to sort the results by */
	sort?: InputMaybe<CustomerSortParameter>;
	/** Takes n results, for use in pagination */
	take?: InputMaybe<Scalars['Int']['input']>;
};

export type CustomerSortParameter = {
	createdAt?: InputMaybe<SortOrder>;
	emailAddress?: InputMaybe<SortOrder>;
	firstName?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	lastName?: InputMaybe<SortOrder>;
	phoneNumber?: InputMaybe<SortOrder>;
	title?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type CustomizableClassDef = Node & {
	__typename?: 'CustomizableClassDef';
	createdAt: Scalars['DateTime']['output'];
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	optionDefinition: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

/** Operators for filtering on a list of Date fields */
export type DateListOperators = {
	inList: Scalars['DateTime']['input'];
};

/** Operators for filtering on a DateTime field */
export type DateOperators = {
	after?: InputMaybe<Scalars['DateTime']['input']>;
	before?: InputMaybe<Scalars['DateTime']['input']>;
	between?: InputMaybe<DateRange>;
	eq?: InputMaybe<Scalars['DateTime']['input']>;
	isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DateRange = {
	end: Scalars['DateTime']['input'];
	start: Scalars['DateTime']['input'];
};

/**
 * Expects the same validation formats as the `<input type="datetime-local">` HTML element.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Additional_attributes
 */
export type DateTimeCustomFieldConfig = CustomField & {
	__typename?: 'DateTimeCustomFieldConfig';
	deprecated?: Maybe<Scalars['Boolean']['output']>;
	deprecationReason?: Maybe<Scalars['String']['output']>;
	description?: Maybe<Array<LocalizedString>>;
	internal?: Maybe<Scalars['Boolean']['output']>;
	label?: Maybe<Array<LocalizedString>>;
	list: Scalars['Boolean']['output'];
	max?: Maybe<Scalars['String']['output']>;
	min?: Maybe<Scalars['String']['output']>;
	name: Scalars['String']['output'];
	nullable?: Maybe<Scalars['Boolean']['output']>;
	readonly?: Maybe<Scalars['Boolean']['output']>;
	requiresPermission?: Maybe<Array<Permission>>;
	step?: Maybe<Scalars['Int']['output']>;
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

/**
 * Expects the same validation formats as the `<input type="datetime-local">` HTML element.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Additional_attributes
 */
export type DateTimeStructFieldConfig = StructField & {
	__typename?: 'DateTimeStructFieldConfig';
	description?: Maybe<Array<LocalizedString>>;
	label?: Maybe<Array<LocalizedString>>;
	list: Scalars['Boolean']['output'];
	max?: Maybe<Scalars['String']['output']>;
	min?: Maybe<Scalars['String']['output']>;
	name: Scalars['String']['output'];
	step?: Maybe<Scalars['Int']['output']>;
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type DeletionResponse = {
	__typename?: 'DeletionResponse';
	message?: Maybe<Scalars['String']['output']>;
	result: DeletionResult;
};

export const DeletionResult = {
	/** The entity was successfully deleted */
	Deleted: 'DELETED',
	/** Deletion did not take place, reason given in message */
	NotDeleted: 'NOT_DELETED',
} as const;

export type DeletionResult = (typeof DeletionResult)[keyof typeof DeletionResult];
export type Discount = {
	__typename?: 'Discount';
	adjustmentSource: Scalars['String']['output'];
	amount: Scalars['Money']['output'];
	amountWithTax: Scalars['Money']['output'];
	description: Scalars['String']['output'];
	type: AdjustmentType;
};

/** Returned when attempting to create a Customer with an email address already registered to an existing User. */
export type EmailAddressConflictError = ErrorResult & {
	__typename?: 'EmailAddressConflictError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

export const ErrorCode = {
	AlreadyLoggedInError: 'ALREADY_LOGGED_IN_ERROR',
	CouponCodeExpiredError: 'COUPON_CODE_EXPIRED_ERROR',
	CouponCodeInvalidError: 'COUPON_CODE_INVALID_ERROR',
	CouponCodeLimitError: 'COUPON_CODE_LIMIT_ERROR',
	CreateCustomizedImageAssetError: 'CREATE_CUSTOMIZED_IMAGE_ASSET_ERROR',
	CustomizedImageAuthorizationError: 'CUSTOMIZED_IMAGE_AUTHORIZATION_ERROR',
	EmailAddressConflictError: 'EMAIL_ADDRESS_CONFLICT_ERROR',
	GetPurchasedVariantForReviewError: 'GET_PURCHASED_VARIANT_FOR_REVIEW_ERROR',
	GuestCheckoutError: 'GUEST_CHECKOUT_ERROR',
	IdentifierChangeTokenExpiredError: 'IDENTIFIER_CHANGE_TOKEN_EXPIRED_ERROR',
	IdentifierChangeTokenInvalidError: 'IDENTIFIER_CHANGE_TOKEN_INVALID_ERROR',
	IneligiblePaymentMethodError: 'INELIGIBLE_PAYMENT_METHOD_ERROR',
	IneligibleShippingMethodError: 'INELIGIBLE_SHIPPING_METHOD_ERROR',
	InsufficientStockError: 'INSUFFICIENT_STOCK_ERROR',
	InvalidCredentialsError: 'INVALID_CREDENTIALS_ERROR',
	MimetypeNotAllowedError: 'MIMETYPE_NOT_ALLOWED_ERROR',
	MissingPasswordError: 'MISSING_PASSWORD_ERROR',
	NativeAuthStrategyError: 'NATIVE_AUTH_STRATEGY_ERROR',
	NegativeQuantityError: 'NEGATIVE_QUANTITY_ERROR',
	NotVerifiedError: 'NOT_VERIFIED_ERROR',
	NoActiveOrderError: 'NO_ACTIVE_ORDER_ERROR',
	OrderInterceptorError: 'ORDER_INTERCEPTOR_ERROR',
	OrderLimitError: 'ORDER_LIMIT_ERROR',
	OrderModificationError: 'ORDER_MODIFICATION_ERROR',
	OrderPaymentStateError: 'ORDER_PAYMENT_STATE_ERROR',
	OrderStateTransitionError: 'ORDER_STATE_TRANSITION_ERROR',
	PasswordAlreadySetError: 'PASSWORD_ALREADY_SET_ERROR',
	PasswordResetTokenExpiredError: 'PASSWORD_RESET_TOKEN_EXPIRED_ERROR',
	PasswordResetTokenInvalidError: 'PASSWORD_RESET_TOKEN_INVALID_ERROR',
	PasswordValidationError: 'PASSWORD_VALIDATION_ERROR',
	PaymentDeclinedError: 'PAYMENT_DECLINED_ERROR',
	PaymentFailedError: 'PAYMENT_FAILED_ERROR',
	ReviewSubmissionError: 'REVIEW_SUBMISSION_ERROR',
	SellerAddressNotSetOrInvalid: 'SELLER_ADDRESS_NOT_SET_OR_INVALID',
	SellerShippoApiKeyNotSetOrInvalid: 'SELLER_SHIPPO_API_KEY_NOT_SET_OR_INVALID',
	SettingsStoreShippoApiKeyNotSetOrInvalid: 'SETTINGS_STORE_SHIPPO_API_KEY_NOT_SET_OR_INVALID',
	ShippoAddressValidationError: 'SHIPPO_ADDRESS_VALIDATION_ERROR',
	ShippoUpdateFulfillmentStateError: 'SHIPPO_UPDATE_FULFILLMENT_STATE_ERROR',
	UnknownError: 'UNKNOWN_ERROR',
	UpdateFulfillmentStateError: 'UPDATE_FULFILLMENT_STATE_ERROR',
	ValidateAddressError: 'VALIDATE_ADDRESS_ERROR',
	VerificationTokenExpiredError: 'VERIFICATION_TOKEN_EXPIRED_ERROR',
	VerificationTokenInvalidError: 'VERIFICATION_TOKEN_INVALID_ERROR',
	VoteOnReviewError: 'VOTE_ON_REVIEW_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
export type ErrorResult = {
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

export type Facet = Node & {
	__typename?: 'Facet';
	code: Scalars['String']['output'];
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	translations: Array<FacetTranslation>;
	updatedAt: Scalars['DateTime']['output'];
	/** Returns a paginated, sortable, filterable list of the Facet's values. Added in v2.1.0. */
	valueList: FacetValueList;
	values: Array<FacetValue>;
};

export type FacetValueListArgs = {
	options?: InputMaybe<FacetValueListOptions>;
};

export type FacetFilterParameter = {
	_and?: InputMaybe<Array<FacetFilterParameter>>;
	_or?: InputMaybe<Array<FacetFilterParameter>>;
	code?: InputMaybe<StringOperators>;
	createdAt?: InputMaybe<DateOperators>;
	id?: InputMaybe<IdOperators>;
	languageCode?: InputMaybe<StringOperators>;
	name?: InputMaybe<StringOperators>;
	updatedAt?: InputMaybe<DateOperators>;
};

export type FacetList = PaginatedList & {
	__typename?: 'FacetList';
	items: Array<Facet>;
	totalItems: Scalars['Int']['output'];
};

export type FacetListOptions = {
	/** Allows the results to be filtered */
	filter?: InputMaybe<FacetFilterParameter>;
	/** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
	filterOperator?: InputMaybe<LogicalOperator>;
	/** Skips the first n results, for use in pagination */
	skip?: InputMaybe<Scalars['Int']['input']>;
	/** Specifies which properties to sort the results by */
	sort?: InputMaybe<FacetSortParameter>;
	/** Takes n results, for use in pagination */
	take?: InputMaybe<Scalars['Int']['input']>;
};

export type FacetSortParameter = {
	code?: InputMaybe<SortOrder>;
	createdAt?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type FacetTranslation = {
	__typename?: 'FacetTranslation';
	createdAt: Scalars['DateTime']['output'];
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type FacetValue = Node & {
	__typename?: 'FacetValue';
	code: Scalars['String']['output'];
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	facet: Facet;
	facetId: Scalars['ID']['output'];
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	translations: Array<FacetValueTranslation>;
	updatedAt: Scalars['DateTime']['output'];
};

/**
 * Used to construct boolean expressions for filtering search results
 * by FacetValue ID. Examples:
 *
 * * ID=1 OR ID=2: `{ facetValueFilters: [{ or: [1,2] }] }`
 * * ID=1 AND ID=2: `{ facetValueFilters: [{ and: 1 }, { and: 2 }] }`
 * * ID=1 AND (ID=2 OR ID=3): `{ facetValueFilters: [{ and: 1 }, { or: [2,3] }] }`
 */
export type FacetValueFilterInput = {
	and?: InputMaybe<Scalars['ID']['input']>;
	or?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type FacetValueFilterParameter = {
	_and?: InputMaybe<Array<FacetValueFilterParameter>>;
	_or?: InputMaybe<Array<FacetValueFilterParameter>>;
	code?: InputMaybe<StringOperators>;
	createdAt?: InputMaybe<DateOperators>;
	facetId?: InputMaybe<IdOperators>;
	id?: InputMaybe<IdOperators>;
	languageCode?: InputMaybe<StringOperators>;
	name?: InputMaybe<StringOperators>;
	updatedAt?: InputMaybe<DateOperators>;
};

export type FacetValueList = PaginatedList & {
	__typename?: 'FacetValueList';
	items: Array<FacetValue>;
	totalItems: Scalars['Int']['output'];
};

export type FacetValueListOptions = {
	/** Allows the results to be filtered */
	filter?: InputMaybe<FacetValueFilterParameter>;
	/** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
	filterOperator?: InputMaybe<LogicalOperator>;
	/** Skips the first n results, for use in pagination */
	skip?: InputMaybe<Scalars['Int']['input']>;
	/** Specifies which properties to sort the results by */
	sort?: InputMaybe<FacetValueSortParameter>;
	/** Takes n results, for use in pagination */
	take?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Which FacetValues are present in the products returned
 * by the search, and in what quantity.
 */
export type FacetValueResult = {
	__typename?: 'FacetValueResult';
	count: Scalars['Int']['output'];
	facetValue: FacetValue;
};

export type FacetValueSortParameter = {
	code?: InputMaybe<SortOrder>;
	createdAt?: InputMaybe<SortOrder>;
	facetId?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type FacetValueTranslation = {
	__typename?: 'FacetValueTranslation';
	createdAt: Scalars['DateTime']['output'];
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type FilamentColor = Node & {
	__typename?: 'FilamentColor';
	createdAt: Scalars['DateTime']['output'];
	displayName: Scalars['String']['output'];
	hexCode: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	/** 		If true, this color is out of stock and cannot be selected		 */
	isOutOfStock: Scalars['Boolean']['output'];
	/** 		If false, this color will not be shown in the selector		 */
	isSupported: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type FloatCustomFieldConfig = CustomField & {
	__typename?: 'FloatCustomFieldConfig';
	deprecated?: Maybe<Scalars['Boolean']['output']>;
	deprecationReason?: Maybe<Scalars['String']['output']>;
	description?: Maybe<Array<LocalizedString>>;
	internal?: Maybe<Scalars['Boolean']['output']>;
	label?: Maybe<Array<LocalizedString>>;
	list: Scalars['Boolean']['output'];
	max?: Maybe<Scalars['Float']['output']>;
	min?: Maybe<Scalars['Float']['output']>;
	name: Scalars['String']['output'];
	nullable?: Maybe<Scalars['Boolean']['output']>;
	readonly?: Maybe<Scalars['Boolean']['output']>;
	requiresPermission?: Maybe<Array<Permission>>;
	step?: Maybe<Scalars['Float']['output']>;
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type FloatStructFieldConfig = StructField & {
	__typename?: 'FloatStructFieldConfig';
	description?: Maybe<Array<LocalizedString>>;
	label?: Maybe<Array<LocalizedString>>;
	list: Scalars['Boolean']['output'];
	max?: Maybe<Scalars['Float']['output']>;
	min?: Maybe<Scalars['Float']['output']>;
	name: Scalars['String']['output'];
	step?: Maybe<Scalars['Float']['output']>;
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type FontMenu = Node & {
	__typename?: 'FontMenu';
	additiveFontId: Scalars['String']['output'];
	createdAt: Scalars['DateTime']['output'];
	id: Scalars['ID']['output'];
	/** 		If true, it will be shown in the selector but not selectable		 */
	isDisabled: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	subtractiveFontId: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type Fulfillment = Node & {
	__typename?: 'Fulfillment';
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<FulfillmentCustomFields>;
	id: Scalars['ID']['output'];
	lines: Array<FulfillmentLine>;
	method: Scalars['String']['output'];
	state: Scalars['String']['output'];
	/** @deprecated Use the `lines` field instead */
	summary: Array<FulfillmentLine>;
	trackingCode?: Maybe<Scalars['String']['output']>;
	updatedAt: Scalars['DateTime']['output'];
};

export type FulfillmentCustomFields = {
	__typename?: 'FulfillmentCustomFields';
	trackingUrl?: Maybe<Scalars['String']['output']>;
};

export type FulfillmentLine = {
	__typename?: 'FulfillmentLine';
	fulfillment: Fulfillment;
	fulfillmentId: Scalars['ID']['output'];
	orderLine: OrderLine;
	orderLineId: Scalars['ID']['output'];
	quantity: Scalars['Int']['output'];
};

export type GetPurchasedVariantForReviewError = ErrorResult & {
	__typename?: 'GetPurchasedVariantForReviewError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

export type GetPurchasedVariantForReviewResult =
	| GetPurchasedVariantForReviewError
	| PurchasedVariantWithReviewStatusList;

export const GlobalFlag = {
	False: 'FALSE',
	Inherit: 'INHERIT',
	True: 'TRUE',
} as const;

export type GlobalFlag = (typeof GlobalFlag)[keyof typeof GlobalFlag];
/** Returned when attempting to set the Customer on a guest checkout when the configured GuestCheckoutStrategy does not allow it. */
export type GuestCheckoutError = ErrorResult & {
	__typename?: 'GuestCheckoutError';
	errorCode: ErrorCode;
	errorDetail: Scalars['String']['output'];
	message: Scalars['String']['output'];
};

export type HistoryEntry = Node & {
	__typename?: 'HistoryEntry';
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	data: Scalars['JSON']['output'];
	id: Scalars['ID']['output'];
	type: HistoryEntryType;
	updatedAt: Scalars['DateTime']['output'];
};

export type HistoryEntryFilterParameter = {
	_and?: InputMaybe<Array<HistoryEntryFilterParameter>>;
	_or?: InputMaybe<Array<HistoryEntryFilterParameter>>;
	createdAt?: InputMaybe<DateOperators>;
	id?: InputMaybe<IdOperators>;
	type?: InputMaybe<StringOperators>;
	updatedAt?: InputMaybe<DateOperators>;
};

export type HistoryEntryList = PaginatedList & {
	__typename?: 'HistoryEntryList';
	items: Array<HistoryEntry>;
	totalItems: Scalars['Int']['output'];
};

export type HistoryEntryListOptions = {
	/** Allows the results to be filtered */
	filter?: InputMaybe<HistoryEntryFilterParameter>;
	/** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
	filterOperator?: InputMaybe<LogicalOperator>;
	/** Skips the first n results, for use in pagination */
	skip?: InputMaybe<Scalars['Int']['input']>;
	/** Specifies which properties to sort the results by */
	sort?: InputMaybe<HistoryEntrySortParameter>;
	/** Takes n results, for use in pagination */
	take?: InputMaybe<Scalars['Int']['input']>;
};

export type HistoryEntrySortParameter = {
	createdAt?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export const HistoryEntryType = {
	CustomerAddedToGroup: 'CUSTOMER_ADDED_TO_GROUP',
	CustomerAddressCreated: 'CUSTOMER_ADDRESS_CREATED',
	CustomerAddressDeleted: 'CUSTOMER_ADDRESS_DELETED',
	CustomerAddressUpdated: 'CUSTOMER_ADDRESS_UPDATED',
	CustomerDetailUpdated: 'CUSTOMER_DETAIL_UPDATED',
	CustomerEmailUpdateRequested: 'CUSTOMER_EMAIL_UPDATE_REQUESTED',
	CustomerEmailUpdateVerified: 'CUSTOMER_EMAIL_UPDATE_VERIFIED',
	CustomerNote: 'CUSTOMER_NOTE',
	CustomerPasswordResetRequested: 'CUSTOMER_PASSWORD_RESET_REQUESTED',
	CustomerPasswordResetVerified: 'CUSTOMER_PASSWORD_RESET_VERIFIED',
	CustomerPasswordUpdated: 'CUSTOMER_PASSWORD_UPDATED',
	CustomerRegistered: 'CUSTOMER_REGISTERED',
	CustomerRemovedFromGroup: 'CUSTOMER_REMOVED_FROM_GROUP',
	CustomerVerified: 'CUSTOMER_VERIFIED',
	OrderCancellation: 'ORDER_CANCELLATION',
	OrderCouponApplied: 'ORDER_COUPON_APPLIED',
	OrderCouponRemoved: 'ORDER_COUPON_REMOVED',
	OrderCustomerUpdated: 'ORDER_CUSTOMER_UPDATED',
	OrderFulfillment: 'ORDER_FULFILLMENT',
	OrderFulfillmentTransition: 'ORDER_FULFILLMENT_TRANSITION',
	OrderModified: 'ORDER_MODIFIED',
	OrderNote: 'ORDER_NOTE',
	OrderPaymentTransition: 'ORDER_PAYMENT_TRANSITION',
	OrderRefundTransition: 'ORDER_REFUND_TRANSITION',
	OrderStateTransition: 'ORDER_STATE_TRANSITION',
} as const;

export type HistoryEntryType = (typeof HistoryEntryType)[keyof typeof HistoryEntryType];
/** Operators for filtering on a list of ID fields */
export type IdListOperators = {
	inList: Scalars['ID']['input'];
};

/** Operators for filtering on an ID field */
export type IdOperators = {
	eq?: InputMaybe<Scalars['String']['input']>;
	in?: InputMaybe<Array<Scalars['String']['input']>>;
	isNull?: InputMaybe<Scalars['Boolean']['input']>;
	notEq?: InputMaybe<Scalars['String']['input']>;
	notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

/**
 * Returned if the token used to change a Customer's email address is valid, but has
 * expired according to the `verificationTokenDuration` setting in the AuthOptions.
 */
export type IdentifierChangeTokenExpiredError = ErrorResult & {
	__typename?: 'IdentifierChangeTokenExpiredError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

/**
 * Returned if the token used to change a Customer's email address is either
 * invalid or does not match any expected tokens.
 */
export type IdentifierChangeTokenInvalidError = ErrorResult & {
	__typename?: 'IdentifierChangeTokenInvalidError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

/** Returned when attempting to add a Payment using a PaymentMethod for which the Order is not eligible. */
export type IneligiblePaymentMethodError = ErrorResult & {
	__typename?: 'IneligiblePaymentMethodError';
	eligibilityCheckerMessage?: Maybe<Scalars['String']['output']>;
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

/** Returned when attempting to set a ShippingMethod for which the Order is not eligible */
export type IneligibleShippingMethodError = ErrorResult & {
	__typename?: 'IneligibleShippingMethodError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

/** Returned when attempting to add more items to the Order than are available */
export type InsufficientStockError = ErrorResult & {
	__typename?: 'InsufficientStockError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
	order: Order;
	quantityAvailable: Scalars['Int']['output'];
};

export type IntCustomFieldConfig = CustomField & {
	__typename?: 'IntCustomFieldConfig';
	deprecated?: Maybe<Scalars['Boolean']['output']>;
	deprecationReason?: Maybe<Scalars['String']['output']>;
	description?: Maybe<Array<LocalizedString>>;
	internal?: Maybe<Scalars['Boolean']['output']>;
	label?: Maybe<Array<LocalizedString>>;
	list: Scalars['Boolean']['output'];
	max?: Maybe<Scalars['Int']['output']>;
	min?: Maybe<Scalars['Int']['output']>;
	name: Scalars['String']['output'];
	nullable?: Maybe<Scalars['Boolean']['output']>;
	readonly?: Maybe<Scalars['Boolean']['output']>;
	requiresPermission?: Maybe<Array<Permission>>;
	step?: Maybe<Scalars['Int']['output']>;
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type IntStructFieldConfig = StructField & {
	__typename?: 'IntStructFieldConfig';
	description?: Maybe<Array<LocalizedString>>;
	label?: Maybe<Array<LocalizedString>>;
	list: Scalars['Boolean']['output'];
	max?: Maybe<Scalars['Int']['output']>;
	min?: Maybe<Scalars['Int']['output']>;
	name: Scalars['String']['output'];
	step?: Maybe<Scalars['Int']['output']>;
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

/** Returned if the user authentication credentials are not valid */
export type InvalidCredentialsError = ErrorResult & {
	__typename?: 'InvalidCredentialsError';
	authenticationError: Scalars['String']['output'];
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

export type IsReviewAllowedResult =
	| GetPurchasedVariantForReviewError
	| PurchasedVariantWithReviewStatus;

/**
 * @description
 * Languages in the form of a ISO 639-1 language code with optional
 * region or script modifier (e.g. de_AT). The selection available is based
 * on the [Unicode CLDR summary list](https://unicode-org.github.io/cldr-staging/charts/37/summary/root.html)
 * and includes the major spoken languages of the world and any widely-used variants.
 *
 * @docsCategory common
 */
export const LanguageCode = {
	/** Afrikaans */
	Af: 'af',
	/** Akan */
	Ak: 'ak',
	/** Amharic */
	Am: 'am',
	/** Arabic */
	Ar: 'ar',
	/** Assamese */
	As: 'as',
	/** Azerbaijani */
	Az: 'az',
	/** Belarusian */
	Be: 'be',
	/** Bulgarian */
	Bg: 'bg',
	/** Bambara */
	Bm: 'bm',
	/** Bangla */
	Bn: 'bn',
	/** Tibetan */
	Bo: 'bo',
	/** Breton */
	Br: 'br',
	/** Bosnian */
	Bs: 'bs',
	/** Catalan */
	Ca: 'ca',
	/** Chechen */
	Ce: 'ce',
	/** Corsican */
	Co: 'co',
	/** Czech */
	Cs: 'cs',
	/** Church Slavic */
	Cu: 'cu',
	/** Welsh */
	Cy: 'cy',
	/** Danish */
	Da: 'da',
	/** German */
	De: 'de',
	/** Austrian German */
	DeAt: 'de_AT',
	/** Swiss High German */
	DeCh: 'de_CH',
	/** Dzongkha */
	Dz: 'dz',
	/** Ewe */
	Ee: 'ee',
	/** Greek */
	El: 'el',
	/** English */
	En: 'en',
	/** Australian English */
	EnAu: 'en_AU',
	/** Canadian English */
	EnCa: 'en_CA',
	/** British English */
	EnGb: 'en_GB',
	/** American English */
	EnUs: 'en_US',
	/** Esperanto */
	Eo: 'eo',
	/** Spanish */
	Es: 'es',
	/** European Spanish */
	EsEs: 'es_ES',
	/** Mexican Spanish */
	EsMx: 'es_MX',
	/** Estonian */
	Et: 'et',
	/** Basque */
	Eu: 'eu',
	/** Persian */
	Fa: 'fa',
	/** Dari */
	FaAf: 'fa_AF',
	/** Fulah */
	Ff: 'ff',
	/** Finnish */
	Fi: 'fi',
	/** Faroese */
	Fo: 'fo',
	/** French */
	Fr: 'fr',
	/** Canadian French */
	FrCa: 'fr_CA',
	/** Swiss French */
	FrCh: 'fr_CH',
	/** Western Frisian */
	Fy: 'fy',
	/** Irish */
	Ga: 'ga',
	/** Scottish Gaelic */
	Gd: 'gd',
	/** Galician */
	Gl: 'gl',
	/** Gujarati */
	Gu: 'gu',
	/** Manx */
	Gv: 'gv',
	/** Hausa */
	Ha: 'ha',
	/** Hebrew */
	He: 'he',
	/** Hindi */
	Hi: 'hi',
	/** Croatian */
	Hr: 'hr',
	/** Haitian Creole */
	Ht: 'ht',
	/** Hungarian */
	Hu: 'hu',
	/** Armenian */
	Hy: 'hy',
	/** Interlingua */
	Ia: 'ia',
	/** Indonesian */
	Id: 'id',
	/** Igbo */
	Ig: 'ig',
	/** Sichuan Yi */
	Ii: 'ii',
	/** Icelandic */
	Is: 'is',
	/** Italian */
	It: 'it',
	/** Japanese */
	Ja: 'ja',
	/** Javanese */
	Jv: 'jv',
	/** Georgian */
	Ka: 'ka',
	/** Kikuyu */
	Ki: 'ki',
	/** Kazakh */
	Kk: 'kk',
	/** Kalaallisut */
	Kl: 'kl',
	/** Khmer */
	Km: 'km',
	/** Kannada */
	Kn: 'kn',
	/** Korean */
	Ko: 'ko',
	/** Kashmiri */
	Ks: 'ks',
	/** Kurdish */
	Ku: 'ku',
	/** Cornish */
	Kw: 'kw',
	/** Kyrgyz */
	Ky: 'ky',
	/** Latin */
	La: 'la',
	/** Luxembourgish */
	Lb: 'lb',
	/** Ganda */
	Lg: 'lg',
	/** Lingala */
	Ln: 'ln',
	/** Lao */
	Lo: 'lo',
	/** Lithuanian */
	Lt: 'lt',
	/** Luba-Katanga */
	Lu: 'lu',
	/** Latvian */
	Lv: 'lv',
	/** Malagasy */
	Mg: 'mg',
	/** Maori */
	Mi: 'mi',
	/** Macedonian */
	Mk: 'mk',
	/** Malayalam */
	Ml: 'ml',
	/** Mongolian */
	Mn: 'mn',
	/** Marathi */
	Mr: 'mr',
	/** Malay */
	Ms: 'ms',
	/** Maltese */
	Mt: 'mt',
	/** Burmese */
	My: 'my',
	/** Norwegian Bokmål */
	Nb: 'nb',
	/** North Ndebele */
	Nd: 'nd',
	/** Nepali */
	Ne: 'ne',
	/** Dutch */
	Nl: 'nl',
	/** Flemish */
	NlBe: 'nl_BE',
	/** Norwegian Nynorsk */
	Nn: 'nn',
	/** Nyanja */
	Ny: 'ny',
	/** Oromo */
	Om: 'om',
	/** Odia */
	Or: 'or',
	/** Ossetic */
	Os: 'os',
	/** Punjabi */
	Pa: 'pa',
	/** Polish */
	Pl: 'pl',
	/** Pashto */
	Ps: 'ps',
	/** Portuguese */
	Pt: 'pt',
	/** Brazilian Portuguese */
	PtBr: 'pt_BR',
	/** European Portuguese */
	PtPt: 'pt_PT',
	/** Quechua */
	Qu: 'qu',
	/** Romansh */
	Rm: 'rm',
	/** Rundi */
	Rn: 'rn',
	/** Romanian */
	Ro: 'ro',
	/** Moldavian */
	RoMd: 'ro_MD',
	/** Russian */
	Ru: 'ru',
	/** Kinyarwanda */
	Rw: 'rw',
	/** Sanskrit */
	Sa: 'sa',
	/** Sindhi */
	Sd: 'sd',
	/** Northern Sami */
	Se: 'se',
	/** Sango */
	Sg: 'sg',
	/** Sinhala */
	Si: 'si',
	/** Slovak */
	Sk: 'sk',
	/** Slovenian */
	Sl: 'sl',
	/** Samoan */
	Sm: 'sm',
	/** Shona */
	Sn: 'sn',
	/** Somali */
	So: 'so',
	/** Albanian */
	Sq: 'sq',
	/** Serbian */
	Sr: 'sr',
	/** Southern Sotho */
	St: 'st',
	/** Sundanese */
	Su: 'su',
	/** Swedish */
	Sv: 'sv',
	/** Swahili */
	Sw: 'sw',
	/** Congo Swahili */
	SwCd: 'sw_CD',
	/** Tamil */
	Ta: 'ta',
	/** Telugu */
	Te: 'te',
	/** Tajik */
	Tg: 'tg',
	/** Thai */
	Th: 'th',
	/** Tigrinya */
	Ti: 'ti',
	/** Turkmen */
	Tk: 'tk',
	/** Tongan */
	To: 'to',
	/** Turkish */
	Tr: 'tr',
	/** Tatar */
	Tt: 'tt',
	/** Uyghur */
	Ug: 'ug',
	/** Ukrainian */
	Uk: 'uk',
	/** Urdu */
	Ur: 'ur',
	/** Uzbek */
	Uz: 'uz',
	/** Vietnamese */
	Vi: 'vi',
	/** Volapük */
	Vo: 'vo',
	/** Wolof */
	Wo: 'wo',
	/** Xhosa */
	Xh: 'xh',
	/** Yiddish */
	Yi: 'yi',
	/** Yoruba */
	Yo: 'yo',
	/** Chinese */
	Zh: 'zh',
	/** Simplified Chinese */
	ZhHans: 'zh_Hans',
	/** Traditional Chinese */
	ZhHant: 'zh_Hant',
	/** Zulu */
	Zu: 'zu',
} as const;

export type LanguageCode = (typeof LanguageCode)[keyof typeof LanguageCode];
export type LocaleStringCustomFieldConfig = CustomField & {
	__typename?: 'LocaleStringCustomFieldConfig';
	deprecated?: Maybe<Scalars['Boolean']['output']>;
	deprecationReason?: Maybe<Scalars['String']['output']>;
	description?: Maybe<Array<LocalizedString>>;
	internal?: Maybe<Scalars['Boolean']['output']>;
	label?: Maybe<Array<LocalizedString>>;
	length?: Maybe<Scalars['Int']['output']>;
	list: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	nullable?: Maybe<Scalars['Boolean']['output']>;
	pattern?: Maybe<Scalars['String']['output']>;
	readonly?: Maybe<Scalars['Boolean']['output']>;
	requiresPermission?: Maybe<Array<Permission>>;
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type LocaleTextCustomFieldConfig = CustomField & {
	__typename?: 'LocaleTextCustomFieldConfig';
	deprecated?: Maybe<Scalars['Boolean']['output']>;
	deprecationReason?: Maybe<Scalars['String']['output']>;
	description?: Maybe<Array<LocalizedString>>;
	internal?: Maybe<Scalars['Boolean']['output']>;
	label?: Maybe<Array<LocalizedString>>;
	list: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	nullable?: Maybe<Scalars['Boolean']['output']>;
	readonly?: Maybe<Scalars['Boolean']['output']>;
	requiresPermission?: Maybe<Array<Permission>>;
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type LocalizedString = {
	__typename?: 'LocalizedString';
	languageCode: LanguageCode;
	value: Scalars['String']['output'];
};

export const LogicalOperator = {
	And: 'AND',
	Or: 'OR',
} as const;

export type LogicalOperator = (typeof LogicalOperator)[keyof typeof LogicalOperator];
/** Returned when attempting to register or verify a customer account without a password, when one is required. */
export type MissingPasswordError = ErrorResult & {
	__typename?: 'MissingPasswordError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

export type Mutation = {
	__typename?: 'Mutation';
	/** Adds an item to the Order. If custom fields are defined on the OrderLine entity, a third argument 'customFields' will be available. */
	addItemToOrder: UpdateOrderItemsResult;
	/** Adds mutliple items to the Order. Returns a list of errors for each item that failed to add. It will still add successful items. */
	addItemsToOrder: UpdateMultipleOrderItemsResult;
	/** Add a Payment to the Order */
	addPaymentToOrder: AddPaymentToOrderResult;
	/** Adjusts an OrderLine. If custom fields are defined on the OrderLine entity, a third argument 'customFields' of type `OrderLineCustomFieldsInput` will be available. */
	adjustOrderLine: UpdateOrderItemsResult;
	/** Applies the given coupon code to the active Order */
	applyCouponCode: ApplyCouponCodeResult;
	/** Authenticates the user using a named authentication strategy */
	authenticate: AuthenticationResult;
	batchAddCustomizedImagesToOrder: BatchAddCustomizedImagesToOrderResult;
	/**
	 * Batch update fulfillment state from Shippo. This
	 * updates all fulfillments with method 'Shippo' and state 'Pending' or 'Shipped'.
	 * (i.e. fulfillments created by Shippo and not yet delivered)
	 */
	batchUpdateShippoFulfillmentState: UpdateFulfillmentStateResult;
	/** Create a new Customer Address */
	createCustomerAddress: Address;
	createStripePaymentIntent?: Maybe<Scalars['String']['output']>;
	/** Delete an existing Address */
	deleteCustomerAddress: Success;
	/**
	 * Authenticates the user using the native authentication strategy. This mutation is an alias for authenticate({ native: { ... }})
	 *
	 * The `rememberMe` option applies when using cookie-based sessions, and if `true` it will set the maxAge of the session cookie
	 * to 1 year.
	 */
	login: NativeAuthenticationResult;
	/** End the current authenticated session */
	logout: Success;
	/** Regenerate and send a verification token for a new Customer registration. Only applicable if `authOptions.requireVerification` is set to true. */
	refreshCustomerVerification: RefreshCustomerVerificationResult;
	/**
	 * Register a Customer account with the given credentials. There are three possible registration flows:
	 *
	 * _If `authOptions.requireVerification` is set to `true`:_
	 *
	 * 1. **The Customer is registered _with_ a password**. A verificationToken will be created (and typically emailed to the Customer). That
	 *    verificationToken would then be passed to the `verifyCustomerAccount` mutation _without_ a password. The Customer is then
	 *    verified and authenticated in one step.
	 * 2. **The Customer is registered _without_ a password**. A verificationToken will be created (and typically emailed to the Customer). That
	 *    verificationToken would then be passed to the `verifyCustomerAccount` mutation _with_ the chosen password of the Customer. The Customer is then
	 *    verified and authenticated in one step.
	 *
	 * _If `authOptions.requireVerification` is set to `false`:_
	 *
	 * 3. The Customer _must_ be registered _with_ a password. No further action is needed - the Customer is able to authenticate immediately.
	 */
	registerCustomerAccount: RegisterCustomerAccountResult;
	/** Remove all OrderLine from the Order */
	removeAllOrderLines: RemoveOrderItemsResult;
	/** Removes the given coupon code from the active Order */
	removeCouponCode?: Maybe<Order>;
	/** Remove an OrderLine from the Order */
	removeOrderLine: RemoveOrderItemsResult;
	/** Requests a password reset email to be sent */
	requestPasswordReset?: Maybe<RequestPasswordResetResult>;
	/**
	 * Request to update the emailAddress of the active Customer. If `authOptions.requireVerification` is enabled
	 * (as is the default), then the `identifierChangeToken` will be assigned to the current User and
	 * a IdentifierChangeRequestEvent will be raised. This can then be used e.g. by the EmailPlugin to email
	 * that verification token to the Customer, which is then used to verify the change of email address.
	 */
	requestUpdateCustomerEmailAddress: RequestUpdateCustomerEmailAddressResult;
	/** Resets a Customer's password based on the provided token */
	resetPassword: ResetPasswordResult;
	/** Set the Customer for the Order. Required only if the Customer is not currently logged in */
	setCustomerForOrder: SetCustomerForOrderResult;
	/** Sets the billing address for the active Order */
	setOrderBillingAddress: ActiveOrderResult;
	/** Allows any custom fields to be set for the active Order */
	setOrderCustomFields: ActiveOrderResult;
	/** Sets the shipping address for the active Order */
	setOrderShippingAddress: ActiveOrderResult;
	/**
	 * Sets the shipping method by id, which can be obtained with the `eligibleShippingMethods` query.
	 * An Order can have multiple shipping methods, in which case you can pass an array of ids. In this case,
	 * you should configure a custom ShippingLineAssignmentStrategy in order to know which OrderLines each
	 * shipping method will apply to.
	 */
	setOrderShippingMethod: SetOrderShippingMethodResult;
	/**
	 * Submit a product review for a purchased product variant
	 * Note that this won't check whether the customer is allowed to review the product variant.
	 * For that, please use the 'isReviewAllowed' query first.
	 */
	submitProductReview: SubmitProductReviewResult;
	/** Transitions an Order to a new state. Valid next states can be found by querying `nextOrderStates` */
	transitionOrderToState?: Maybe<TransitionOrderToStateResult>;
	/** Unsets the billing address for the active Order. Available since version 3.1.0 */
	unsetOrderBillingAddress: ActiveOrderResult;
	/** Unsets the shipping address for the active Order. Available since version 3.1.0 */
	unsetOrderShippingAddress: ActiveOrderResult;
	/** Update an existing Customer */
	updateCustomer: Customer;
	/** Update an existing Address */
	updateCustomerAddress: Address;
	/**
	 * Confirm the update of the emailAddress with the provided token, which has been generated by the
	 * `requestUpdateCustomerEmailAddress` mutation.
	 */
	updateCustomerEmailAddress: UpdateCustomerEmailAddressResult;
	/** Update the password of the active Customer */
	updateCustomerPassword: UpdateCustomerPasswordResult;
	/**
	 * Verify a Customer email address with the token sent to that address. Only applicable if `authOptions.requireVerification` is set to true.
	 *
	 * If the Customer was not registered with a password in the `registerCustomerAccount` mutation, the password _must_ be
	 * provided here.
	 */
	verifyCustomerAccount: VerifyCustomerAccountResult;
	/**
	 * Upvote or remove upvote from a product review
	 *
	 * If vote is true, it means upvote; if false, it means remove previous upvote.
	 * If the customer has already upvoted the review, and vote is true again, it will throw an error.
	 * If the customer has not upvoted the review, and vote is false (revert the upvote), it will throw an error.
	 */
	voteOnReview: VoteOnReviewResult;
};

export type MutationAddItemToOrderArgs = {
	customFields?: InputMaybe<OrderLineCustomFieldsInput>;
	productVariantId: Scalars['ID']['input'];
	quantity: Scalars['Int']['input'];
};

export type MutationAddItemsToOrderArgs = {
	inputs: Array<AddItemInput>;
};

export type MutationAddPaymentToOrderArgs = {
	input: PaymentInput;
};

export type MutationAdjustOrderLineArgs = {
	customFields?: InputMaybe<OrderLineCustomFieldsInput>;
	orderLineId: Scalars['ID']['input'];
	quantity: Scalars['Int']['input'];
};

export type MutationApplyCouponCodeArgs = {
	couponCode: Scalars['String']['input'];
};

export type MutationAuthenticateArgs = {
	input: AuthenticationInput;
	rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MutationBatchAddCustomizedImagesToOrderArgs = {
	files: Array<Scalars['Upload']['input']>;
	orderLineIds: Array<Scalars['ID']['input']>;
};

export type MutationCreateCustomerAddressArgs = {
	input: CreateAddressInput;
};

export type MutationDeleteCustomerAddressArgs = {
	id: Scalars['ID']['input'];
};

export type MutationLoginArgs = {
	password: Scalars['String']['input'];
	rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
	username: Scalars['String']['input'];
};

export type MutationRefreshCustomerVerificationArgs = {
	emailAddress: Scalars['String']['input'];
};

export type MutationRegisterCustomerAccountArgs = {
	input: RegisterCustomerInput;
};

export type MutationRemoveCouponCodeArgs = {
	couponCode: Scalars['String']['input'];
};

export type MutationRemoveOrderLineArgs = {
	orderLineId: Scalars['ID']['input'];
};

export type MutationRequestPasswordResetArgs = {
	emailAddress: Scalars['String']['input'];
};

export type MutationRequestUpdateCustomerEmailAddressArgs = {
	newEmailAddress: Scalars['String']['input'];
	password: Scalars['String']['input'];
};

export type MutationResetPasswordArgs = {
	password: Scalars['String']['input'];
	token: Scalars['String']['input'];
};

export type MutationSetCustomerForOrderArgs = {
	input: CreateCustomerInput;
};

export type MutationSetOrderBillingAddressArgs = {
	input: CreateAddressInput;
};

export type MutationSetOrderCustomFieldsArgs = {
	input: UpdateOrderInput;
};

export type MutationSetOrderShippingAddressArgs = {
	input: CreateAddressInput;
};

export type MutationSetOrderShippingMethodArgs = {
	shippingMethodId: Array<Scalars['ID']['input']>;
};

export type MutationSubmitProductReviewArgs = {
	input: SubmitProductReviewInput;
};

export type MutationTransitionOrderToStateArgs = {
	state: Scalars['String']['input'];
};

export type MutationUpdateCustomerArgs = {
	input: UpdateCustomerInput;
};

export type MutationUpdateCustomerAddressArgs = {
	input: UpdateAddressInput;
};

export type MutationUpdateCustomerEmailAddressArgs = {
	token: Scalars['String']['input'];
};

export type MutationUpdateCustomerPasswordArgs = {
	currentPassword: Scalars['String']['input'];
	newPassword: Scalars['String']['input'];
};

export type MutationVerifyCustomerAccountArgs = {
	password?: InputMaybe<Scalars['String']['input']>;
	token: Scalars['String']['input'];
};

export type MutationVoteOnReviewArgs = {
	id: Scalars['ID']['input'];
	vote: Scalars['Boolean']['input'];
};

export type NativeAuthInput = {
	password: Scalars['String']['input'];
	username: Scalars['String']['input'];
};

/** Returned when attempting an operation that relies on the NativeAuthStrategy, if that strategy is not configured. */
export type NativeAuthStrategyError = ErrorResult & {
	__typename?: 'NativeAuthStrategyError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

export type NativeAuthenticationResult =
	| CurrentUser
	| InvalidCredentialsError
	| NativeAuthStrategyError
	| NotVerifiedError;

/** Returned when attempting to set a negative OrderLine quantity. */
export type NegativeQuantityError = ErrorResult & {
	__typename?: 'NegativeQuantityError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

/**
 * Returned when invoking a mutation which depends on there being an active Order on the
 * current session.
 */
export type NoActiveOrderError = ErrorResult & {
	__typename?: 'NoActiveOrderError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

export type Node = {
	id: Scalars['ID']['output'];
};

/**
 * Returned if `authOptions.requireVerification` is set to `true` (which is the default)
 * and an unverified user attempts to authenticate.
 */
export type NotVerifiedError = ErrorResult & {
	__typename?: 'NotVerifiedError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

/** Operators for filtering on a list of Number fields */
export type NumberListOperators = {
	inList: Scalars['Float']['input'];
};

/** Operators for filtering on a Int or Float field */
export type NumberOperators = {
	between?: InputMaybe<NumberRange>;
	eq?: InputMaybe<Scalars['Float']['input']>;
	gt?: InputMaybe<Scalars['Float']['input']>;
	gte?: InputMaybe<Scalars['Float']['input']>;
	isNull?: InputMaybe<Scalars['Boolean']['input']>;
	lt?: InputMaybe<Scalars['Float']['input']>;
	lte?: InputMaybe<Scalars['Float']['input']>;
};

export type NumberRange = {
	end: Scalars['Float']['input'];
	start: Scalars['Float']['input'];
};

export type Order = Node & {
	__typename?: 'Order';
	/** An order is active as long as the payment process has not been completed */
	active: Scalars['Boolean']['output'];
	billingAddress?: Maybe<OrderAddress>;
	/** A unique code for the Order */
	code: Scalars['String']['output'];
	/** An array of all coupon codes applied to the Order */
	couponCodes: Array<Scalars['String']['output']>;
	createdAt: Scalars['DateTime']['output'];
	currencyCode: CurrencyCode;
	customFields?: Maybe<OrderCustomFields>;
	customer?: Maybe<Customer>;
	discounts: Array<Discount>;
	fulfillments?: Maybe<Array<Fulfillment>>;
	history: HistoryEntryList;
	id: Scalars['ID']['output'];
	lines: Array<OrderLine>;
	/**
	 * The date & time that the Order was placed, i.e. the Customer
	 * completed the checkout and the Order is no longer "active"
	 */
	orderPlacedAt?: Maybe<Scalars['DateTime']['output']>;
	payments?: Maybe<Array<Payment>>;
	/** Promotions applied to the order. Only gets populated after the payment process has completed. */
	promotions: Array<Promotion>;
	shipping: Scalars['Money']['output'];
	shippingAddress?: Maybe<OrderAddress>;
	shippingLines: Array<ShippingLine>;
	shippingWithTax: Scalars['Money']['output'];
	state: Scalars['String']['output'];
	/**
	 * The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level
	 * discounts which have been prorated (proportionally distributed) amongst the items of each OrderLine.
	 * To get a total of all OrderLines which does not account for prorated discounts, use the
	 * sum of `OrderLine.discountedLinePrice` values.
	 */
	subTotal: Scalars['Money']['output'];
	/** Same as subTotal, but inclusive of tax */
	subTotalWithTax: Scalars['Money']['output'];
	/**
	 * Surcharges are arbitrary modifications to the Order total which are neither
	 * ProductVariants nor discounts resulting from applied Promotions. For example,
	 * one-off discounts based on customer interaction, or surcharges based on payment
	 * methods.
	 */
	surcharges: Array<Surcharge>;
	/** A summary of the taxes being applied to this Order */
	taxSummary: Array<OrderTaxSummary>;
	/** Equal to subTotal plus shipping */
	total: Scalars['Money']['output'];
	totalQuantity: Scalars['Int']['output'];
	/** The final payable amount. Equal to subTotalWithTax plus shippingWithTax */
	totalWithTax: Scalars['Money']['output'];
	type: OrderType;
	updatedAt: Scalars['DateTime']['output'];
};

export type OrderHistoryArgs = {
	options?: InputMaybe<HistoryEntryListOptions>;
};

export type OrderAddress = {
	__typename?: 'OrderAddress';
	city?: Maybe<Scalars['String']['output']>;
	company?: Maybe<Scalars['String']['output']>;
	country?: Maybe<Scalars['String']['output']>;
	countryCode?: Maybe<Scalars['String']['output']>;
	customFields?: Maybe<Scalars['JSON']['output']>;
	fullName?: Maybe<Scalars['String']['output']>;
	phoneNumber?: Maybe<Scalars['String']['output']>;
	postalCode?: Maybe<Scalars['String']['output']>;
	province?: Maybe<Scalars['String']['output']>;
	streetLine1?: Maybe<Scalars['String']['output']>;
	streetLine2?: Maybe<Scalars['String']['output']>;
};

export type OrderCustomFields = {
	__typename?: 'OrderCustomFields';
	promisedArrivalDays?: Maybe<Scalars['Int']['output']>;
};

export type OrderFilterParameter = {
	_and?: InputMaybe<Array<OrderFilterParameter>>;
	_or?: InputMaybe<Array<OrderFilterParameter>>;
	active?: InputMaybe<BooleanOperators>;
	code?: InputMaybe<StringOperators>;
	createdAt?: InputMaybe<DateOperators>;
	currencyCode?: InputMaybe<StringOperators>;
	id?: InputMaybe<IdOperators>;
	orderPlacedAt?: InputMaybe<DateOperators>;
	promisedArrivalDays?: InputMaybe<NumberOperators>;
	shipping?: InputMaybe<NumberOperators>;
	shippingWithTax?: InputMaybe<NumberOperators>;
	state?: InputMaybe<StringOperators>;
	subTotal?: InputMaybe<NumberOperators>;
	subTotalWithTax?: InputMaybe<NumberOperators>;
	total?: InputMaybe<NumberOperators>;
	totalQuantity?: InputMaybe<NumberOperators>;
	totalWithTax?: InputMaybe<NumberOperators>;
	type?: InputMaybe<StringOperators>;
	updatedAt?: InputMaybe<DateOperators>;
};

/** Returned when an order operation is rejected by an OrderInterceptor method. */
export type OrderInterceptorError = ErrorResult & {
	__typename?: 'OrderInterceptorError';
	errorCode: ErrorCode;
	interceptorError: Scalars['String']['output'];
	message: Scalars['String']['output'];
};

/** Returned when the maximum order size limit has been reached. */
export type OrderLimitError = ErrorResult & {
	__typename?: 'OrderLimitError';
	errorCode: ErrorCode;
	maxItems: Scalars['Int']['output'];
	message: Scalars['String']['output'];
};

export type OrderLine = Node & {
	__typename?: 'OrderLine';
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<OrderLineCustomFields>;
	/** The price of the line including discounts, excluding tax */
	discountedLinePrice: Scalars['Money']['output'];
	/** The price of the line including discounts and tax */
	discountedLinePriceWithTax: Scalars['Money']['output'];
	/**
	 * The price of a single unit including discounts, excluding tax.
	 *
	 * If Order-level discounts have been applied, this will not be the
	 * actual taxable unit price (see `proratedUnitPrice`), but is generally the
	 * correct price to display to customers to avoid confusion
	 * about the internal handling of distributed Order-level discounts.
	 */
	discountedUnitPrice: Scalars['Money']['output'];
	/** The price of a single unit including discounts and tax */
	discountedUnitPriceWithTax: Scalars['Money']['output'];
	discounts: Array<Discount>;
	featuredAsset?: Maybe<Asset>;
	fulfillmentLines?: Maybe<Array<FulfillmentLine>>;
	id: Scalars['ID']['output'];
	/** The total price of the line excluding tax and discounts. */
	linePrice: Scalars['Money']['output'];
	/** The total price of the line including tax but excluding discounts. */
	linePriceWithTax: Scalars['Money']['output'];
	/** The total tax on this line */
	lineTax: Scalars['Money']['output'];
	order: Order;
	/** The quantity at the time the Order was placed */
	orderPlacedQuantity: Scalars['Int']['output'];
	productVariant: ProductVariant;
	/**
	 * The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)
	 * Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax
	 * and refund calculations.
	 */
	proratedLinePrice: Scalars['Money']['output'];
	/** The proratedLinePrice including tax */
	proratedLinePriceWithTax: Scalars['Money']['output'];
	/**
	 * The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)
	 * Order-level discounts. This value is the true economic value of the OrderItem, and is used in tax
	 * and refund calculations.
	 */
	proratedUnitPrice: Scalars['Money']['output'];
	/** The proratedUnitPrice including tax */
	proratedUnitPriceWithTax: Scalars['Money']['output'];
	/** The quantity of items purchased */
	quantity: Scalars['Int']['output'];
	taxLines: Array<TaxLine>;
	taxRate: Scalars['Float']['output'];
	/** The price of a single unit, excluding tax and discounts */
	unitPrice: Scalars['Money']['output'];
	/** Non-zero if the unitPrice has changed since it was initially added to Order */
	unitPriceChangeSinceAdded: Scalars['Money']['output'];
	/** The price of a single unit, including tax but excluding discounts */
	unitPriceWithTax: Scalars['Money']['output'];
	/** Non-zero if the unitPriceWithTax has changed since it was initially added to Order */
	unitPriceWithTaxChangeSinceAdded: Scalars['Money']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type OrderLineCustomFields = {
	__typename?: 'OrderLineCustomFields';
	customizableOptionJson?: Maybe<Scalars['String']['output']>;
	customizedBuildState?: Maybe<Scalars['String']['output']>;
	customizedImageAsset?: Maybe<Asset>;
};

export type OrderLineCustomFieldsInput = {
	customizableOptionJson?: InputMaybe<Scalars['String']['input']>;
	customizedBuildState?: InputMaybe<Scalars['String']['input']>;
	customizedImageAssetId?: InputMaybe<Scalars['ID']['input']>;
};

export type OrderList = PaginatedList & {
	__typename?: 'OrderList';
	items: Array<Order>;
	totalItems: Scalars['Int']['output'];
};

export type OrderListOptions = {
	/** Allows the results to be filtered */
	filter?: InputMaybe<OrderFilterParameter>;
	/** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
	filterOperator?: InputMaybe<LogicalOperator>;
	/** Skips the first n results, for use in pagination */
	skip?: InputMaybe<Scalars['Int']['input']>;
	/** Specifies which properties to sort the results by */
	sort?: InputMaybe<OrderSortParameter>;
	/** Takes n results, for use in pagination */
	take?: InputMaybe<Scalars['Int']['input']>;
};

/** Returned when attempting to modify the contents of an Order that is not in the `AddingItems` state. */
export type OrderModificationError = ErrorResult & {
	__typename?: 'OrderModificationError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

/** Returned when attempting to add a Payment to an Order that is not in the `ArrangingPayment` state. */
export type OrderPaymentStateError = ErrorResult & {
	__typename?: 'OrderPaymentStateError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

export type OrderSortParameter = {
	code?: InputMaybe<SortOrder>;
	createdAt?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	orderPlacedAt?: InputMaybe<SortOrder>;
	promisedArrivalDays?: InputMaybe<SortOrder>;
	shipping?: InputMaybe<SortOrder>;
	shippingWithTax?: InputMaybe<SortOrder>;
	state?: InputMaybe<SortOrder>;
	subTotal?: InputMaybe<SortOrder>;
	subTotalWithTax?: InputMaybe<SortOrder>;
	total?: InputMaybe<SortOrder>;
	totalQuantity?: InputMaybe<SortOrder>;
	totalWithTax?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

/** Returned if there is an error in transitioning the Order state */
export type OrderStateTransitionError = ErrorResult & {
	__typename?: 'OrderStateTransitionError';
	errorCode: ErrorCode;
	fromState: Scalars['String']['output'];
	message: Scalars['String']['output'];
	toState: Scalars['String']['output'];
	transitionError: Scalars['String']['output'];
};

/**
 * A summary of the taxes being applied to this order, grouped
 * by taxRate.
 */
export type OrderTaxSummary = {
	__typename?: 'OrderTaxSummary';
	/** A description of this tax */
	description: Scalars['String']['output'];
	/** The total net price of OrderLines to which this taxRate applies */
	taxBase: Scalars['Money']['output'];
	/** The taxRate as a percentage */
	taxRate: Scalars['Float']['output'];
	/** The total tax being applied to the Order at this taxRate */
	taxTotal: Scalars['Money']['output'];
};

export const OrderType = {
	Aggregate: 'Aggregate',
	Regular: 'Regular',
	Seller: 'Seller',
} as const;

export type OrderType = (typeof OrderType)[keyof typeof OrderType];
export type PaginatedList = {
	items: Array<Node>;
	totalItems: Scalars['Int']['output'];
};

/** Returned when attempting to verify a customer account with a password, when a password has already been set. */
export type PasswordAlreadySetError = ErrorResult & {
	__typename?: 'PasswordAlreadySetError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

/**
 * Returned if the token used to reset a Customer's password is valid, but has
 * expired according to the `verificationTokenDuration` setting in the AuthOptions.
 */
export type PasswordResetTokenExpiredError = ErrorResult & {
	__typename?: 'PasswordResetTokenExpiredError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

/**
 * Returned if the token used to reset a Customer's password is either
 * invalid or does not match any expected tokens.
 */
export type PasswordResetTokenInvalidError = ErrorResult & {
	__typename?: 'PasswordResetTokenInvalidError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

/** Returned when attempting to register or verify a customer account where the given password fails password validation. */
export type PasswordValidationError = ErrorResult & {
	__typename?: 'PasswordValidationError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
	validationErrorMessage: Scalars['String']['output'];
};

export type Payment = Node & {
	__typename?: 'Payment';
	amount: Scalars['Money']['output'];
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	errorMessage?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	metadata?: Maybe<Scalars['JSON']['output']>;
	method: Scalars['String']['output'];
	refunds: Array<Refund>;
	state: Scalars['String']['output'];
	transactionId?: Maybe<Scalars['String']['output']>;
	updatedAt: Scalars['DateTime']['output'];
};

/** Returned when a Payment is declined by the payment provider. */
export type PaymentDeclinedError = ErrorResult & {
	__typename?: 'PaymentDeclinedError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
	paymentErrorMessage: Scalars['String']['output'];
};

/** Returned when a Payment fails due to an error. */
export type PaymentFailedError = ErrorResult & {
	__typename?: 'PaymentFailedError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
	paymentErrorMessage: Scalars['String']['output'];
};

/** Passed as input to the `addPaymentToOrder` mutation. */
export type PaymentInput = {
	/**
	 * This field should contain arbitrary data passed to the specified PaymentMethodHandler's `createPayment()` method
	 * as the "metadata" argument. For example, it could contain an ID for the payment and other
	 * data generated by the payment provider.
	 */
	metadata: Scalars['JSON']['input'];
	/** This field should correspond to the `code` property of a PaymentMethod. */
	method: Scalars['String']['input'];
};

export type PaymentMethod = Node & {
	__typename?: 'PaymentMethod';
	checker?: Maybe<ConfigurableOperation>;
	code: Scalars['String']['output'];
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	description: Scalars['String']['output'];
	enabled: Scalars['Boolean']['output'];
	handler: ConfigurableOperation;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	translations: Array<PaymentMethodTranslation>;
	updatedAt: Scalars['DateTime']['output'];
};

export type PaymentMethodQuote = {
	__typename?: 'PaymentMethodQuote';
	code: Scalars['String']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	description: Scalars['String']['output'];
	eligibilityMessage?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	isEligible: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
};

export type PaymentMethodTranslation = {
	__typename?: 'PaymentMethodTranslation';
	createdAt: Scalars['DateTime']['output'];
	description: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

/**
 * @description
 * Permissions for administrators and customers. Used to control access to
 * GraphQL resolvers via the {@link Allow} decorator.
 *
 * ## Understanding Permission.Owner
 *
 * `Permission.Owner` is a special permission which is used in some Vendure resolvers to indicate that that resolver should only
 * be accessible to the "owner" of that resource.
 *
 * For example, the Shop API `activeCustomer` query resolver should only return the Customer object for the "owner" of that Customer, i.e.
 * based on the activeUserId of the current session. As a result, the resolver code looks like this:
 *
 * @example
 * ```TypeScript
 * \@Query()
 * \@Allow(Permission.Owner)
 * async activeCustomer(\@Ctx() ctx: RequestContext): Promise<Customer | undefined> {
 *   const userId = ctx.activeUserId;
 *   if (userId) {
 *     return this.customerService.findOneByUserId(ctx, userId);
 *   }
 * }
 * ```
 *
 * Here we can see that the "ownership" must be enforced by custom logic inside the resolver. Since "ownership" cannot be defined generally
 * nor statically encoded at build-time, any resolvers using `Permission.Owner` **must** include logic to enforce that only the owner
 * of the resource has access. If not, then it is the equivalent of using `Permission.Public`.
 *
 *
 * @docsCategory common
 */
export const Permission = {
	/** Authenticated means simply that the user is logged in */
	Authenticated: 'Authenticated',
	/** Grants permission to create Administrator */
	CreateAdministrator: 'CreateAdministrator',
	/** Grants permission to create Asset */
	CreateAsset: 'CreateAsset',
	/** Grants permission to create Products, Facets, Assets, Collections */
	CreateCatalog: 'CreateCatalog',
	/** Grants permission to create Channel */
	CreateChannel: 'CreateChannel',
	/** Grants permission to create Collection */
	CreateCollection: 'CreateCollection',
	/** Grants permission to create Country */
	CreateCountry: 'CreateCountry',
	/** Grants permission to create Customer */
	CreateCustomer: 'CreateCustomer',
	/** Grants permission to create CustomerGroup */
	CreateCustomerGroup: 'CreateCustomerGroup',
	/** Grants permission to create Facet */
	CreateFacet: 'CreateFacet',
	/** Grants permission to create Order */
	CreateOrder: 'CreateOrder',
	/** Grants permission to create PaymentMethod */
	CreatePaymentMethod: 'CreatePaymentMethod',
	/** Grants permission to create Product */
	CreateProduct: 'CreateProduct',
	/** Grants permission to create Promotion */
	CreatePromotion: 'CreatePromotion',
	/** Grants permission to create Seller */
	CreateSeller: 'CreateSeller',
	/** Grants permission to create PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
	CreateSettings: 'CreateSettings',
	/** Grants permission to create ShippingMethod */
	CreateShippingMethod: 'CreateShippingMethod',
	/** Grants permission to create StockLocation */
	CreateStockLocation: 'CreateStockLocation',
	/** Grants permission to create System */
	CreateSystem: 'CreateSystem',
	/** Grants permission to create Tag */
	CreateTag: 'CreateTag',
	/** Grants permission to create TaxCategory */
	CreateTaxCategory: 'CreateTaxCategory',
	/** Grants permission to create TaxRate */
	CreateTaxRate: 'CreateTaxRate',
	/** Grants permission to create Zone */
	CreateZone: 'CreateZone',
	/** Grants permission to delete Administrator */
	DeleteAdministrator: 'DeleteAdministrator',
	/** Grants permission to delete Asset */
	DeleteAsset: 'DeleteAsset',
	/** Grants permission to delete Products, Facets, Assets, Collections */
	DeleteCatalog: 'DeleteCatalog',
	/** Grants permission to delete Channel */
	DeleteChannel: 'DeleteChannel',
	/** Grants permission to delete Collection */
	DeleteCollection: 'DeleteCollection',
	/** Grants permission to delete Country */
	DeleteCountry: 'DeleteCountry',
	/** Grants permission to delete Customer */
	DeleteCustomer: 'DeleteCustomer',
	/** Grants permission to delete CustomerGroup */
	DeleteCustomerGroup: 'DeleteCustomerGroup',
	/** Grants permission to delete Facet */
	DeleteFacet: 'DeleteFacet',
	/** Grants permission to delete Order */
	DeleteOrder: 'DeleteOrder',
	/** Grants permission to delete PaymentMethod */
	DeletePaymentMethod: 'DeletePaymentMethod',
	/** Grants permission to delete Product */
	DeleteProduct: 'DeleteProduct',
	/** Grants permission to delete Promotion */
	DeletePromotion: 'DeletePromotion',
	/** Grants permission to delete Seller */
	DeleteSeller: 'DeleteSeller',
	/** Grants permission to delete PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
	DeleteSettings: 'DeleteSettings',
	/** Grants permission to delete ShippingMethod */
	DeleteShippingMethod: 'DeleteShippingMethod',
	/** Grants permission to delete StockLocation */
	DeleteStockLocation: 'DeleteStockLocation',
	/** Grants permission to delete System */
	DeleteSystem: 'DeleteSystem',
	/** Grants permission to delete Tag */
	DeleteTag: 'DeleteTag',
	/** Grants permission to delete TaxCategory */
	DeleteTaxCategory: 'DeleteTaxCategory',
	/** Grants permission to delete TaxRate */
	DeleteTaxRate: 'DeleteTaxRate',
	/** Grants permission to delete Zone */
	DeleteZone: 'DeleteZone',
	/** Owner means the user owns this entity, e.g. a Customer's own Order */
	Owner: 'Owner',
	/** Public means any unauthenticated user may perform the operation */
	Public: 'Public',
	/** Grants permission to read Administrator */
	ReadAdministrator: 'ReadAdministrator',
	/** Grants permission to read Asset */
	ReadAsset: 'ReadAsset',
	/** Grants permission to read Products, Facets, Assets, Collections */
	ReadCatalog: 'ReadCatalog',
	/** Grants permission to read Channel */
	ReadChannel: 'ReadChannel',
	/** Grants permission to read Collection */
	ReadCollection: 'ReadCollection',
	/** Grants permission to read Country */
	ReadCountry: 'ReadCountry',
	/** Grants permission to read Customer */
	ReadCustomer: 'ReadCustomer',
	/** Grants permission to read CustomerGroup */
	ReadCustomerGroup: 'ReadCustomerGroup',
	/** Grants permission to read Facet */
	ReadFacet: 'ReadFacet',
	/** Grants permission to read Order */
	ReadOrder: 'ReadOrder',
	/** Grants permission to read PaymentMethod */
	ReadPaymentMethod: 'ReadPaymentMethod',
	/** Grants permission to read Product */
	ReadProduct: 'ReadProduct',
	/** Grants permission to read Promotion */
	ReadPromotion: 'ReadPromotion',
	/** Grants permission to read Seller */
	ReadSeller: 'ReadSeller',
	/** Grants permission to read PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
	ReadSettings: 'ReadSettings',
	/** Grants permission to read ShippingMethod */
	ReadShippingMethod: 'ReadShippingMethod',
	/** Grants permission to read StockLocation */
	ReadStockLocation: 'ReadStockLocation',
	/** Grants permission to read System */
	ReadSystem: 'ReadSystem',
	/** Grants permission to read Tag */
	ReadTag: 'ReadTag',
	/** Grants permission to read TaxCategory */
	ReadTaxCategory: 'ReadTaxCategory',
	/** Grants permission to read TaxRate */
	ReadTaxRate: 'ReadTaxRate',
	/** Grants permission to read Zone */
	ReadZone: 'ReadZone',
	/** SuperAdmin has unrestricted access to all operations */
	SuperAdmin: 'SuperAdmin',
	/** Grants permission to update Administrator */
	UpdateAdministrator: 'UpdateAdministrator',
	/** Grants permission to update Asset */
	UpdateAsset: 'UpdateAsset',
	/** Grants permission to update Products, Facets, Assets, Collections */
	UpdateCatalog: 'UpdateCatalog',
	/** Grants permission to update Channel */
	UpdateChannel: 'UpdateChannel',
	/** Grants permission to update Collection */
	UpdateCollection: 'UpdateCollection',
	/** Grants permission to update Country */
	UpdateCountry: 'UpdateCountry',
	/** Grants permission to update Customer */
	UpdateCustomer: 'UpdateCustomer',
	/** Grants permission to update CustomerGroup */
	UpdateCustomerGroup: 'UpdateCustomerGroup',
	/** Grants permission to update Facet */
	UpdateFacet: 'UpdateFacet',
	/** Grants permission to update GlobalSettings */
	UpdateGlobalSettings: 'UpdateGlobalSettings',
	/** Grants permission to update Order */
	UpdateOrder: 'UpdateOrder',
	/** Grants permission to update PaymentMethod */
	UpdatePaymentMethod: 'UpdatePaymentMethod',
	/** Grants permission to update Product */
	UpdateProduct: 'UpdateProduct',
	/** Grants permission to update Promotion */
	UpdatePromotion: 'UpdatePromotion',
	/** Grants permission to update Seller */
	UpdateSeller: 'UpdateSeller',
	/** Grants permission to update PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
	UpdateSettings: 'UpdateSettings',
	/** Grants permission to update ShippingMethod */
	UpdateShippingMethod: 'UpdateShippingMethod',
	/** Grants permission to update StockLocation */
	UpdateStockLocation: 'UpdateStockLocation',
	/** Grants permission to update System */
	UpdateSystem: 'UpdateSystem',
	/** Grants permission to update Tag */
	UpdateTag: 'UpdateTag',
	/** Grants permission to update TaxCategory */
	UpdateTaxCategory: 'UpdateTaxCategory',
	/** Grants permission to update TaxRate */
	UpdateTaxRate: 'UpdateTaxRate',
	/** Grants permission to update Zone */
	UpdateZone: 'UpdateZone',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];
/** The price range where the result has more than one price */
export type PriceRange = {
	__typename?: 'PriceRange';
	max: Scalars['Money']['output'];
	min: Scalars['Money']['output'];
};

export type Product = Node & {
	__typename?: 'Product';
	assets: Array<Asset>;
	collections: Array<Collection>;
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<ProductCustomFields>;
	description: Scalars['String']['output'];
	enabled: Scalars['Boolean']['output'];
	facetValues: Array<FacetValue>;
	featuredAsset?: Maybe<Asset>;
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	optionGroups: Array<ProductOptionGroup>;
	/** The list of reviews associated with this product.         */
	reviews: ProductReviewList;
	/**
	 * The histogram data of the product reviews' ratings.
	 * Each item represents a bin (0-5) and the frequency of reviews in that bin.
	 */
	reviewsHistogram: Array<ProductReviewHistogramItem>;
	slug: Scalars['String']['output'];
	translations: Array<ProductTranslation>;
	updatedAt: Scalars['DateTime']['output'];
	/** Returns a paginated, sortable, filterable list of ProductVariants */
	variantList: ProductVariantList;
	/** Returns all ProductVariants */
	variants: Array<ProductVariant>;
};

export type ProductReviewsArgs = {
	options?: InputMaybe<ProductReviewListOptions>;
};

export type ProductVariantListArgs = {
	options?: InputMaybe<ProductVariantListOptions>;
};

export type ProductCustomFields = {
	__typename?: 'ProductCustomFields';
	customizableClass?: Maybe<Scalars['String']['output']>;
	reviewCount?: Maybe<Scalars['Int']['output']>;
	reviewRating?: Maybe<Scalars['Float']['output']>;
	reviews?: Maybe<Array<ProductReview>>;
};

export type ProductFilterParameter = {
	_and?: InputMaybe<Array<ProductFilterParameter>>;
	_or?: InputMaybe<Array<ProductFilterParameter>>;
	createdAt?: InputMaybe<DateOperators>;
	customizableClass?: InputMaybe<StringOperators>;
	description?: InputMaybe<StringOperators>;
	enabled?: InputMaybe<BooleanOperators>;
	id?: InputMaybe<IdOperators>;
	languageCode?: InputMaybe<StringOperators>;
	name?: InputMaybe<StringOperators>;
	reviewCount?: InputMaybe<NumberOperators>;
	reviewRating?: InputMaybe<NumberOperators>;
	slug?: InputMaybe<StringOperators>;
	updatedAt?: InputMaybe<DateOperators>;
};

export type ProductList = PaginatedList & {
	__typename?: 'ProductList';
	items: Array<Product>;
	totalItems: Scalars['Int']['output'];
};

export type ProductListOptions = {
	/** Allows the results to be filtered */
	filter?: InputMaybe<ProductFilterParameter>;
	/** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
	filterOperator?: InputMaybe<LogicalOperator>;
	/** Skips the first n results, for use in pagination */
	skip?: InputMaybe<Scalars['Int']['input']>;
	/** Specifies which properties to sort the results by */
	sort?: InputMaybe<ProductSortParameter>;
	/** Takes n results, for use in pagination */
	take?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductOption = Node & {
	__typename?: 'ProductOption';
	code: Scalars['String']['output'];
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	group: ProductOptionGroup;
	groupId: Scalars['ID']['output'];
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	translations: Array<ProductOptionTranslation>;
	updatedAt: Scalars['DateTime']['output'];
};

export type ProductOptionGroup = Node & {
	__typename?: 'ProductOptionGroup';
	code: Scalars['String']['output'];
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	options: Array<ProductOption>;
	translations: Array<ProductOptionGroupTranslation>;
	updatedAt: Scalars['DateTime']['output'];
};

export type ProductOptionGroupTranslation = {
	__typename?: 'ProductOptionGroupTranslation';
	createdAt: Scalars['DateTime']['output'];
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type ProductOptionTranslation = {
	__typename?: 'ProductOptionTranslation';
	createdAt: Scalars['DateTime']['output'];
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type ProductReview = Node & {
	__typename?: 'ProductReview';
	assets?: Maybe<Array<Asset>>;
	authorLocation?: Maybe<Scalars['String']['output']>;
	/** The name of the review author, user can input any name they like.  */
	authorName: Scalars['String']['output'];
	/** The main content of the review */
	body?: Maybe<Scalars['String']['output']>;
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	id: Scalars['ID']['output'];
	product: Product;
	productVariant?: Maybe<ProductVariant>;
	/**
	 * The rating given by the reviewer, it can be a float value between 0 and 5
	 * Higher means user is more satisfied with the product
	 * However, the frontend can choose to round it to the nearest integer for display purposes
	 */
	rating: Scalars['Float']['output'];
	/** The response from the store admin to this review */
	response?: Maybe<Scalars['String']['output']>;
	responseCreatedAt?: Maybe<Scalars['DateTime']['output']>;
	/** The moderation state of the review, e.g. 'new', 'approved', 'rejected' */
	state: Scalars['String']['output'];
	/**
	 * A brief summary of the review
	 * It will be shown as the title of the review
	 */
	summary: Scalars['String']['output'];
	translations: Array<ProductReviewTranslation>;
	updatedAt: Scalars['DateTime']['output'];
	/** The number of upvotes this review (i.e. thumbs up) has received from other customers */
	upvotes: Scalars['Int']['output'];
};

export type ProductReviewFilterParameter = {
	_and?: InputMaybe<Array<ProductReviewFilterParameter>>;
	_or?: InputMaybe<Array<ProductReviewFilterParameter>>;
	authorLocation?: InputMaybe<StringOperators>;
	authorName?: InputMaybe<StringOperators>;
	body?: InputMaybe<StringOperators>;
	createdAt?: InputMaybe<DateOperators>;
	id?: InputMaybe<IdOperators>;
	rating?: InputMaybe<NumberOperators>;
	response?: InputMaybe<StringOperators>;
	responseCreatedAt?: InputMaybe<DateOperators>;
	state?: InputMaybe<StringOperators>;
	summary?: InputMaybe<StringOperators>;
	updatedAt?: InputMaybe<DateOperators>;
	upvotes?: InputMaybe<NumberOperators>;
};

export type ProductReviewHistogramItem = {
	__typename?: 'ProductReviewHistogramItem';
	bin: Scalars['Int']['output'];
	frequency: Scalars['Int']['output'];
};

export type ProductReviewList = PaginatedList & {
	__typename?: 'ProductReviewList';
	items: Array<ProductReview>;
	totalItems: Scalars['Int']['output'];
};

export type ProductReviewListOptions = {
	/** Allows the results to be filtered */
	filter?: InputMaybe<ProductReviewFilterParameter>;
	/** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
	filterOperator?: InputMaybe<LogicalOperator>;
	/** Skips the first n results, for use in pagination */
	skip?: InputMaybe<Scalars['Int']['input']>;
	/** Specifies which properties to sort the results by */
	sort?: InputMaybe<ProductReviewSortParameter>;
	/** Takes n results, for use in pagination */
	take?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductReviewSortParameter = {
	authorLocation?: InputMaybe<SortOrder>;
	authorName?: InputMaybe<SortOrder>;
	body?: InputMaybe<SortOrder>;
	createdAt?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	rating?: InputMaybe<SortOrder>;
	response?: InputMaybe<SortOrder>;
	responseCreatedAt?: InputMaybe<SortOrder>;
	state?: InputMaybe<SortOrder>;
	summary?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
	upvotes?: InputMaybe<SortOrder>;
};

export type ProductReviewTranslation = {
	__typename?: 'ProductReviewTranslation';
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	text: Scalars['String']['output'];
};

export type ProductSortParameter = {
	createdAt?: InputMaybe<SortOrder>;
	customizableClass?: InputMaybe<SortOrder>;
	description?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	reviewCount?: InputMaybe<SortOrder>;
	reviewRating?: InputMaybe<SortOrder>;
	slug?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
};

export type ProductTranslation = {
	__typename?: 'ProductTranslation';
	createdAt: Scalars['DateTime']['output'];
	description: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	slug: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type ProductVariant = Node & {
	__typename?: 'ProductVariant';
	assets: Array<Asset>;
	createdAt: Scalars['DateTime']['output'];
	currencyCode: CurrencyCode;
	customFields?: Maybe<ProductVariantCustomFields>;
	facetValues: Array<FacetValue>;
	featuredAsset?: Maybe<Asset>;
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	options: Array<ProductOption>;
	price: Scalars['Money']['output'];
	priceWithTax: Scalars['Money']['output'];
	product: Product;
	productId: Scalars['ID']['output'];
	sku: Scalars['String']['output'];
	stockLevel: Scalars['String']['output'];
	taxCategory: TaxCategory;
	taxRateApplied: TaxRate;
	translations: Array<ProductVariantTranslation>;
	updatedAt: Scalars['DateTime']['output'];
};

export type ProductVariantCustomFields = {
	__typename?: 'ProductVariantCustomFields';
	customBuildJson?: Maybe<Scalars['String']['output']>;
	lengthUnit?: Maybe<Scalars['String']['output']>;
	physicalAttributes?: Maybe<ProductVariantPhysicalAttributesStruct>;
	prepDays?: Maybe<Scalars['Int']['output']>;
	weightUnit?: Maybe<Scalars['String']['output']>;
};

export type ProductVariantFilterParameter = {
	_and?: InputMaybe<Array<ProductVariantFilterParameter>>;
	_or?: InputMaybe<Array<ProductVariantFilterParameter>>;
	createdAt?: InputMaybe<DateOperators>;
	currencyCode?: InputMaybe<StringOperators>;
	customBuildJson?: InputMaybe<StringOperators>;
	id?: InputMaybe<IdOperators>;
	languageCode?: InputMaybe<StringOperators>;
	lengthUnit?: InputMaybe<StringOperators>;
	name?: InputMaybe<StringOperators>;
	prepDays?: InputMaybe<NumberOperators>;
	price?: InputMaybe<NumberOperators>;
	priceWithTax?: InputMaybe<NumberOperators>;
	productId?: InputMaybe<IdOperators>;
	sku?: InputMaybe<StringOperators>;
	stockLevel?: InputMaybe<StringOperators>;
	updatedAt?: InputMaybe<DateOperators>;
	weightUnit?: InputMaybe<StringOperators>;
};

export type ProductVariantList = PaginatedList & {
	__typename?: 'ProductVariantList';
	items: Array<ProductVariant>;
	totalItems: Scalars['Int']['output'];
};

export type ProductVariantListOptions = {
	/** Allows the results to be filtered */
	filter?: InputMaybe<ProductVariantFilterParameter>;
	/** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
	filterOperator?: InputMaybe<LogicalOperator>;
	/** Skips the first n results, for use in pagination */
	skip?: InputMaybe<Scalars['Int']['input']>;
	/** Specifies which properties to sort the results by */
	sort?: InputMaybe<ProductVariantSortParameter>;
	/** Takes n results, for use in pagination */
	take?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductVariantPhysicalAttributesStruct = {
	__typename?: 'ProductVariantPhysicalAttributesStruct';
	height?: Maybe<Scalars['Float']['output']>;
	length?: Maybe<Scalars['Float']['output']>;
	weight?: Maybe<Scalars['Float']['output']>;
	width?: Maybe<Scalars['Float']['output']>;
};

export type ProductVariantSortParameter = {
	createdAt?: InputMaybe<SortOrder>;
	customBuildJson?: InputMaybe<SortOrder>;
	id?: InputMaybe<SortOrder>;
	lengthUnit?: InputMaybe<SortOrder>;
	name?: InputMaybe<SortOrder>;
	prepDays?: InputMaybe<SortOrder>;
	price?: InputMaybe<SortOrder>;
	priceWithTax?: InputMaybe<SortOrder>;
	productId?: InputMaybe<SortOrder>;
	sku?: InputMaybe<SortOrder>;
	stockLevel?: InputMaybe<SortOrder>;
	updatedAt?: InputMaybe<SortOrder>;
	weightUnit?: InputMaybe<SortOrder>;
};

export type ProductVariantTranslation = {
	__typename?: 'ProductVariantTranslation';
	createdAt: Scalars['DateTime']['output'];
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type Promotion = Node & {
	__typename?: 'Promotion';
	actions: Array<ConfigurableOperation>;
	conditions: Array<ConfigurableOperation>;
	couponCode?: Maybe<Scalars['String']['output']>;
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	description: Scalars['String']['output'];
	enabled: Scalars['Boolean']['output'];
	endsAt?: Maybe<Scalars['DateTime']['output']>;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	perCustomerUsageLimit?: Maybe<Scalars['Int']['output']>;
	startsAt?: Maybe<Scalars['DateTime']['output']>;
	translations: Array<PromotionTranslation>;
	updatedAt: Scalars['DateTime']['output'];
	usageLimit?: Maybe<Scalars['Int']['output']>;
};

export type PromotionList = PaginatedList & {
	__typename?: 'PromotionList';
	items: Array<Promotion>;
	totalItems: Scalars['Int']['output'];
};

export type PromotionTranslation = {
	__typename?: 'PromotionTranslation';
	createdAt: Scalars['DateTime']['output'];
	description: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type Province = Node &
	Region & {
		__typename?: 'Province';
		code: Scalars['String']['output'];
		createdAt: Scalars['DateTime']['output'];
		customFields?: Maybe<Scalars['JSON']['output']>;
		enabled: Scalars['Boolean']['output'];
		id: Scalars['ID']['output'];
		languageCode: LanguageCode;
		name: Scalars['String']['output'];
		parent?: Maybe<Region>;
		parentId?: Maybe<Scalars['ID']['output']>;
		translations: Array<RegionTranslation>;
		type: Scalars['String']['output'];
		updatedAt: Scalars['DateTime']['output'];
	};

export type ProvinceList = PaginatedList & {
	__typename?: 'ProvinceList';
	items: Array<Province>;
	totalItems: Scalars['Int']['output'];
};

export type PublicPaymentMethod = {
	__typename?: 'PublicPaymentMethod';
	code: Scalars['String']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	description?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	translations: Array<PaymentMethodTranslation>;
};

export type PublicShippingMethod = {
	__typename?: 'PublicShippingMethod';
	code: Scalars['String']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	description?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	translations: Array<ShippingMethodTranslation>;
};

/** The purchased productVariant and the review eligibility status */
export type PurchasedVariantWithReviewStatus = {
	__typename?: 'PurchasedVariantWithReviewStatus';
	canReview: Scalars['Boolean']['output'];
	notReviewableReason?: Maybe<Scalars['String']['output']>;
	variantId: Scalars['ID']['output'];
};

export type PurchasedVariantWithReviewStatusList = {
	__typename?: 'PurchasedVariantWithReviewStatusList';
	items: Array<PurchasedVariantWithReviewStatus>;
};

export type Query = {
	__typename?: 'Query';
	/** The active Channel */
	activeChannel: Channel;
	/** The active Customer */
	activeCustomer?: Maybe<Customer>;
	/**
	 * The active Order. Will be `null` until an Order is created via `addItemToOrder`. Once an Order reaches the
	 * state of `PaymentAuthorized` or `PaymentSettled`, then that Order is no longer considered "active" and this
	 * query will once again return `null`.
	 */
	activeOrder?: Maybe<Order>;
	/** Get active payment methods */
	activePaymentMethods: Array<Maybe<PublicPaymentMethod>>;
	/** Get active shipping methods */
	activeShippingMethods: Array<Maybe<PublicShippingMethod>>;
	/** An array of supported Countries */
	availableCountries: Array<Country>;
	/** Returns a Collection either by its id or slug. If neither 'id' nor 'slug' is specified, an error will result. */
	collection?: Maybe<Collection>;
	/** A list of Collections available to the shop */
	collections: CollectionList;
	customizableClassDefFindAll: Array<CustomizableClassDef>;
	/** Returns a list of payment methods and their eligibility based on the current active Order */
	eligiblePaymentMethods: Array<PaymentMethodQuote>;
	/** Returns a list of eligible shipping methods based on the current active Order */
	eligibleShippingMethods: Array<ShippingMethodQuote>;
	/** Returns a Facet by its id */
	facet?: Maybe<Facet>;
	/** A list of Facets available to the shop */
	facets: FacetList;
	filamentColorFindAll: Array<FilamentColor>;
	filamentColorFindSupported: Array<FilamentColor>;
	fontMenuFindAll: Array<FontMenu>;
	generateBraintreeClientToken?: Maybe<Scalars['String']['output']>;
	/**
	 * Get the list of purchased product variants along with their review eligibility status for the current customer
	 * This is for review eligibility check about whether the customer can review the purchased variants
	 */
	getPurchasedVariantForReview: GetPurchasedVariantForReviewResult;
	/** Check whether the current customer is allowed to review the given product variant */
	isReviewAllowed: IsReviewAllowedResult;
	/** Returns information about the current authenticated User */
	me?: Maybe<CurrentUser>;
	/** Returns the possible next states that the activeOrder can transition to */
	nextOrderStates: Array<Scalars['String']['output']>;
	/**
	 * Returns an Order based on the id. Note that in the Shop API, only orders belonging to the
	 * currently-authenticated User may be queried.
	 */
	order?: Maybe<Order>;
	/**
	 * Returns an Order based on the order `code`. For guest Orders (i.e. Orders placed by non-authenticated Customers)
	 * this query will only return the Order within 2 hours of the Order being placed. This allows an Order confirmation
	 * screen to be shown immediately after completion of a guest checkout, yet prevents security risks of allowing
	 * general anonymous access to Order data.
	 */
	orderByCode?: Maybe<Order>;
	/** Get a Product either by id or slug. If neither 'id' nor 'slug' is specified, an error will result. */
	product?: Maybe<Product>;
	/** Get a list of Products */
	products: ProductList;
	/** Search Products based on the criteria set by the `SearchInput` */
	search: SearchResponse;
	/**
	 * Example of verify an address in the API:
	 *   query {
	 *     validateAddressByShippo(
	 *       address: {
	 *         fullName: "Mr. Hippo",
	 *         streetLine1: "215 Clayton St.",
	 *         city: "San Francisco",
	 *         province: "CA",
	 *         postalCode: "94117",
	 *         country: "US",
	 *         phoneNumber: "+1 555 341 9393"}
	 *     ) {
	 *       ... on ShippoAddressValidationResult {
	 *         fullName
	 *         city
	 *         company
	 *         country
	 *         countryCode
	 *         phoneNumber
	 *         postalCode
	 *         province
	 *         streetLine1
	 *         streetLine2
	 *         validationResults {
	 *           isValid
	 *             messages {
	 *               code
	 *               source
	 *               text
	 *             }
	 *         }
	 *       }
	 *       ... on ValidateAddressError {
	 *         errorCode
	 *         message
	 *       }
	 *     }
	 *   }
	 */
	validateAddressByShippo: ValidateAddressResult;
};

export type QueryCollectionArgs = {
	id?: InputMaybe<Scalars['ID']['input']>;
	slug?: InputMaybe<Scalars['String']['input']>;
};

export type QueryCollectionsArgs = {
	options?: InputMaybe<CollectionListOptions>;
};

export type QueryFacetArgs = {
	id: Scalars['ID']['input'];
};

export type QueryFacetsArgs = {
	options?: InputMaybe<FacetListOptions>;
};

export type QueryGenerateBraintreeClientTokenArgs = {
	includeCustomerId?: InputMaybe<Scalars['Boolean']['input']>;
	orderId?: InputMaybe<Scalars['ID']['input']>;
};

export type QueryIsReviewAllowedArgs = {
	productVariantId: Scalars['ID']['input'];
};

export type QueryOrderArgs = {
	id: Scalars['ID']['input'];
};

export type QueryOrderByCodeArgs = {
	code: Scalars['String']['input'];
};

export type QueryProductArgs = {
	id?: InputMaybe<Scalars['ID']['input']>;
	slug?: InputMaybe<Scalars['String']['input']>;
};

export type QueryProductsArgs = {
	options?: InputMaybe<ProductListOptions>;
};

export type QuerySearchArgs = {
	input: SearchInput;
};

export type QueryValidateAddressByShippoArgs = {
	address: VendureAddressInput;
};

export type RefreshCustomerVerificationResult = NativeAuthStrategyError | Success;

export type Refund = Node & {
	__typename?: 'Refund';
	adjustment: Scalars['Money']['output'];
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	id: Scalars['ID']['output'];
	items: Scalars['Money']['output'];
	lines: Array<RefundLine>;
	metadata?: Maybe<Scalars['JSON']['output']>;
	method?: Maybe<Scalars['String']['output']>;
	paymentId: Scalars['ID']['output'];
	reason?: Maybe<Scalars['String']['output']>;
	shipping: Scalars['Money']['output'];
	state: Scalars['String']['output'];
	total: Scalars['Money']['output'];
	transactionId?: Maybe<Scalars['String']['output']>;
	updatedAt: Scalars['DateTime']['output'];
};

export type RefundLine = {
	__typename?: 'RefundLine';
	orderLine: OrderLine;
	orderLineId: Scalars['ID']['output'];
	quantity: Scalars['Int']['output'];
	refund: Refund;
	refundId: Scalars['ID']['output'];
};

export type Region = {
	code: Scalars['String']['output'];
	createdAt: Scalars['DateTime']['output'];
	enabled: Scalars['Boolean']['output'];
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	parent?: Maybe<Region>;
	parentId?: Maybe<Scalars['ID']['output']>;
	translations: Array<RegionTranslation>;
	type: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type RegionTranslation = {
	__typename?: 'RegionTranslation';
	createdAt: Scalars['DateTime']['output'];
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type RegisterCustomerAccountResult =
	| MissingPasswordError
	| NativeAuthStrategyError
	| PasswordValidationError
	| Success;

export type RegisterCustomerCustomFieldsInput = {
	upvoteReviews?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type RegisterCustomerInput = {
	customFields?: InputMaybe<RegisterCustomerCustomFieldsInput>;
	emailAddress: Scalars['String']['input'];
	firstName?: InputMaybe<Scalars['String']['input']>;
	lastName?: InputMaybe<Scalars['String']['input']>;
	password?: InputMaybe<Scalars['String']['input']>;
	phoneNumber?: InputMaybe<Scalars['String']['input']>;
	title?: InputMaybe<Scalars['String']['input']>;
};

export type RelationCustomFieldConfig = CustomField & {
	__typename?: 'RelationCustomFieldConfig';
	deprecated?: Maybe<Scalars['Boolean']['output']>;
	deprecationReason?: Maybe<Scalars['String']['output']>;
	description?: Maybe<Array<LocalizedString>>;
	entity: Scalars['String']['output'];
	internal?: Maybe<Scalars['Boolean']['output']>;
	label?: Maybe<Array<LocalizedString>>;
	list: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	nullable?: Maybe<Scalars['Boolean']['output']>;
	readonly?: Maybe<Scalars['Boolean']['output']>;
	requiresPermission?: Maybe<Array<Permission>>;
	scalarFields: Array<Scalars['String']['output']>;
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type RemoveOrderItemsResult = Order | OrderInterceptorError | OrderModificationError;

export type RequestPasswordResetResult = NativeAuthStrategyError | Success;

export type RequestUpdateCustomerEmailAddressResult =
	| EmailAddressConflictError
	| InvalidCredentialsError
	| NativeAuthStrategyError
	| Success;

export type ResetPasswordResult =
	| CurrentUser
	| NativeAuthStrategyError
	| NotVerifiedError
	| PasswordResetTokenExpiredError
	| PasswordResetTokenInvalidError
	| PasswordValidationError;

export type ReviewSubmissionError = ErrorResult & {
	__typename?: 'ReviewSubmissionError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

export type Role = Node & {
	__typename?: 'Role';
	channels: Array<Channel>;
	code: Scalars['String']['output'];
	createdAt: Scalars['DateTime']['output'];
	description: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	permissions: Array<Permission>;
	updatedAt: Scalars['DateTime']['output'];
};

export type RoleList = PaginatedList & {
	__typename?: 'RoleList';
	items: Array<Role>;
	totalItems: Scalars['Int']['output'];
};

export type SearchInput = {
	collectionId?: InputMaybe<Scalars['ID']['input']>;
	collectionSlug?: InputMaybe<Scalars['String']['input']>;
	facetValueFilters?: InputMaybe<Array<FacetValueFilterInput>>;
	groupByProduct?: InputMaybe<Scalars['Boolean']['input']>;
	skip?: InputMaybe<Scalars['Int']['input']>;
	sort?: InputMaybe<SearchResultSortParameter>;
	take?: InputMaybe<Scalars['Int']['input']>;
	term?: InputMaybe<Scalars['String']['input']>;
};

export type SearchReindexResponse = {
	__typename?: 'SearchReindexResponse';
	success: Scalars['Boolean']['output'];
};

export type SearchResponse = {
	__typename?: 'SearchResponse';
	collections: Array<CollectionResult>;
	facetValues: Array<FacetValueResult>;
	items: Array<SearchResult>;
	totalItems: Scalars['Int']['output'];
};

export type SearchResult = {
	__typename?: 'SearchResult';
	/** An array of ids of the Collections in which this result appears */
	collectionIds: Array<Scalars['ID']['output']>;
	currencyCode: CurrencyCode;
	description: Scalars['String']['output'];
	facetIds: Array<Scalars['ID']['output']>;
	facetValueIds: Array<Scalars['ID']['output']>;
	price: SearchResultPrice;
	priceWithTax: SearchResultPrice;
	productAsset?: Maybe<SearchResultAsset>;
	productId: Scalars['ID']['output'];
	productName: Scalars['String']['output'];
	productVariantAsset?: Maybe<SearchResultAsset>;
	productVariantId: Scalars['ID']['output'];
	productVariantName: Scalars['String']['output'];
	/** A relevance score for the result. Differs between database implementations */
	score: Scalars['Float']['output'];
	sku: Scalars['String']['output'];
	slug: Scalars['String']['output'];
};

export type SearchResultAsset = {
	__typename?: 'SearchResultAsset';
	focalPoint?: Maybe<Coordinate>;
	id: Scalars['ID']['output'];
	preview: Scalars['String']['output'];
};

/** The price of a search result product, either as a range or as a single price */
export type SearchResultPrice = PriceRange | SinglePrice;

export type SearchResultSortParameter = {
	name?: InputMaybe<SortOrder>;
	price?: InputMaybe<SortOrder>;
};

export type Seller = Node & {
	__typename?: 'Seller';
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type SetCustomerForOrderResult =
	| AlreadyLoggedInError
	| EmailAddressConflictError
	| GuestCheckoutError
	| NoActiveOrderError
	| Order;

export type SetOrderShippingMethodResult =
	| IneligibleShippingMethodError
	| NoActiveOrderError
	| Order
	| OrderModificationError;

export const ShipmentStatus = {
	Error: 'ERROR',
	Queued: 'QUEUED',
	Success: 'SUCCESS',
	Waiting: 'WAITING',
} as const;

export type ShipmentStatus = (typeof ShipmentStatus)[keyof typeof ShipmentStatus];
export type ShippingLine = {
	__typename?: 'ShippingLine';
	customFields?: Maybe<Scalars['JSON']['output']>;
	discountedPrice: Scalars['Money']['output'];
	discountedPriceWithTax: Scalars['Money']['output'];
	discounts: Array<Discount>;
	id: Scalars['ID']['output'];
	price: Scalars['Money']['output'];
	priceWithTax: Scalars['Money']['output'];
	shippingMethod: ShippingMethod;
};

export type ShippingMethod = Node & {
	__typename?: 'ShippingMethod';
	calculator: ConfigurableOperation;
	checker: ConfigurableOperation;
	code: Scalars['String']['output'];
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	description: Scalars['String']['output'];
	fulfillmentHandlerCode: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	translations: Array<ShippingMethodTranslation>;
	updatedAt: Scalars['DateTime']['output'];
};

export type ShippingMethodList = PaginatedList & {
	__typename?: 'ShippingMethodList';
	items: Array<ShippingMethod>;
	totalItems: Scalars['Int']['output'];
};

export type ShippingMethodQuote = {
	__typename?: 'ShippingMethodQuote';
	code: Scalars['String']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	description: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	/** Any optional metadata returned by the ShippingCalculator in the ShippingCalculationResult */
	metadata?: Maybe<Scalars['JSON']['output']>;
	name: Scalars['String']['output'];
	price: Scalars['Money']['output'];
	priceWithTax: Scalars['Money']['output'];
};

export type ShippingMethodTranslation = {
	__typename?: 'ShippingMethodTranslation';
	createdAt: Scalars['DateTime']['output'];
	description: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	languageCode: LanguageCode;
	name: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

/** Represents an address as retrieved from the database */
export type ShippoAddress = {
	__typename?: 'ShippoAddress';
	/** Name of the city. Optional but yields more accurate rates when provided. */
	city?: Maybe<Scalars['String']['output']>;
	/** Company name associated with the address. */
	company?: Maybe<Scalars['String']['output']>;
	/** ISO 3166-1 alpha-2 country code (e.g., "US", "DE"). Required. */
	country: Scalars['String']['output'];
	/** Email address of the contact person, RFC3696/5321-compliant. */
	email?: Maybe<Scalars['String']['output']>;
	/** Indicates whether the address contains all required values. */
	isComplete?: Maybe<Scalars['Boolean']['output']>;
	/** Indicates whether the address is residential. */
	isResidential?: Maybe<Scalars['Boolean']['output']>;
	/** Latitude of the address. */
	latitude?: Maybe<Scalars['Float']['output']>;
	/** Longitude of the address. */
	longitude?: Maybe<Scalars['Float']['output']>;
	/** Additional metadata (up to 100 characters) attached to the address. */
	metadata?: Maybe<Scalars['String']['output']>;
	/** First and last name of the addressee. */
	name?: Maybe<Scalars['String']['output']>;
	/** Date and time of address creation. */
	objectCreated?: Maybe<Scalars['DateTime']['output']>;
	/** Unique identifier of the address object. Required to create a shipment. */
	objectId?: Maybe<Scalars['String']['output']>;
	/** Username of the user who created the address object. */
	objectOwner?: Maybe<Scalars['String']['output']>;
	/** Date and time of the last address update. */
	objectUpdated?: Maybe<Scalars['DateTime']['output']>;
	/** Phone number associated with the address. */
	phone?: Maybe<Scalars['String']['output']>;
	/** State or province. Required for certain countries (e.g., US, AU, CA). */
	state?: Maybe<Scalars['String']['output']>;
	/** First street line (e.g., street number and name). */
	street1?: Maybe<Scalars['String']['output']>;
	/** Second street line. */
	street2?: Maybe<Scalars['String']['output']>;
	/** Third street line. Only accepted for certain carriers. */
	street3?: Maybe<Scalars['String']['output']>;
	/** Street number of the addressed building. */
	streetNo?: Maybe<Scalars['String']['output']>;
	/** Validation results for the address, including messages and validity status. */
	validationResults?: Maybe<AddressValidationResults>;
	/** Postal code of the address. Optional but yields more accurate rates when provided. */
	zip?: Maybe<Scalars['String']['output']>;
};

export type ShippoAddressValidationResult = {
	__typename?: 'ShippoAddressValidationResult';
	city?: Maybe<Scalars['String']['output']>;
	company?: Maybe<Scalars['String']['output']>;
	country?: Maybe<Scalars['String']['output']>;
	countryCode?: Maybe<Scalars['String']['output']>;
	fullName?: Maybe<Scalars['String']['output']>;
	phoneNumber?: Maybe<Scalars['String']['output']>;
	postalCode?: Maybe<Scalars['String']['output']>;
	province?: Maybe<Scalars['String']['output']>;
	streetLine1?: Maybe<Scalars['String']['output']>;
	streetLine2?: Maybe<Scalars['String']['output']>;
	validationResults?: Maybe<AddressValidationResults>;
};

export type ShippoCreatedBy = {
	__typename?: 'ShippoCreatedBy';
	firstName?: Maybe<Scalars['String']['output']>;
	lastName?: Maybe<Scalars['String']['output']>;
	username?: Maybe<Scalars['String']['output']>;
};

export const ShippoDistanceUnit = {
	Cm: 'cm',
	Ft: 'ft',
	In: 'in',
	M: 'm',
	Mm: 'mm',
	Yd: 'yd',
} as const;

export type ShippoDistanceUnit = (typeof ShippoDistanceUnit)[keyof typeof ShippoDistanceUnit];
/** Enum representing the state of a Shippo object. */
export const ShippoObjectState = {
	Invalid: 'INVALID',
	Valid: 'VALID',
} as const;

export type ShippoObjectState = (typeof ShippoObjectState)[keyof typeof ShippoObjectState];
/** Parcel object for Shippo shipments */
export type ShippoParcel = {
	__typename?: 'ShippoParcel';
	/** The measure unit used for length, width, and height. */
	distanceUnit: ShippoDistanceUnit;
	/** Height of the parcel. Up to six digits in front and four digits after the decimal separator are accepted. */
	height: Scalars['String']['output'];
	/** Length of the parcel. Up to six digits in front and four digits after the decimal separator are accepted. */
	length: Scalars['String']['output'];
	/** The unit used for weight. */
	massUnit: ShippoWeightUnit;
	/** Date and time of Parcel creation. */
	objectCreated?: Maybe<Scalars['DateTime']['output']>;
	/** Unique identifier of the given Parcel object. This ID is required to create a Shipment object. */
	objectId?: Maybe<Scalars['String']['output']>;
	/** Username of the user who created the Parcel object. */
	objectOwner?: Maybe<Scalars['String']['output']>;
	/** Weight of the parcel. Up to six digits in front and four digits after the decimal separator are accepted. */
	weight: Scalars['String']['output'];
	/** Width of the parcel. Up to six digits in front and four digits after the decimal separator are accepted. */
	width: Scalars['String']['output'];
};

export type ShippoParcelInput = {
	distanceUnit: ShippoDistanceUnit;
	height: Scalars['String']['input'];
	length: Scalars['String']['input'];
	massUnit: ShippoWeightUnit;
	weight: Scalars['String']['input'];
	width: Scalars['String']['input'];
};

/** Rate object for Shippo shipments */
export type ShippoRate = {
	__typename?: 'ShippoRate';
	/** Final Rate price, expressed in the currency used in the sender's country. */
	amount: Scalars['String']['output'];
	/** Final Rate price, expressed in the currency used in the recipient's country. */
	amountLocal: Scalars['String']['output'];
	/** Predicted time the carrier will deliver the package in the destination's local time zone. */
	arrivesBy?: Maybe<Scalars['String']['output']>;
	/** An array containing specific attributes of this Rate in context of the entire shipment. */
	attributes: Array<ShippoRateAttribute>;
	/** Object ID of the carrier account that has been used to retrieve the rate. */
	carrierAccount: Scalars['String']['output'];
	/** Currency used in the sender's country, refers to 'amount'. */
	currency: Scalars['String']['output'];
	/** Currency used in the recipient's country, refers to 'amountLocal'. */
	currencyLocal: Scalars['String']['output'];
	/** Further clarification of the transit times. */
	durationTerms?: Maybe<Scalars['String']['output']>;
	/** Estimated transit time (duration) in days of the Parcel at the given service level. */
	estimatedDays?: Maybe<Scalars['Int']['output']>;
	/** Cost to the user to insure the Rate for the requested amount of coverage, if insurance coverage was requested. */
	includedInsurancePrice?: Maybe<Scalars['String']['output']>;
	/** Rate's creation date and time. */
	objectCreated: Scalars['DateTime']['output'];
	/** Unique identifier of the given Rate object. */
	objectId: Scalars['ID']['output'];
	/** Username of the user who created the rate object. */
	objectOwner: Scalars['String']['output'];
	/** Carrier offering the rate, e.g., 'FedEx' or 'Deutsche Post DHL'. */
	provider: Scalars['String']['output'];
	/** URL to the provider logo with max. dimensions of 75x75px. */
	providerImage75?: Maybe<Scalars['String']['output']>;
	/** URL to the provider logo with max. dimensions of 200x200px. */
	providerImage200?: Maybe<Scalars['String']['output']>;
	/** Service level details for the rate. */
	servicelevel: ShippoServiceLevel;
	/** Shipment ID associated with the rate. */
	shipment: Scalars['String']['output'];
	/** Indicates whether the object has been created in test mode. */
	test?: Maybe<Scalars['Boolean']['output']>;
	/** The parcel's transit zone token. */
	zone?: Maybe<Scalars['String']['output']>;
};

/** Attributes that can be assigned to a rate in the context of the entire shipment. */
export const ShippoRateAttribute = {
	Bestvalue: 'BESTVALUE',
	Cheapest: 'CHEAPEST',
	Fastest: 'FASTEST',
} as const;

export type ShippoRateAttribute = (typeof ShippoRateAttribute)[keyof typeof ShippoRateAttribute];
export type ShippoResponseMessage = {
	__typename?: 'ShippoResponseMessage';
	code?: Maybe<Scalars['String']['output']>;
	source?: Maybe<Scalars['String']['output']>;
	text?: Maybe<Scalars['String']['output']>;
};

export type ShippoServiceLevel = {
	__typename?: 'ShippoServiceLevel';
	extendedToken?: Maybe<Scalars['String']['output']>;
	/**
	 * Name of the Rate's servicelevel, e.g. 'International Priority' or 'Standard Post'.
	 * @remarks
	 * A servicelevel commonly defines the transit time of a Shipment (e.g., Express vs. Standard), along with other properties.
	 * These names vary depending on the provider.
	 */
	name?: Maybe<Scalars['String']['output']>;
	terms?: Maybe<Scalars['String']['output']>;
	/** Token used to identify the service level. e.g. 'usps_priority' or 'fedex_ground'. */
	token?: Maybe<Scalars['String']['output']>;
};

/**
 * // Shipment represents the parcel as retrieved from the Shippo database
 * //
 */
export type ShippoShipment = {
	__typename?: 'ShippoShipment';
	/** Address object of the sender / seller. */
	addressFrom: ShippoAddress;
	/**
	 * Address object where the shipment will be sent back to if it is not delivered.
	 * Only available for UPS, USPS, and Fedex shipments.
	 */
	addressReturn?: Maybe<ShippoAddress>;
	/** Address object of the recipient / buyer. */
	addressTo: ShippoAddress;
	/** An array of object_ids of the carrier account objects to be used for getting shipping rates. */
	carrierAccounts: Array<Scalars['String']['output']>;
	objectCreated: Scalars['DateTime']['output'];
	/** This is the unique object ID of the original Shippo Shipment object. */
	objectId: Scalars['ID']['output'];
	/** Username of the user who created the Shipment object. */
	objectOwner: Scalars['String']['output'];
	objectUpdated: Scalars['DateTime']['output'];
	/** List of Parcel objects to be shipped. */
	parcels: Array<ShippoParcel>;
	/** An array with all available rates. */
	rates: Array<ShippoRate>;
	/**
	 * Date the shipment will be tendered to the carrier. Must be in the format '2014-01-18T00: 35: 03.463Z'.
	 * Defaults to current date and time if no value is provided.
	 */
	shipmentDate?: Maybe<Scalars['String']['output']>;
	/**
	 * 'Waiting' shipments have been successfully submitted but not yet been processed.
	 *
	 * @remarks
	 * 'Queued' shipments are currently being processed.
	 * 'Success' shipments have been processed successfully, meaning that rate generation has concluded.
	 * 'Error' does not occur currently and is reserved for future use.
	 */
	status: ShipmentStatus;
};

/** Enum representing the tracking status of a shipment. */
export const ShippoTrackingStatus = {
	Delivered: 'DELIVERED',
	Failure: 'FAILURE',
	PreTransit: 'PRE_TRANSIT',
	Returned: 'RETURNED',
	Transit: 'TRANSIT',
	Unknown: 'UNKNOWN',
} as const;

export type ShippoTrackingStatus = (typeof ShippoTrackingStatus)[keyof typeof ShippoTrackingStatus];
/** Transaction object for Shippo shipments */
export type ShippoTransaction = {
	__typename?: 'ShippoTransaction';
	/** A URL pointing to the commercial invoice as a PDF file. */
	commercialInvoiceUrl?: Maybe<Scalars['String']['output']>;
	/** Details about the user who created the transaction. */
	createdBy?: Maybe<ShippoCreatedBy>;
	/** The estimated time of arrival according to the carrier. */
	eta?: Maybe<Scalars['String']['output']>;
	/** The format of the shipping label. */
	labelFileType?: Maybe<Scalars['String']['output']>;
	/** A URL pointing directly to the shipping label. */
	labelUrl?: Maybe<Scalars['String']['output']>;
	/** Additional messages or notes related to the transaction. */
	messages?: Maybe<Array<ShippoResponseMessage>>;
	/** Metadata for the transaction. */
	metadata?: Maybe<Scalars['String']['output']>;
	/** The date and time when the transaction was created. */
	objectCreated?: Maybe<Scalars['DateTime']['output']>;
	/** Unique identifier for the transaction object. */
	objectId?: Maybe<Scalars['String']['output']>;
	/** The owner of the transaction object. */
	objectOwner?: Maybe<Scalars['String']['output']>;
	/** The state of the transaction object. */
	objectState?: Maybe<ShippoObjectState>;
	/** The date and time when the transaction was last updated. */
	objectUpdated?: Maybe<Scalars['DateTime']['output']>;
	/** The ID of the parcel associated with the transaction. */
	parcel?: Maybe<Scalars['String']['output']>;
	/** A URL pointing to the QR code for the transaction. */
	qrCodeUrl?: Maybe<Scalars['String']['output']>;
	/** The rate associated with the transaction. */
	rate?: Maybe<Scalars['String']['output']>;
	/** The status of the transaction. */
	status?: Maybe<ShippoTransactionStatus>;
	/** Indicates whether the transaction was created in test mode. */
	test?: Maybe<Scalars['Boolean']['output']>;
	/** The tracking number for the shipment. */
	trackingNumber?: Maybe<Scalars['String']['output']>;
	/** The tracking status of the shipment. */
	trackingStatus?: Maybe<ShippoTrackingStatus>;
	/** A URL to track the shipment on the carrier's website. */
	trackingUrlProvider?: Maybe<Scalars['String']['output']>;
};

/** Enum representing the status of a Shippo transaction. */
export const ShippoTransactionStatus = {
	Error: 'ERROR',
	Queued: 'QUEUED',
	Refunded: 'REFUNDED',
	Refundpending: 'REFUNDPENDING',
	Refundrejected: 'REFUNDREJECTED',
	Success: 'SUCCESS',
	Waiting: 'WAITING',
} as const;

export type ShippoTransactionStatus =
	(typeof ShippoTransactionStatus)[keyof typeof ShippoTransactionStatus];
export const ShippoWeightUnit = {
	G: 'g',
	Kg: 'kg',
	Lb: 'lb',
	Oz: 'oz',
} as const;

export type ShippoWeightUnit = (typeof ShippoWeightUnit)[keyof typeof ShippoWeightUnit];
/** The price value where the result has a single price */
export type SinglePrice = {
	__typename?: 'SinglePrice';
	value: Scalars['Money']['output'];
};

export const SortOrder = {
	Asc: 'ASC',
	Desc: 'DESC',
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export type StringCustomFieldConfig = CustomField & {
	__typename?: 'StringCustomFieldConfig';
	deprecated?: Maybe<Scalars['Boolean']['output']>;
	deprecationReason?: Maybe<Scalars['String']['output']>;
	description?: Maybe<Array<LocalizedString>>;
	internal?: Maybe<Scalars['Boolean']['output']>;
	label?: Maybe<Array<LocalizedString>>;
	length?: Maybe<Scalars['Int']['output']>;
	list: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	nullable?: Maybe<Scalars['Boolean']['output']>;
	options?: Maybe<Array<StringFieldOption>>;
	pattern?: Maybe<Scalars['String']['output']>;
	readonly?: Maybe<Scalars['Boolean']['output']>;
	requiresPermission?: Maybe<Array<Permission>>;
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type StringFieldOption = {
	__typename?: 'StringFieldOption';
	label?: Maybe<Array<LocalizedString>>;
	value: Scalars['String']['output'];
};

/** Operators for filtering on a list of String fields */
export type StringListOperators = {
	inList: Scalars['String']['input'];
};

/** Operators for filtering on a String field */
export type StringOperators = {
	contains?: InputMaybe<Scalars['String']['input']>;
	eq?: InputMaybe<Scalars['String']['input']>;
	in?: InputMaybe<Array<Scalars['String']['input']>>;
	isNull?: InputMaybe<Scalars['Boolean']['input']>;
	notContains?: InputMaybe<Scalars['String']['input']>;
	notEq?: InputMaybe<Scalars['String']['input']>;
	notIn?: InputMaybe<Array<Scalars['String']['input']>>;
	regex?: InputMaybe<Scalars['String']['input']>;
};

export type StringStructFieldConfig = StructField & {
	__typename?: 'StringStructFieldConfig';
	description?: Maybe<Array<LocalizedString>>;
	label?: Maybe<Array<LocalizedString>>;
	length?: Maybe<Scalars['Int']['output']>;
	list: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	options?: Maybe<Array<StringFieldOption>>;
	pattern?: Maybe<Scalars['String']['output']>;
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type StructCustomFieldConfig = CustomField & {
	__typename?: 'StructCustomFieldConfig';
	deprecated?: Maybe<Scalars['Boolean']['output']>;
	deprecationReason?: Maybe<Scalars['String']['output']>;
	description?: Maybe<Array<LocalizedString>>;
	fields: Array<StructFieldConfig>;
	internal?: Maybe<Scalars['Boolean']['output']>;
	label?: Maybe<Array<LocalizedString>>;
	list: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	nullable?: Maybe<Scalars['Boolean']['output']>;
	readonly?: Maybe<Scalars['Boolean']['output']>;
	requiresPermission?: Maybe<Array<Permission>>;
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type StructField = {
	description?: Maybe<Array<LocalizedString>>;
	label?: Maybe<Array<LocalizedString>>;
	list?: Maybe<Scalars['Boolean']['output']>;
	name: Scalars['String']['output'];
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type StructFieldConfig =
	| BooleanStructFieldConfig
	| DateTimeStructFieldConfig
	| FloatStructFieldConfig
	| IntStructFieldConfig
	| StringStructFieldConfig
	| TextStructFieldConfig;

export type SubmitProductReviewInput = {
	authorLocation?: InputMaybe<Scalars['String']['input']>;
	authorName?: InputMaybe<Scalars['String']['input']>;
	body: Scalars['String']['input'];
	files?: InputMaybe<Array<Scalars['Upload']['input']>>;
	productVariantId: Scalars['ID']['input'];
	rating: Scalars['Float']['input'];
	summary: Scalars['String']['input'];
};

export type SubmitProductReviewResult = ProductReview | ReviewSubmissionError;

/** Indicates that an operation succeeded, where we do not want to return any more specific information. */
export type Success = {
	__typename?: 'Success';
	success: Scalars['Boolean']['output'];
};

export type Surcharge = Node & {
	__typename?: 'Surcharge';
	createdAt: Scalars['DateTime']['output'];
	description: Scalars['String']['output'];
	id: Scalars['ID']['output'];
	price: Scalars['Money']['output'];
	priceWithTax: Scalars['Money']['output'];
	sku?: Maybe<Scalars['String']['output']>;
	taxLines: Array<TaxLine>;
	taxRate: Scalars['Float']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type Tag = Node & {
	__typename?: 'Tag';
	createdAt: Scalars['DateTime']['output'];
	id: Scalars['ID']['output'];
	updatedAt: Scalars['DateTime']['output'];
	value: Scalars['String']['output'];
};

export type TagList = PaginatedList & {
	__typename?: 'TagList';
	items: Array<Tag>;
	totalItems: Scalars['Int']['output'];
};

export type TaxCategory = Node & {
	__typename?: 'TaxCategory';
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	id: Scalars['ID']['output'];
	isDefault: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type TaxLine = {
	__typename?: 'TaxLine';
	description: Scalars['String']['output'];
	taxRate: Scalars['Float']['output'];
};

export type TaxRate = Node & {
	__typename?: 'TaxRate';
	category: TaxCategory;
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	customerGroup?: Maybe<CustomerGroup>;
	enabled: Scalars['Boolean']['output'];
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
	value: Scalars['Float']['output'];
	zone: Zone;
};

export type TaxRateList = PaginatedList & {
	__typename?: 'TaxRateList';
	items: Array<TaxRate>;
	totalItems: Scalars['Int']['output'];
};

export type TextCustomFieldConfig = CustomField & {
	__typename?: 'TextCustomFieldConfig';
	deprecated?: Maybe<Scalars['Boolean']['output']>;
	deprecationReason?: Maybe<Scalars['String']['output']>;
	description?: Maybe<Array<LocalizedString>>;
	internal?: Maybe<Scalars['Boolean']['output']>;
	label?: Maybe<Array<LocalizedString>>;
	list: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	nullable?: Maybe<Scalars['Boolean']['output']>;
	readonly?: Maybe<Scalars['Boolean']['output']>;
	requiresPermission?: Maybe<Array<Permission>>;
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type TextStructFieldConfig = StructField & {
	__typename?: 'TextStructFieldConfig';
	description?: Maybe<Array<LocalizedString>>;
	label?: Maybe<Array<LocalizedString>>;
	list: Scalars['Boolean']['output'];
	name: Scalars['String']['output'];
	type: Scalars['String']['output'];
	ui?: Maybe<Scalars['JSON']['output']>;
};

export type TransitionOrderToStateResult = Order | OrderStateTransitionError;

/**
 * Input used to update an Address.
 *
 * The countryCode must correspond to a `code` property of a Country that has been defined in the
 * Vendure server. The `code` property is typically a 2-character ISO code such as "GB", "US", "DE" etc.
 * If an invalid code is passed, the mutation will fail.
 */
export type UpdateAddressInput = {
	city?: InputMaybe<Scalars['String']['input']>;
	company?: InputMaybe<Scalars['String']['input']>;
	countryCode?: InputMaybe<Scalars['String']['input']>;
	customFields?: InputMaybe<Scalars['JSON']['input']>;
	defaultBillingAddress?: InputMaybe<Scalars['Boolean']['input']>;
	defaultShippingAddress?: InputMaybe<Scalars['Boolean']['input']>;
	fullName?: InputMaybe<Scalars['String']['input']>;
	id: Scalars['ID']['input'];
	phoneNumber?: InputMaybe<Scalars['String']['input']>;
	postalCode?: InputMaybe<Scalars['String']['input']>;
	province?: InputMaybe<Scalars['String']['input']>;
	streetLine1?: InputMaybe<Scalars['String']['input']>;
	streetLine2?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomerCustomFieldsInput = {
	upvoteReviews?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateCustomerEmailAddressResult =
	| IdentifierChangeTokenExpiredError
	| IdentifierChangeTokenInvalidError
	| NativeAuthStrategyError
	| Success;

export type UpdateCustomerInput = {
	customFields?: InputMaybe<UpdateCustomerCustomFieldsInput>;
	firstName?: InputMaybe<Scalars['String']['input']>;
	lastName?: InputMaybe<Scalars['String']['input']>;
	phoneNumber?: InputMaybe<Scalars['String']['input']>;
	title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomerPasswordResult =
	| InvalidCredentialsError
	| NativeAuthStrategyError
	| PasswordValidationError
	| Success;

export type UpdateFulfillmentStateError = ErrorResult & {
	__typename?: 'UpdateFulfillmentStateError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

export type UpdateFulfillmentStateResult =
	| UpdateFulfillmentStateError
	| UpdateFulfillmentStateSuccess;

export type UpdateFulfillmentStateSuccess = {
	__typename?: 'UpdateFulfillmentStateSuccess';
	message: Scalars['String']['output'];
	numFulfillmentsUpdated: Scalars['Int']['output'];
	success: Scalars['Boolean']['output'];
};

/**
 * Returned when multiple items are added to an Order.
 * The errorResults array contains the errors that occurred for each item, if any.
 */
export type UpdateMultipleOrderItemsResult = {
	__typename?: 'UpdateMultipleOrderItemsResult';
	errorResults: Array<UpdateOrderItemErrorResult>;
	order: Order;
};

export type UpdateOrderCustomFieldsInput = {
	promisedArrivalDays?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateOrderInput = {
	customFields?: InputMaybe<UpdateOrderCustomFieldsInput>;
};

/** Union type of all possible errors that can occur when adding or removing items from an Order. */
export type UpdateOrderItemErrorResult =
	| InsufficientStockError
	| NegativeQuantityError
	| OrderInterceptorError
	| OrderLimitError
	| OrderModificationError;

export type UpdateOrderItemsResult =
	| InsufficientStockError
	| NegativeQuantityError
	| Order
	| OrderInterceptorError
	| OrderLimitError
	| OrderModificationError;

export type User = Node & {
	__typename?: 'User';
	authenticationMethods: Array<AuthenticationMethod>;
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	id: Scalars['ID']['output'];
	identifier: Scalars['String']['output'];
	lastLogin?: Maybe<Scalars['DateTime']['output']>;
	roles: Array<Role>;
	updatedAt: Scalars['DateTime']['output'];
	verified: Scalars['Boolean']['output'];
};

export type ValidateAddressError = ErrorResult & {
	__typename?: 'ValidateAddressError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

export type ValidateAddressResult = ShippoAddressValidationResult | ValidateAddressError;

export type VendureAddressInput = {
	city?: InputMaybe<Scalars['String']['input']>;
	company?: InputMaybe<Scalars['String']['input']>;
	country: Scalars['String']['input'];
	countryCode?: InputMaybe<Scalars['String']['input']>;
	fullName?: InputMaybe<Scalars['String']['input']>;
	phoneNumber?: InputMaybe<Scalars['String']['input']>;
	postalCode: Scalars['String']['input'];
	province?: InputMaybe<Scalars['String']['input']>;
	streetLine1?: InputMaybe<Scalars['String']['input']>;
	streetLine2?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Returned if the verification token (used to verify a Customer's email address) is valid, but has
 * expired according to the `verificationTokenDuration` setting in the AuthOptions.
 */
export type VerificationTokenExpiredError = ErrorResult & {
	__typename?: 'VerificationTokenExpiredError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

/**
 * Returned if the verification token (used to verify a Customer's email address) is either
 * invalid or does not match any expected tokens.
 */
export type VerificationTokenInvalidError = ErrorResult & {
	__typename?: 'VerificationTokenInvalidError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

export type VerifyCustomerAccountResult =
	| CurrentUser
	| MissingPasswordError
	| NativeAuthStrategyError
	| PasswordAlreadySetError
	| PasswordValidationError
	| VerificationTokenExpiredError
	| VerificationTokenInvalidError;

export type VoteOnReviewError = ErrorResult & {
	__typename?: 'VoteOnReviewError';
	errorCode: ErrorCode;
	message: Scalars['String']['output'];
};

export type VoteOnReviewResult = Success | VoteOnReviewError;

export type Zone = Node & {
	__typename?: 'Zone';
	createdAt: Scalars['DateTime']['output'];
	customFields?: Maybe<Scalars['JSON']['output']>;
	id: Scalars['ID']['output'];
	members: Array<Region>;
	name: Scalars['String']['output'];
	updatedAt: Scalars['DateTime']['output'];
};

export type AuthenticateMutationVariables = Exact<{
	input: AuthenticationInput;
	rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type AuthenticateMutation = {
	__typename?: 'Mutation';
	authenticate:
		| { __typename: 'CurrentUser'; id: string; identifier: string }
		| { __typename: 'InvalidCredentialsError'; errorCode: ErrorCode; message: string }
		| { __typename: 'NotVerifiedError'; errorCode: ErrorCode; message: string };
};

export type LoginMutationVariables = Exact<{
	email: Scalars['String']['input'];
	password: Scalars['String']['input'];
	rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type LoginMutation = {
	__typename?: 'Mutation';
	login:
		| { __typename: 'CurrentUser'; id: string; identifier: string }
		| { __typename: 'InvalidCredentialsError'; errorCode: ErrorCode; message: string }
		| { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
		| { __typename: 'NotVerifiedError'; errorCode: ErrorCode; message: string };
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = {
	__typename?: 'Mutation';
	logout: { __typename?: 'Success'; success: boolean };
};

export type RegisterCustomerAccountMutationVariables = Exact<{
	input: RegisterCustomerInput;
}>;

export type RegisterCustomerAccountMutation = {
	__typename?: 'Mutation';
	registerCustomerAccount:
		| { __typename: 'MissingPasswordError'; errorCode: ErrorCode; message: string }
		| { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
		| { __typename: 'PasswordValidationError'; errorCode: ErrorCode; message: string }
		| { __typename: 'Success'; success: boolean };
};

export type VerifyCustomerAccountMutationVariables = Exact<{
	token: Scalars['String']['input'];
	password?: InputMaybe<Scalars['String']['input']>;
}>;

export type VerifyCustomerAccountMutation = {
	__typename?: 'Mutation';
	verifyCustomerAccount:
		| { __typename: 'CurrentUser'; id: string; identifier: string }
		| { __typename: 'MissingPasswordError'; errorCode: ErrorCode; message: string }
		| { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
		| { __typename: 'PasswordAlreadySetError'; errorCode: ErrorCode; message: string }
		| { __typename: 'PasswordValidationError'; errorCode: ErrorCode; message: string }
		| { __typename: 'VerificationTokenExpiredError'; errorCode: ErrorCode; message: string }
		| { __typename: 'VerificationTokenInvalidError'; errorCode: ErrorCode; message: string };
};

export type UpdateCustomerMutationVariables = Exact<{
	input: UpdateCustomerInput;
}>;

export type UpdateCustomerMutation = {
	__typename?: 'Mutation';
	updateCustomer: { __typename: 'Customer' };
};

export type RequestUpdateCustomerEmailAddressMutationVariables = Exact<{
	password: Scalars['String']['input'];
	newEmailAddress: Scalars['String']['input'];
}>;

export type RequestUpdateCustomerEmailAddressMutation = {
	__typename?: 'Mutation';
	requestUpdateCustomerEmailAddress:
		| { __typename: 'EmailAddressConflictError'; errorCode: ErrorCode; message: string }
		| { __typename: 'InvalidCredentialsError'; errorCode: ErrorCode; message: string }
		| { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
		| { __typename: 'Success' };
};

export type UpdateCustomerEmailAddressMutationVariables = Exact<{
	token: Scalars['String']['input'];
}>;

export type UpdateCustomerEmailAddressMutation = {
	__typename?: 'Mutation';
	updateCustomerEmailAddress:
		| { __typename: 'IdentifierChangeTokenExpiredError'; errorCode: ErrorCode; message: string }
		| { __typename: 'IdentifierChangeTokenInvalidError'; errorCode: ErrorCode; message: string }
		| { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
		| { __typename: 'Success' };
};

export type ResetPasswordMutationVariables = Exact<{
	token: Scalars['String']['input'];
	password: Scalars['String']['input'];
}>;

export type ResetPasswordMutation = {
	__typename?: 'Mutation';
	resetPassword:
		| { __typename: 'CurrentUser'; id: string; identifier: string }
		| { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
		| { __typename: 'NotVerifiedError'; errorCode: ErrorCode; message: string }
		| { __typename: 'PasswordResetTokenExpiredError'; errorCode: ErrorCode; message: string }
		| { __typename: 'PasswordResetTokenInvalidError'; errorCode: ErrorCode; message: string }
		| { __typename: 'PasswordValidationError'; errorCode: ErrorCode; message: string };
};

export type RequestPasswordResetMutationVariables = Exact<{
	emailAddress: Scalars['String']['input'];
}>;

export type RequestPasswordResetMutation = {
	__typename?: 'Mutation';
	requestPasswordReset?:
		| { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
		| { __typename: 'Success'; success: boolean }
		| null;
};

export type ValidateAddressByShippoQueryVariables = Exact<{
	address: VendureAddressInput;
}>;

export type ValidateAddressByShippoQuery = {
	__typename?: 'Query';
	validateAddressByShippo:
		| {
				__typename: 'ShippoAddressValidationResult';
				fullName?: string | null;
				city?: string | null;
				company?: string | null;
				country?: string | null;
				countryCode?: string | null;
				phoneNumber?: string | null;
				postalCode?: string | null;
				province?: string | null;
				streetLine1?: string | null;
				streetLine2?: string | null;
				validationResults?: {
					__typename?: 'AddressValidationResults';
					isValid?: boolean | null;
					messages?: Array<{
						__typename?: 'ShippoResponseMessage';
						code?: string | null;
						source?: string | null;
						text?: string | null;
					} | null> | null;
				} | null;
		  }
		| { __typename: 'ValidateAddressError'; errorCode: ErrorCode; message: string };
};

export type AvailableCountriesQueryVariables = Exact<{ [key: string]: never }>;

export type AvailableCountriesQuery = {
	__typename?: 'Query';
	availableCountries: Array<{ __typename?: 'Country'; id: string; name: string; code: string }>;
};

export type EligibleShippingMethodsQueryVariables = Exact<{ [key: string]: never }>;

export type EligibleShippingMethodsQuery = {
	__typename?: 'Query';
	eligibleShippingMethods: Array<{
		__typename?: 'ShippingMethodQuote';
		id: string;
		name: string;
		description: string;
		metadata?: any | null;
		price: any;
		priceWithTax: any;
	}>;
};

export type AddPaymentToOrderMutationVariables = Exact<{
	input: PaymentInput;
}>;

export type AddPaymentToOrderMutation = {
	__typename?: 'Mutation';
	addPaymentToOrder:
		| { __typename?: 'IneligiblePaymentMethodError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'NoActiveOrderError'; errorCode: ErrorCode; message: string }
		| {
				__typename: 'Order';
				id: string;
				code: string;
				active: boolean;
				createdAt: any;
				state: string;
				currencyCode: CurrencyCode;
				couponCodes: Array<string>;
				totalQuantity: number;
				subTotal: any;
				subTotalWithTax: any;
				shippingWithTax: any;
				totalWithTax: any;
				discounts: Array<{
					__typename?: 'Discount';
					type: AdjustmentType;
					description: string;
					amountWithTax: any;
				}>;
				taxSummary: Array<{
					__typename?: 'OrderTaxSummary';
					description: string;
					taxRate: number;
					taxTotal: any;
				}>;
				customer?: {
					__typename?: 'Customer';
					id: string;
					firstName: string;
					lastName: string;
					emailAddress: string;
				} | null;
				shippingAddress?: {
					__typename?: 'OrderAddress';
					fullName?: string | null;
					streetLine1?: string | null;
					streetLine2?: string | null;
					company?: string | null;
					city?: string | null;
					province?: string | null;
					postalCode?: string | null;
					countryCode?: string | null;
					phoneNumber?: string | null;
				} | null;
				shippingLines: Array<{
					__typename?: 'ShippingLine';
					priceWithTax: any;
					shippingMethod: { __typename?: 'ShippingMethod'; id: string; name: string };
				}>;
				lines: Array<{
					__typename?: 'OrderLine';
					id: string;
					unitPriceWithTax: any;
					linePriceWithTax: any;
					quantity: number;
					featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					productVariant: {
						__typename?: 'ProductVariant';
						id: string;
						name: string;
						price: any;
						product: {
							__typename?: 'Product';
							id: string;
							name: string;
							slug: string;
							customFields?: {
								__typename?: 'ProductCustomFields';
								customizableClass?: string | null;
							} | null;
						};
					};
					customFields?: {
						__typename?: 'OrderLineCustomFields';
						customizableOptionJson?: string | null;
						customizedImageAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					} | null;
				}>;
				customFields?: {
					__typename?: 'OrderCustomFields';
					promisedArrivalDays?: number | null;
				} | null;
		  }
		| { __typename?: 'OrderPaymentStateError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'OrderStateTransitionError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'PaymentDeclinedError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'PaymentFailedError'; errorCode: ErrorCode; message: string };
};

export type TransitionOrderToStateMutationVariables = Exact<{
	state: Scalars['String']['input'];
}>;

export type TransitionOrderToStateMutation = {
	__typename?: 'Mutation';
	transitionOrderToState?:
		| {
				__typename: 'Order';
				id: string;
				code: string;
				active: boolean;
				createdAt: any;
				state: string;
				currencyCode: CurrencyCode;
				couponCodes: Array<string>;
				totalQuantity: number;
				subTotal: any;
				subTotalWithTax: any;
				shippingWithTax: any;
				totalWithTax: any;
				discounts: Array<{
					__typename?: 'Discount';
					type: AdjustmentType;
					description: string;
					amountWithTax: any;
				}>;
				taxSummary: Array<{
					__typename?: 'OrderTaxSummary';
					description: string;
					taxRate: number;
					taxTotal: any;
				}>;
				customer?: {
					__typename?: 'Customer';
					id: string;
					firstName: string;
					lastName: string;
					emailAddress: string;
				} | null;
				shippingAddress?: {
					__typename?: 'OrderAddress';
					fullName?: string | null;
					streetLine1?: string | null;
					streetLine2?: string | null;
					company?: string | null;
					city?: string | null;
					province?: string | null;
					postalCode?: string | null;
					countryCode?: string | null;
					phoneNumber?: string | null;
				} | null;
				shippingLines: Array<{
					__typename?: 'ShippingLine';
					priceWithTax: any;
					shippingMethod: { __typename?: 'ShippingMethod'; id: string; name: string };
				}>;
				lines: Array<{
					__typename?: 'OrderLine';
					id: string;
					unitPriceWithTax: any;
					linePriceWithTax: any;
					quantity: number;
					featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					productVariant: {
						__typename?: 'ProductVariant';
						id: string;
						name: string;
						price: any;
						product: {
							__typename?: 'Product';
							id: string;
							name: string;
							slug: string;
							customFields?: {
								__typename?: 'ProductCustomFields';
								customizableClass?: string | null;
							} | null;
						};
					};
					customFields?: {
						__typename?: 'OrderLineCustomFields';
						customizableOptionJson?: string | null;
						customizedImageAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					} | null;
				}>;
				customFields?: {
					__typename?: 'OrderCustomFields';
					promisedArrivalDays?: number | null;
				} | null;
		  }
		| { __typename?: 'OrderStateTransitionError'; errorCode: ErrorCode; message: string }
		| null;
};

export type EligiblePaymentMethodsQueryVariables = Exact<{ [key: string]: never }>;

export type EligiblePaymentMethodsQuery = {
	__typename?: 'Query';
	eligiblePaymentMethods: Array<{
		__typename?: 'PaymentMethodQuote';
		id: string;
		code: string;
		name: string;
		description: string;
		eligibilityMessage?: string | null;
		isEligible: boolean;
	}>;
};

export type CreateStripePaymentIntentMutationVariables = Exact<{ [key: string]: never }>;

export type CreateStripePaymentIntentMutation = {
	__typename?: 'Mutation';
	createStripePaymentIntent?: string | null;
};

export type GenerateBraintreeClientTokenQueryVariables = Exact<{
	orderId: Scalars['ID']['input'];
	includeCustomerId: Scalars['Boolean']['input'];
}>;

export type GenerateBraintreeClientTokenQuery = {
	__typename?: 'Query';
	generateBraintreeClientToken?: string | null;
};

export type CollectionsQueryVariables = Exact<{ [key: string]: never }>;

export type CollectionsQuery = {
	__typename?: 'Query';
	collections: {
		__typename?: 'CollectionList';
		items: Array<{
			__typename?: 'Collection';
			id: string;
			name: string;
			slug: string;
			parent?: { __typename?: 'Collection'; name: string } | null;
			featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
		}>;
	};
};

export type CollectionQueryVariables = Exact<{
	slug?: InputMaybe<Scalars['String']['input']>;
	id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type CollectionQuery = {
	__typename?: 'Query';
	collection?: {
		__typename?: 'Collection';
		id: string;
		name: string;
		slug: string;
		breadcrumbs: Array<{
			__typename?: 'CollectionBreadcrumb';
			id: string;
			name: string;
			slug: string;
		}>;
		children?: Array<{
			__typename?: 'Collection';
			id: string;
			name: string;
			slug: string;
			featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
		}> | null;
	} | null;
};

export type ActiveCustomerAddressesQueryVariables = Exact<{ [key: string]: never }>;

export type ActiveCustomerAddressesQuery = {
	__typename?: 'Query';
	activeCustomer?: {
		__typename?: 'Customer';
		id: string;
		addresses?: Array<{
			__typename?: 'Address';
			id: string;
			fullName?: string | null;
			company?: string | null;
			streetLine1: string;
			streetLine2?: string | null;
			city?: string | null;
			province?: string | null;
			postalCode?: string | null;
			phoneNumber?: string | null;
			defaultShippingAddress?: boolean | null;
			defaultBillingAddress?: boolean | null;
			country: { __typename?: 'Country'; code: string };
		}> | null;
	} | null;
};

export type ActiveCustomerQueryVariables = Exact<{ [key: string]: never }>;

export type ActiveCustomerQuery = {
	__typename?: 'Query';
	activeCustomer?: {
		__typename?: 'Customer';
		id: string;
		title?: string | null;
		firstName: string;
		lastName: string;
		emailAddress: string;
		phoneNumber?: string | null;
		customFields?: {
			__typename?: 'CustomerCustomFields';
			upvoteReviews?: Array<string> | null;
		} | null;
	} | null;
};

export type CreateCustomerAddressMutationVariables = Exact<{
	input: CreateAddressInput;
}>;

export type CreateCustomerAddressMutation = {
	__typename?: 'Mutation';
	createCustomerAddress: {
		__typename: 'Address';
		id: string;
		fullName?: string | null;
		company?: string | null;
		streetLine1: string;
		streetLine2?: string | null;
		city?: string | null;
		province?: string | null;
		postalCode?: string | null;
		phoneNumber?: string | null;
		defaultShippingAddress?: boolean | null;
		defaultBillingAddress?: boolean | null;
		country: { __typename: 'Country'; id: string; code: string; name: string };
	};
};

export type AddressFragment = {
	__typename: 'Address';
	id: string;
	fullName?: string | null;
	company?: string | null;
	streetLine1: string;
	streetLine2?: string | null;
	city?: string | null;
	province?: string | null;
	postalCode?: string | null;
	phoneNumber?: string | null;
	defaultShippingAddress?: boolean | null;
	defaultBillingAddress?: boolean | null;
	country: { __typename: 'Country'; id: string; code: string; name: string };
};

export type ActiveCustomerOrdersQueryVariables = Exact<{
	options?: InputMaybe<OrderListOptions>;
}>;

export type ActiveCustomerOrdersQuery = {
	__typename?: 'Query';
	activeCustomer?: {
		__typename?: 'Customer';
		id: string;
		orders: {
			__typename?: 'OrderList';
			totalItems: number;
			items: Array<{
				__typename?: 'Order';
				id: string;
				createdAt: any;
				code: string;
				state: string;
				totalWithTax: any;
				currencyCode: CurrencyCode;
				lines: Array<{
					__typename?: 'OrderLine';
					featuredAsset?: { __typename?: 'Asset'; preview: string } | null;
					productVariant: { __typename?: 'ProductVariant'; id: string; name: string };
				}>;
			}>;
		};
	} | null;
};

export type UpdateCustomerPasswordMutationVariables = Exact<{
	currentPassword: Scalars['String']['input'];
	newPassword: Scalars['String']['input'];
}>;

export type UpdateCustomerPasswordMutation = {
	__typename?: 'Mutation';
	updateCustomerPassword:
		| { __typename: 'InvalidCredentialsError'; errorCode: ErrorCode; message: string }
		| { __typename: 'NativeAuthStrategyError'; errorCode: ErrorCode; message: string }
		| { __typename: 'PasswordValidationError'; errorCode: ErrorCode; message: string }
		| { __typename: 'Success'; success: boolean };
};

export type DeleteCustomerAddressMutationVariables = Exact<{
	id: Scalars['ID']['input'];
}>;

export type DeleteCustomerAddressMutation = {
	__typename?: 'Mutation';
	deleteCustomerAddress: { __typename?: 'Success'; success: boolean };
};

export type UpdateCustomerAddressMutationMutationVariables = Exact<{
	input: UpdateAddressInput;
}>;

export type UpdateCustomerAddressMutationMutation = {
	__typename?: 'Mutation';
	updateCustomerAddress: {
		__typename: 'Address';
		id: string;
		fullName?: string | null;
		company?: string | null;
		streetLine1: string;
		streetLine2?: string | null;
		city?: string | null;
		province?: string | null;
		postalCode?: string | null;
		phoneNumber?: string | null;
		defaultShippingAddress?: boolean | null;
		defaultBillingAddress?: boolean | null;
		country: { __typename: 'Country'; id: string; code: string; name: string };
	};
};

export type CreateCustomerAddressMutationMutationVariables = Exact<{
	input: CreateAddressInput;
}>;

export type CreateCustomerAddressMutationMutation = {
	__typename?: 'Mutation';
	createCustomerAddress: {
		__typename: 'Address';
		id: string;
		fullName?: string | null;
		company?: string | null;
		streetLine1: string;
		streetLine2?: string | null;
		city?: string | null;
		province?: string | null;
		postalCode?: string | null;
		phoneNumber?: string | null;
		defaultShippingAddress?: boolean | null;
		defaultBillingAddress?: boolean | null;
		country: { __typename: 'Country'; id: string; code: string; name: string };
	};
};

export type FontMenuFindAllQueryVariables = Exact<{ [key: string]: never }>;

export type FontMenuFindAllQuery = {
	__typename?: 'Query';
	fontMenuFindAll: Array<{
		__typename?: 'FontMenu';
		id: string;
		name: string;
		additiveFontId: string;
		subtractiveFontId: string;
		isDisabled: boolean;
	}>;
};

export type FilamentColorFindSupportedQueryVariables = Exact<{ [key: string]: never }>;

export type FilamentColorFindSupportedQuery = {
	__typename?: 'Query';
	filamentColorFindSupported: Array<{
		__typename?: 'FilamentColor';
		id: string;
		name: string;
		displayName: string;
		hexCode: string;
		isOutOfStock: boolean;
	}>;
};

export type CustomizableClassDefFindAllQueryVariables = Exact<{ [key: string]: never }>;

export type CustomizableClassDefFindAllQuery = {
	__typename?: 'Query';
	customizableClassDefFindAll: Array<{
		__typename?: 'CustomizableClassDef';
		name: string;
		optionDefinition: string;
	}>;
};

export type BatchAddCustomizedImagesToOrderMutationVariables = Exact<{
	files: Array<Scalars['Upload']['input']> | Scalars['Upload']['input'];
	orderLineIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;

export type BatchAddCustomizedImagesToOrderMutation = {
	__typename?: 'Mutation';
	batchAddCustomizedImagesToOrder:
		| {
				__typename?: 'BatchAddCustomizedImagesToOrderSuccess';
				message: string;
				orderLineIds: Array<string>;
				assetIds: Array<string>;
		  }
		| { __typename?: 'CreateCustomizedImageAssetError'; errorCode: ErrorCode; message: string };
};

export type SetOrderCustomFieldsMutationVariables = Exact<{
	input: UpdateOrderInput;
}>;

export type SetOrderCustomFieldsMutation = {
	__typename?: 'Mutation';
	setOrderCustomFields:
		| { __typename?: 'NoActiveOrderError'; errorCode: ErrorCode; message: string }
		| {
				__typename: 'Order';
				id: string;
				code: string;
				active: boolean;
				createdAt: any;
				state: string;
				currencyCode: CurrencyCode;
				couponCodes: Array<string>;
				totalQuantity: number;
				subTotal: any;
				subTotalWithTax: any;
				shippingWithTax: any;
				totalWithTax: any;
				discounts: Array<{
					__typename?: 'Discount';
					type: AdjustmentType;
					description: string;
					amountWithTax: any;
				}>;
				taxSummary: Array<{
					__typename?: 'OrderTaxSummary';
					description: string;
					taxRate: number;
					taxTotal: any;
				}>;
				customer?: {
					__typename?: 'Customer';
					id: string;
					firstName: string;
					lastName: string;
					emailAddress: string;
				} | null;
				shippingAddress?: {
					__typename?: 'OrderAddress';
					fullName?: string | null;
					streetLine1?: string | null;
					streetLine2?: string | null;
					company?: string | null;
					city?: string | null;
					province?: string | null;
					postalCode?: string | null;
					countryCode?: string | null;
					phoneNumber?: string | null;
				} | null;
				shippingLines: Array<{
					__typename?: 'ShippingLine';
					priceWithTax: any;
					shippingMethod: { __typename?: 'ShippingMethod'; id: string; name: string };
				}>;
				lines: Array<{
					__typename?: 'OrderLine';
					id: string;
					unitPriceWithTax: any;
					linePriceWithTax: any;
					quantity: number;
					featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					productVariant: {
						__typename?: 'ProductVariant';
						id: string;
						name: string;
						price: any;
						product: {
							__typename?: 'Product';
							id: string;
							name: string;
							slug: string;
							customFields?: {
								__typename?: 'ProductCustomFields';
								customizableClass?: string | null;
							} | null;
						};
					};
					customFields?: {
						__typename?: 'OrderLineCustomFields';
						customizableOptionJson?: string | null;
						customizedImageAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					} | null;
				}>;
				customFields?: {
					__typename?: 'OrderCustomFields';
					promisedArrivalDays?: number | null;
				} | null;
		  };
};

export type ApplyCouponCodeMutationVariables = Exact<{
	couponCode: Scalars['String']['input'];
}>;

export type ApplyCouponCodeMutation = {
	__typename?: 'Mutation';
	applyCouponCode:
		| { __typename?: 'CouponCodeExpiredError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'CouponCodeInvalidError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'CouponCodeLimitError'; errorCode: ErrorCode; message: string }
		| {
				__typename: 'Order';
				id: string;
				code: string;
				active: boolean;
				createdAt: any;
				state: string;
				currencyCode: CurrencyCode;
				couponCodes: Array<string>;
				totalQuantity: number;
				subTotal: any;
				subTotalWithTax: any;
				shippingWithTax: any;
				totalWithTax: any;
				discounts: Array<{
					__typename?: 'Discount';
					type: AdjustmentType;
					description: string;
					amountWithTax: any;
				}>;
				taxSummary: Array<{
					__typename?: 'OrderTaxSummary';
					description: string;
					taxRate: number;
					taxTotal: any;
				}>;
				customer?: {
					__typename?: 'Customer';
					id: string;
					firstName: string;
					lastName: string;
					emailAddress: string;
				} | null;
				shippingAddress?: {
					__typename?: 'OrderAddress';
					fullName?: string | null;
					streetLine1?: string | null;
					streetLine2?: string | null;
					company?: string | null;
					city?: string | null;
					province?: string | null;
					postalCode?: string | null;
					countryCode?: string | null;
					phoneNumber?: string | null;
				} | null;
				shippingLines: Array<{
					__typename?: 'ShippingLine';
					priceWithTax: any;
					shippingMethod: { __typename?: 'ShippingMethod'; id: string; name: string };
				}>;
				lines: Array<{
					__typename?: 'OrderLine';
					id: string;
					unitPriceWithTax: any;
					linePriceWithTax: any;
					quantity: number;
					featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					productVariant: {
						__typename?: 'ProductVariant';
						id: string;
						name: string;
						price: any;
						product: {
							__typename?: 'Product';
							id: string;
							name: string;
							slug: string;
							customFields?: {
								__typename?: 'ProductCustomFields';
								customizableClass?: string | null;
							} | null;
						};
					};
					customFields?: {
						__typename?: 'OrderLineCustomFields';
						customizableOptionJson?: string | null;
						customizedImageAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					} | null;
				}>;
				customFields?: {
					__typename?: 'OrderCustomFields';
					promisedArrivalDays?: number | null;
				} | null;
		  };
};

export type RemoveCouponCodeMutationVariables = Exact<{
	couponCode: Scalars['String']['input'];
}>;

export type RemoveCouponCodeMutation = {
	__typename?: 'Mutation';
	removeCouponCode?: {
		__typename: 'Order';
		id: string;
		code: string;
		active: boolean;
		createdAt: any;
		state: string;
		currencyCode: CurrencyCode;
		couponCodes: Array<string>;
		totalQuantity: number;
		subTotal: any;
		subTotalWithTax: any;
		shippingWithTax: any;
		totalWithTax: any;
		discounts: Array<{
			__typename?: 'Discount';
			type: AdjustmentType;
			description: string;
			amountWithTax: any;
		}>;
		taxSummary: Array<{
			__typename?: 'OrderTaxSummary';
			description: string;
			taxRate: number;
			taxTotal: any;
		}>;
		customer?: {
			__typename?: 'Customer';
			id: string;
			firstName: string;
			lastName: string;
			emailAddress: string;
		} | null;
		shippingAddress?: {
			__typename?: 'OrderAddress';
			fullName?: string | null;
			streetLine1?: string | null;
			streetLine2?: string | null;
			company?: string | null;
			city?: string | null;
			province?: string | null;
			postalCode?: string | null;
			countryCode?: string | null;
			phoneNumber?: string | null;
		} | null;
		shippingLines: Array<{
			__typename?: 'ShippingLine';
			priceWithTax: any;
			shippingMethod: { __typename?: 'ShippingMethod'; id: string; name: string };
		}>;
		lines: Array<{
			__typename?: 'OrderLine';
			id: string;
			unitPriceWithTax: any;
			linePriceWithTax: any;
			quantity: number;
			featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
			productVariant: {
				__typename?: 'ProductVariant';
				id: string;
				name: string;
				price: any;
				product: {
					__typename?: 'Product';
					id: string;
					name: string;
					slug: string;
					customFields?: {
						__typename?: 'ProductCustomFields';
						customizableClass?: string | null;
					} | null;
				};
			};
			customFields?: {
				__typename?: 'OrderLineCustomFields';
				customizableOptionJson?: string | null;
				customizedImageAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
			} | null;
		}>;
		customFields?: { __typename?: 'OrderCustomFields'; promisedArrivalDays?: number | null } | null;
	} | null;
};

export type SetOrderShippingAddressMutationVariables = Exact<{
	input: CreateAddressInput;
}>;

export type SetOrderShippingAddressMutation = {
	__typename?: 'Mutation';
	setOrderShippingAddress:
		| { __typename?: 'NoActiveOrderError'; errorCode: ErrorCode; message: string }
		| {
				__typename: 'Order';
				id: string;
				code: string;
				active: boolean;
				createdAt: any;
				state: string;
				currencyCode: CurrencyCode;
				couponCodes: Array<string>;
				totalQuantity: number;
				subTotal: any;
				subTotalWithTax: any;
				shippingWithTax: any;
				totalWithTax: any;
				discounts: Array<{
					__typename?: 'Discount';
					type: AdjustmentType;
					description: string;
					amountWithTax: any;
				}>;
				taxSummary: Array<{
					__typename?: 'OrderTaxSummary';
					description: string;
					taxRate: number;
					taxTotal: any;
				}>;
				customer?: {
					__typename?: 'Customer';
					id: string;
					firstName: string;
					lastName: string;
					emailAddress: string;
				} | null;
				shippingAddress?: {
					__typename?: 'OrderAddress';
					fullName?: string | null;
					streetLine1?: string | null;
					streetLine2?: string | null;
					company?: string | null;
					city?: string | null;
					province?: string | null;
					postalCode?: string | null;
					countryCode?: string | null;
					phoneNumber?: string | null;
				} | null;
				shippingLines: Array<{
					__typename?: 'ShippingLine';
					priceWithTax: any;
					shippingMethod: { __typename?: 'ShippingMethod'; id: string; name: string };
				}>;
				lines: Array<{
					__typename?: 'OrderLine';
					id: string;
					unitPriceWithTax: any;
					linePriceWithTax: any;
					quantity: number;
					featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					productVariant: {
						__typename?: 'ProductVariant';
						id: string;
						name: string;
						price: any;
						product: {
							__typename?: 'Product';
							id: string;
							name: string;
							slug: string;
							customFields?: {
								__typename?: 'ProductCustomFields';
								customizableClass?: string | null;
							} | null;
						};
					};
					customFields?: {
						__typename?: 'OrderLineCustomFields';
						customizableOptionJson?: string | null;
						customizedImageAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					} | null;
				}>;
				customFields?: {
					__typename?: 'OrderCustomFields';
					promisedArrivalDays?: number | null;
				} | null;
		  };
};

export type SetCustomerForOrderMutationVariables = Exact<{
	input: CreateCustomerInput;
}>;

export type SetCustomerForOrderMutation = {
	__typename?: 'Mutation';
	setCustomerForOrder:
		| { __typename?: 'AlreadyLoggedInError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'EmailAddressConflictError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'GuestCheckoutError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'NoActiveOrderError'; errorCode: ErrorCode; message: string }
		| {
				__typename: 'Order';
				id: string;
				code: string;
				active: boolean;
				createdAt: any;
				state: string;
				currencyCode: CurrencyCode;
				couponCodes: Array<string>;
				totalQuantity: number;
				subTotal: any;
				subTotalWithTax: any;
				shippingWithTax: any;
				totalWithTax: any;
				discounts: Array<{
					__typename?: 'Discount';
					type: AdjustmentType;
					description: string;
					amountWithTax: any;
				}>;
				taxSummary: Array<{
					__typename?: 'OrderTaxSummary';
					description: string;
					taxRate: number;
					taxTotal: any;
				}>;
				customer?: {
					__typename?: 'Customer';
					id: string;
					firstName: string;
					lastName: string;
					emailAddress: string;
				} | null;
				shippingAddress?: {
					__typename?: 'OrderAddress';
					fullName?: string | null;
					streetLine1?: string | null;
					streetLine2?: string | null;
					company?: string | null;
					city?: string | null;
					province?: string | null;
					postalCode?: string | null;
					countryCode?: string | null;
					phoneNumber?: string | null;
				} | null;
				shippingLines: Array<{
					__typename?: 'ShippingLine';
					priceWithTax: any;
					shippingMethod: { __typename?: 'ShippingMethod'; id: string; name: string };
				}>;
				lines: Array<{
					__typename?: 'OrderLine';
					id: string;
					unitPriceWithTax: any;
					linePriceWithTax: any;
					quantity: number;
					featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					productVariant: {
						__typename?: 'ProductVariant';
						id: string;
						name: string;
						price: any;
						product: {
							__typename?: 'Product';
							id: string;
							name: string;
							slug: string;
							customFields?: {
								__typename?: 'ProductCustomFields';
								customizableClass?: string | null;
							} | null;
						};
					};
					customFields?: {
						__typename?: 'OrderLineCustomFields';
						customizableOptionJson?: string | null;
						customizedImageAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					} | null;
				}>;
				customFields?: {
					__typename?: 'OrderCustomFields';
					promisedArrivalDays?: number | null;
				} | null;
		  };
};

export type AddItemToOrderMutationVariables = Exact<{
	productVariantId: Scalars['ID']['input'];
	quantity: Scalars['Int']['input'];
	customFields?: InputMaybe<OrderLineCustomFieldsInput>;
}>;

export type AddItemToOrderMutation = {
	__typename?: 'Mutation';
	addItemToOrder:
		| { __typename?: 'InsufficientStockError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'NegativeQuantityError'; errorCode: ErrorCode; message: string }
		| {
				__typename: 'Order';
				id: string;
				code: string;
				active: boolean;
				createdAt: any;
				state: string;
				currencyCode: CurrencyCode;
				couponCodes: Array<string>;
				totalQuantity: number;
				subTotal: any;
				subTotalWithTax: any;
				shippingWithTax: any;
				totalWithTax: any;
				discounts: Array<{
					__typename?: 'Discount';
					type: AdjustmentType;
					description: string;
					amountWithTax: any;
				}>;
				taxSummary: Array<{
					__typename?: 'OrderTaxSummary';
					description: string;
					taxRate: number;
					taxTotal: any;
				}>;
				customer?: {
					__typename?: 'Customer';
					id: string;
					firstName: string;
					lastName: string;
					emailAddress: string;
				} | null;
				shippingAddress?: {
					__typename?: 'OrderAddress';
					fullName?: string | null;
					streetLine1?: string | null;
					streetLine2?: string | null;
					company?: string | null;
					city?: string | null;
					province?: string | null;
					postalCode?: string | null;
					countryCode?: string | null;
					phoneNumber?: string | null;
				} | null;
				shippingLines: Array<{
					__typename?: 'ShippingLine';
					priceWithTax: any;
					shippingMethod: { __typename?: 'ShippingMethod'; id: string; name: string };
				}>;
				lines: Array<{
					__typename?: 'OrderLine';
					id: string;
					unitPriceWithTax: any;
					linePriceWithTax: any;
					quantity: number;
					featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					productVariant: {
						__typename?: 'ProductVariant';
						id: string;
						name: string;
						price: any;
						product: {
							__typename?: 'Product';
							id: string;
							name: string;
							slug: string;
							customFields?: {
								__typename?: 'ProductCustomFields';
								customizableClass?: string | null;
							} | null;
						};
					};
					customFields?: {
						__typename?: 'OrderLineCustomFields';
						customizableOptionJson?: string | null;
						customizedImageAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					} | null;
				}>;
				customFields?: {
					__typename?: 'OrderCustomFields';
					promisedArrivalDays?: number | null;
				} | null;
		  }
		| { __typename?: 'OrderInterceptorError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'OrderLimitError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'OrderModificationError'; errorCode: ErrorCode; message: string };
};

export type SetOrderShippingMethodMutationVariables = Exact<{
	shippingMethodId: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;

export type SetOrderShippingMethodMutation = {
	__typename?: 'Mutation';
	setOrderShippingMethod:
		| { __typename?: 'IneligibleShippingMethodError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'NoActiveOrderError'; errorCode: ErrorCode; message: string }
		| {
				__typename: 'Order';
				id: string;
				code: string;
				active: boolean;
				createdAt: any;
				state: string;
				currencyCode: CurrencyCode;
				couponCodes: Array<string>;
				totalQuantity: number;
				subTotal: any;
				subTotalWithTax: any;
				shippingWithTax: any;
				totalWithTax: any;
				discounts: Array<{
					__typename?: 'Discount';
					type: AdjustmentType;
					description: string;
					amountWithTax: any;
				}>;
				taxSummary: Array<{
					__typename?: 'OrderTaxSummary';
					description: string;
					taxRate: number;
					taxTotal: any;
				}>;
				customer?: {
					__typename?: 'Customer';
					id: string;
					firstName: string;
					lastName: string;
					emailAddress: string;
				} | null;
				shippingAddress?: {
					__typename?: 'OrderAddress';
					fullName?: string | null;
					streetLine1?: string | null;
					streetLine2?: string | null;
					company?: string | null;
					city?: string | null;
					province?: string | null;
					postalCode?: string | null;
					countryCode?: string | null;
					phoneNumber?: string | null;
				} | null;
				shippingLines: Array<{
					__typename?: 'ShippingLine';
					priceWithTax: any;
					shippingMethod: { __typename?: 'ShippingMethod'; id: string; name: string };
				}>;
				lines: Array<{
					__typename?: 'OrderLine';
					id: string;
					unitPriceWithTax: any;
					linePriceWithTax: any;
					quantity: number;
					featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					productVariant: {
						__typename?: 'ProductVariant';
						id: string;
						name: string;
						price: any;
						product: {
							__typename?: 'Product';
							id: string;
							name: string;
							slug: string;
							customFields?: {
								__typename?: 'ProductCustomFields';
								customizableClass?: string | null;
							} | null;
						};
					};
					customFields?: {
						__typename?: 'OrderLineCustomFields';
						customizableOptionJson?: string | null;
						customizedImageAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					} | null;
				}>;
				customFields?: {
					__typename?: 'OrderCustomFields';
					promisedArrivalDays?: number | null;
				} | null;
		  }
		| { __typename?: 'OrderModificationError'; errorCode: ErrorCode; message: string };
};

export type OrderDetailFragment = {
	__typename: 'Order';
	id: string;
	code: string;
	active: boolean;
	createdAt: any;
	state: string;
	currencyCode: CurrencyCode;
	couponCodes: Array<string>;
	totalQuantity: number;
	subTotal: any;
	subTotalWithTax: any;
	shippingWithTax: any;
	totalWithTax: any;
	discounts: Array<{
		__typename?: 'Discount';
		type: AdjustmentType;
		description: string;
		amountWithTax: any;
	}>;
	taxSummary: Array<{
		__typename?: 'OrderTaxSummary';
		description: string;
		taxRate: number;
		taxTotal: any;
	}>;
	customer?: {
		__typename?: 'Customer';
		id: string;
		firstName: string;
		lastName: string;
		emailAddress: string;
	} | null;
	shippingAddress?: {
		__typename?: 'OrderAddress';
		fullName?: string | null;
		streetLine1?: string | null;
		streetLine2?: string | null;
		company?: string | null;
		city?: string | null;
		province?: string | null;
		postalCode?: string | null;
		countryCode?: string | null;
		phoneNumber?: string | null;
	} | null;
	shippingLines: Array<{
		__typename?: 'ShippingLine';
		priceWithTax: any;
		shippingMethod: { __typename?: 'ShippingMethod'; id: string; name: string };
	}>;
	lines: Array<{
		__typename?: 'OrderLine';
		id: string;
		unitPriceWithTax: any;
		linePriceWithTax: any;
		quantity: number;
		featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
		productVariant: {
			__typename?: 'ProductVariant';
			id: string;
			name: string;
			price: any;
			product: {
				__typename?: 'Product';
				id: string;
				name: string;
				slug: string;
				customFields?: {
					__typename?: 'ProductCustomFields';
					customizableClass?: string | null;
				} | null;
			};
		};
		customFields?: {
			__typename?: 'OrderLineCustomFields';
			customizableOptionJson?: string | null;
			customizedImageAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
		} | null;
	}>;
	customFields?: { __typename?: 'OrderCustomFields'; promisedArrivalDays?: number | null } | null;
};

export type AdjustOrderLineMutationVariables = Exact<{
	orderLineId: Scalars['ID']['input'];
	quantity: Scalars['Int']['input'];
}>;

export type AdjustOrderLineMutation = {
	__typename?: 'Mutation';
	adjustOrderLine:
		| { __typename?: 'InsufficientStockError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'NegativeQuantityError'; errorCode: ErrorCode; message: string }
		| {
				__typename: 'Order';
				id: string;
				code: string;
				active: boolean;
				createdAt: any;
				state: string;
				currencyCode: CurrencyCode;
				couponCodes: Array<string>;
				totalQuantity: number;
				subTotal: any;
				subTotalWithTax: any;
				shippingWithTax: any;
				totalWithTax: any;
				discounts: Array<{
					__typename?: 'Discount';
					type: AdjustmentType;
					description: string;
					amountWithTax: any;
				}>;
				taxSummary: Array<{
					__typename?: 'OrderTaxSummary';
					description: string;
					taxRate: number;
					taxTotal: any;
				}>;
				customer?: {
					__typename?: 'Customer';
					id: string;
					firstName: string;
					lastName: string;
					emailAddress: string;
				} | null;
				shippingAddress?: {
					__typename?: 'OrderAddress';
					fullName?: string | null;
					streetLine1?: string | null;
					streetLine2?: string | null;
					company?: string | null;
					city?: string | null;
					province?: string | null;
					postalCode?: string | null;
					countryCode?: string | null;
					phoneNumber?: string | null;
				} | null;
				shippingLines: Array<{
					__typename?: 'ShippingLine';
					priceWithTax: any;
					shippingMethod: { __typename?: 'ShippingMethod'; id: string; name: string };
				}>;
				lines: Array<{
					__typename?: 'OrderLine';
					id: string;
					unitPriceWithTax: any;
					linePriceWithTax: any;
					quantity: number;
					featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					productVariant: {
						__typename?: 'ProductVariant';
						id: string;
						name: string;
						price: any;
						product: {
							__typename?: 'Product';
							id: string;
							name: string;
							slug: string;
							customFields?: {
								__typename?: 'ProductCustomFields';
								customizableClass?: string | null;
							} | null;
						};
					};
					customFields?: {
						__typename?: 'OrderLineCustomFields';
						customizableOptionJson?: string | null;
						customizedImageAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					} | null;
				}>;
				customFields?: {
					__typename?: 'OrderCustomFields';
					promisedArrivalDays?: number | null;
				} | null;
		  }
		| { __typename?: 'OrderInterceptorError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'OrderLimitError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'OrderModificationError'; errorCode: ErrorCode; message: string };
};

export type RemoveOrderLineMutationVariables = Exact<{
	orderLineId: Scalars['ID']['input'];
}>;

export type RemoveOrderLineMutation = {
	__typename?: 'Mutation';
	removeOrderLine:
		| {
				__typename: 'Order';
				id: string;
				code: string;
				active: boolean;
				createdAt: any;
				state: string;
				currencyCode: CurrencyCode;
				couponCodes: Array<string>;
				totalQuantity: number;
				subTotal: any;
				subTotalWithTax: any;
				shippingWithTax: any;
				totalWithTax: any;
				discounts: Array<{
					__typename?: 'Discount';
					type: AdjustmentType;
					description: string;
					amountWithTax: any;
				}>;
				taxSummary: Array<{
					__typename?: 'OrderTaxSummary';
					description: string;
					taxRate: number;
					taxTotal: any;
				}>;
				customer?: {
					__typename?: 'Customer';
					id: string;
					firstName: string;
					lastName: string;
					emailAddress: string;
				} | null;
				shippingAddress?: {
					__typename?: 'OrderAddress';
					fullName?: string | null;
					streetLine1?: string | null;
					streetLine2?: string | null;
					company?: string | null;
					city?: string | null;
					province?: string | null;
					postalCode?: string | null;
					countryCode?: string | null;
					phoneNumber?: string | null;
				} | null;
				shippingLines: Array<{
					__typename?: 'ShippingLine';
					priceWithTax: any;
					shippingMethod: { __typename?: 'ShippingMethod'; id: string; name: string };
				}>;
				lines: Array<{
					__typename?: 'OrderLine';
					id: string;
					unitPriceWithTax: any;
					linePriceWithTax: any;
					quantity: number;
					featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					productVariant: {
						__typename?: 'ProductVariant';
						id: string;
						name: string;
						price: any;
						product: {
							__typename?: 'Product';
							id: string;
							name: string;
							slug: string;
							customFields?: {
								__typename?: 'ProductCustomFields';
								customizableClass?: string | null;
							} | null;
						};
					};
					customFields?: {
						__typename?: 'OrderLineCustomFields';
						customizableOptionJson?: string | null;
						customizedImageAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
					} | null;
				}>;
				customFields?: {
					__typename?: 'OrderCustomFields';
					promisedArrivalDays?: number | null;
				} | null;
		  }
		| { __typename?: 'OrderInterceptorError'; errorCode: ErrorCode; message: string }
		| { __typename?: 'OrderModificationError'; errorCode: ErrorCode; message: string };
};

export type ActiveOrderQueryVariables = Exact<{ [key: string]: never }>;

export type ActiveOrderQuery = {
	__typename?: 'Query';
	activeOrder?: {
		__typename: 'Order';
		id: string;
		code: string;
		active: boolean;
		createdAt: any;
		state: string;
		currencyCode: CurrencyCode;
		couponCodes: Array<string>;
		totalQuantity: number;
		subTotal: any;
		subTotalWithTax: any;
		shippingWithTax: any;
		totalWithTax: any;
		discounts: Array<{
			__typename?: 'Discount';
			type: AdjustmentType;
			description: string;
			amountWithTax: any;
		}>;
		taxSummary: Array<{
			__typename?: 'OrderTaxSummary';
			description: string;
			taxRate: number;
			taxTotal: any;
		}>;
		customer?: {
			__typename?: 'Customer';
			id: string;
			firstName: string;
			lastName: string;
			emailAddress: string;
		} | null;
		shippingAddress?: {
			__typename?: 'OrderAddress';
			fullName?: string | null;
			streetLine1?: string | null;
			streetLine2?: string | null;
			company?: string | null;
			city?: string | null;
			province?: string | null;
			postalCode?: string | null;
			countryCode?: string | null;
			phoneNumber?: string | null;
		} | null;
		shippingLines: Array<{
			__typename?: 'ShippingLine';
			priceWithTax: any;
			shippingMethod: { __typename?: 'ShippingMethod'; id: string; name: string };
		}>;
		lines: Array<{
			__typename?: 'OrderLine';
			id: string;
			unitPriceWithTax: any;
			linePriceWithTax: any;
			quantity: number;
			featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
			productVariant: {
				__typename?: 'ProductVariant';
				id: string;
				name: string;
				price: any;
				product: {
					__typename?: 'Product';
					id: string;
					name: string;
					slug: string;
					customFields?: {
						__typename?: 'ProductCustomFields';
						customizableClass?: string | null;
					} | null;
				};
			};
			customFields?: {
				__typename?: 'OrderLineCustomFields';
				customizableOptionJson?: string | null;
				customizedImageAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
			} | null;
		}>;
		customFields?: { __typename?: 'OrderCustomFields'; promisedArrivalDays?: number | null } | null;
	} | null;
};

export type OrderByCodeQueryVariables = Exact<{
	code: Scalars['String']['input'];
}>;

export type OrderByCodeQuery = {
	__typename?: 'Query';
	orderByCode?: {
		__typename: 'Order';
		id: string;
		code: string;
		active: boolean;
		createdAt: any;
		state: string;
		currencyCode: CurrencyCode;
		couponCodes: Array<string>;
		totalQuantity: number;
		subTotal: any;
		subTotalWithTax: any;
		shippingWithTax: any;
		totalWithTax: any;
		discounts: Array<{
			__typename?: 'Discount';
			type: AdjustmentType;
			description: string;
			amountWithTax: any;
		}>;
		taxSummary: Array<{
			__typename?: 'OrderTaxSummary';
			description: string;
			taxRate: number;
			taxTotal: any;
		}>;
		customer?: {
			__typename?: 'Customer';
			id: string;
			firstName: string;
			lastName: string;
			emailAddress: string;
		} | null;
		shippingAddress?: {
			__typename?: 'OrderAddress';
			fullName?: string | null;
			streetLine1?: string | null;
			streetLine2?: string | null;
			company?: string | null;
			city?: string | null;
			province?: string | null;
			postalCode?: string | null;
			countryCode?: string | null;
			phoneNumber?: string | null;
		} | null;
		shippingLines: Array<{
			__typename?: 'ShippingLine';
			priceWithTax: any;
			shippingMethod: { __typename?: 'ShippingMethod'; id: string; name: string };
		}>;
		lines: Array<{
			__typename?: 'OrderLine';
			id: string;
			unitPriceWithTax: any;
			linePriceWithTax: any;
			quantity: number;
			featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
			productVariant: {
				__typename?: 'ProductVariant';
				id: string;
				name: string;
				price: any;
				product: {
					__typename?: 'Product';
					id: string;
					name: string;
					slug: string;
					customFields?: {
						__typename?: 'ProductCustomFields';
						customizableClass?: string | null;
					} | null;
				};
			};
			customFields?: {
				__typename?: 'OrderLineCustomFields';
				customizableOptionJson?: string | null;
				customizedImageAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
			} | null;
		}>;
		customFields?: { __typename?: 'OrderCustomFields'; promisedArrivalDays?: number | null } | null;
	} | null;
};

export type BatchUpdateShippoFulfillmentStateMutationVariables = Exact<{ [key: string]: never }>;

export type BatchUpdateShippoFulfillmentStateMutation = {
	__typename?: 'Mutation';
	batchUpdateShippoFulfillmentState:
		| { __typename?: 'UpdateFulfillmentStateError'; errorCode: ErrorCode; message: string }
		| {
				__typename?: 'UpdateFulfillmentStateSuccess';
				success: boolean;
				message: string;
				numFulfillmentsUpdated: number;
		  };
};

export type SubmitProductReviewMutationVariables = Exact<{
	input: SubmitProductReviewInput;
}>;

export type SubmitProductReviewMutation = {
	__typename?: 'Mutation';
	submitProductReview:
		| { __typename: 'ProductReview'; id: string; state: string }
		| { __typename: 'ReviewSubmissionError'; errorCode: ErrorCode; message: string };
};

export type GetPurchasedVariantForReviewQueryQueryVariables = Exact<{ [key: string]: never }>;

export type GetPurchasedVariantForReviewQueryQuery = {
	__typename?: 'Query';
	getPurchasedVariantForReview:
		| { __typename: 'GetPurchasedVariantForReviewError'; errorCode: ErrorCode; message: string }
		| {
				__typename: 'PurchasedVariantWithReviewStatusList';
				items: Array<{
					__typename?: 'PurchasedVariantWithReviewStatus';
					variantId: string;
					canReview: boolean;
					notReviewableReason?: string | null;
				}>;
		  };
};

export type IsReviewAllowedQueryVariables = Exact<{
	productVariantId: Scalars['ID']['input'];
}>;

export type IsReviewAllowedQuery = {
	__typename?: 'Query';
	isReviewAllowed:
		| { __typename: 'GetPurchasedVariantForReviewError'; errorCode: ErrorCode; message: string }
		| {
				__typename: 'PurchasedVariantWithReviewStatus';
				variantId: string;
				canReview: boolean;
				notReviewableReason?: string | null;
		  };
};

export type GetProductReviewsQueryVariables = Exact<{
	id: Scalars['ID']['input'];
	options?: InputMaybe<ProductReviewListOptions>;
}>;

export type GetProductReviewsQuery = {
	__typename?: 'Query';
	product?: {
		__typename?: 'Product';
		id: string;
		reviews: {
			__typename?: 'ProductReviewList';
			totalItems: number;
			items: Array<{
				__typename?: 'ProductReview';
				id: string;
				rating: number;
				summary: string;
				body?: string | null;
				authorName: string;
				authorLocation?: string | null;
				createdAt: any;
				upvotes: number;
				response?: string | null;
				responseCreatedAt?: any | null;
				productVariant?: { __typename?: 'ProductVariant'; id: string; name: string } | null;
				assets?: Array<{
					__typename?: 'Asset';
					id: string;
					preview: string;
					focalPoint?: { __typename?: 'Coordinate'; x: number; y: number } | null;
				}> | null;
			}>;
		};
	} | null;
};

export type GetReviewHistogramQueryVariables = Exact<{
	productId: Scalars['ID']['input'];
}>;

export type GetReviewHistogramQuery = {
	__typename?: 'Query';
	product?: {
		__typename?: 'Product';
		id: string;
		reviewsHistogram: Array<{
			__typename?: 'ProductReviewHistogramItem';
			bin: number;
			frequency: number;
		}>;
	} | null;
};

export type VoteOnReviewMutationVariables = Exact<{
	id: Scalars['ID']['input'];
	vote: Scalars['Boolean']['input'];
}>;

export type VoteOnReviewMutation = {
	__typename?: 'Mutation';
	voteOnReview:
		| { __typename: 'Success'; success: boolean }
		| { __typename: 'VoteOnReviewError'; errorCode: ErrorCode; message: string };
};

export type DetailedProductFragment = {
	__typename?: 'Product';
	id: string;
	name: string;
	description: string;
	collections: Array<{
		__typename?: 'Collection';
		id: string;
		slug: string;
		name: string;
		breadcrumbs: Array<{
			__typename?: 'CollectionBreadcrumb';
			id: string;
			name: string;
			slug: string;
		}>;
	}>;
	facetValues: Array<{
		__typename?: 'FacetValue';
		id: string;
		code: string;
		name: string;
		facet: { __typename?: 'Facet'; id: string; code: string; name: string };
	}>;
	featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
	assets: Array<{ __typename?: 'Asset'; id: string; preview: string }>;
	variants: Array<{
		__typename?: 'ProductVariant';
		id: string;
		name: string;
		priceWithTax: any;
		currencyCode: CurrencyCode;
		sku: string;
		stockLevel: string;
		featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
		customFields?: {
			__typename?: 'ProductVariantCustomFields';
			customBuildJson?: string | null;
		} | null;
	}>;
	customFields?: {
		__typename?: 'ProductCustomFields';
		customizableClass?: string | null;
		reviewCount?: number | null;
		reviewRating?: number | null;
	} | null;
};

export type ProductQueryVariables = Exact<{
	slug?: InputMaybe<Scalars['String']['input']>;
	id?: InputMaybe<Scalars['ID']['input']>;
}>;

export type ProductQuery = {
	__typename?: 'Query';
	product?: {
		__typename?: 'Product';
		id: string;
		name: string;
		description: string;
		collections: Array<{
			__typename?: 'Collection';
			id: string;
			slug: string;
			name: string;
			breadcrumbs: Array<{
				__typename?: 'CollectionBreadcrumb';
				id: string;
				name: string;
				slug: string;
			}>;
		}>;
		facetValues: Array<{
			__typename?: 'FacetValue';
			id: string;
			code: string;
			name: string;
			facet: { __typename?: 'Facet'; id: string; code: string; name: string };
		}>;
		featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
		assets: Array<{ __typename?: 'Asset'; id: string; preview: string }>;
		variants: Array<{
			__typename?: 'ProductVariant';
			id: string;
			name: string;
			priceWithTax: any;
			currencyCode: CurrencyCode;
			sku: string;
			stockLevel: string;
			featuredAsset?: { __typename?: 'Asset'; id: string; preview: string } | null;
			customFields?: {
				__typename?: 'ProductVariantCustomFields';
				customBuildJson?: string | null;
			} | null;
		}>;
		customFields?: {
			__typename?: 'ProductCustomFields';
			customizableClass?: string | null;
			reviewCount?: number | null;
			reviewRating?: number | null;
		} | null;
	} | null;
};

export type ListedProductFragment = {
	__typename?: 'SearchResult';
	productId: string;
	productName: string;
	slug: string;
	currencyCode: CurrencyCode;
	productAsset?: { __typename?: 'SearchResultAsset'; id: string; preview: string } | null;
	priceWithTax:
		| { __typename?: 'PriceRange'; min: any; max: any }
		| { __typename?: 'SinglePrice'; value: any };
};

export type SearchQueryVariables = Exact<{
	input: SearchInput;
}>;

export type SearchQuery = {
	__typename?: 'Query';
	search: {
		__typename?: 'SearchResponse';
		totalItems: number;
		items: Array<{
			__typename?: 'SearchResult';
			productId: string;
			productName: string;
			slug: string;
			currencyCode: CurrencyCode;
			productAsset?: { __typename?: 'SearchResultAsset'; id: string; preview: string } | null;
			priceWithTax:
				| { __typename?: 'PriceRange'; min: any; max: any }
				| { __typename?: 'SinglePrice'; value: any };
		}>;
		facetValues: Array<{
			__typename?: 'FacetValueResult';
			count: number;
			facetValue: {
				__typename?: 'FacetValue';
				id: string;
				name: string;
				facet: { __typename?: 'Facet'; id: string; name: string };
			};
		}>;
	};
};

export const AddressFragmentDoc = gql`
	fragment Address on Address {
		id
		fullName
		company
		streetLine1
		streetLine2
		city
		province
		postalCode
		country {
			id
			code
			name
			__typename
		}
		phoneNumber
		defaultShippingAddress
		defaultBillingAddress
		__typename
	}
`;
export const OrderDetailFragmentDoc = gql`
	fragment OrderDetail on Order {
		__typename
		id
		code
		active
		createdAt
		state
		currencyCode
		couponCodes
		discounts {
			type
			description
			amountWithTax
		}
		totalQuantity
		subTotal
		subTotalWithTax
		taxSummary {
			description
			taxRate
			taxTotal
		}
		shippingWithTax
		totalWithTax
		customer {
			id
			firstName
			lastName
			emailAddress
		}
		shippingAddress {
			fullName
			streetLine1
			streetLine2
			company
			city
			province
			postalCode
			countryCode
			phoneNumber
		}
		shippingLines {
			shippingMethod {
				id
				name
			}
			priceWithTax
		}
		lines {
			id
			unitPriceWithTax
			linePriceWithTax
			quantity
			featuredAsset {
				id
				preview
			}
			productVariant {
				id
				name
				price
				product {
					id
					name
					slug
					customFields {
						customizableClass
					}
				}
			}
			customFields {
				customizableOptionJson
				customizedImageAsset {
					id
					preview
				}
			}
		}
		customFields {
			promisedArrivalDays
		}
	}
`;
export const DetailedProductFragmentDoc = gql`
	fragment DetailedProduct on Product {
		id
		name
		description
		collections {
			id
			slug
			name
			breadcrumbs {
				id
				name
				slug
			}
		}
		facetValues {
			facet {
				id
				code
				name
			}
			id
			code
			name
		}
		featuredAsset {
			id
			preview
		}
		assets {
			id
			preview
		}
		variants {
			id
			name
			priceWithTax
			currencyCode
			sku
			stockLevel
			featuredAsset {
				id
				preview
			}
			customFields {
				customBuildJson
			}
		}
		customFields {
			customizableClass
			reviewCount
			reviewRating
		}
	}
`;
export const ListedProductFragmentDoc = gql`
	fragment ListedProduct on SearchResult {
		productId
		productName
		slug
		productAsset {
			id
			preview
		}
		currencyCode
		priceWithTax {
			... on PriceRange {
				min
				max
			}
			... on SinglePrice {
				value
			}
		}
	}
`;
export const AuthenticateDocument = gql`
	mutation authenticate($input: AuthenticationInput!, $rememberMe: Boolean) {
		authenticate(input: $input, rememberMe: $rememberMe) {
			__typename
			... on CurrentUser {
				id
				identifier
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;
export const LoginDocument = gql`
	mutation login($email: String!, $password: String!, $rememberMe: Boolean) {
		login(username: $email, password: $password, rememberMe: $rememberMe) {
			__typename
			... on CurrentUser {
				id
				identifier
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;
export const LogoutDocument = gql`
	mutation logout {
		logout {
			success
		}
	}
`;
export const RegisterCustomerAccountDocument = gql`
	mutation registerCustomerAccount($input: RegisterCustomerInput!) {
		registerCustomerAccount(input: $input) {
			__typename
			... on Success {
				success
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;
export const VerifyCustomerAccountDocument = gql`
	mutation verifyCustomerAccount($token: String!, $password: String) {
		verifyCustomerAccount(token: $token, password: $password) {
			__typename
			... on CurrentUser {
				id
				identifier
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;
export const UpdateCustomerDocument = gql`
	mutation updateCustomer($input: UpdateCustomerInput!) {
		updateCustomer(input: $input) {
			__typename
		}
	}
`;
export const RequestUpdateCustomerEmailAddressDocument = gql`
	mutation requestUpdateCustomerEmailAddress($password: String!, $newEmailAddress: String!) {
		requestUpdateCustomerEmailAddress(password: $password, newEmailAddress: $newEmailAddress) {
			__typename
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;
export const UpdateCustomerEmailAddressDocument = gql`
	mutation updateCustomerEmailAddress($token: String!) {
		updateCustomerEmailAddress(token: $token) {
			__typename
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;
export const ResetPasswordDocument = gql`
	mutation resetPassword($token: String!, $password: String!) {
		resetPassword(token: $token, password: $password) {
			__typename
			... on CurrentUser {
				id
				identifier
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;
export const RequestPasswordResetDocument = gql`
	mutation requestPasswordReset($emailAddress: String!) {
		requestPasswordReset(emailAddress: $emailAddress) {
			__typename
			... on Success {
				success
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;
export const ValidateAddressByShippoDocument = gql`
	query validateAddressByShippo($address: VendureAddressInput!) {
		validateAddressByShippo(address: $address) {
			__typename
			... on ShippoAddressValidationResult {
				fullName
				city
				company
				country
				countryCode
				phoneNumber
				postalCode
				province
				streetLine1
				streetLine2
				validationResults {
					isValid
					messages {
						code
						source
						text
					}
				}
			}
			... on ValidateAddressError {
				errorCode
				message
			}
		}
	}
`;
export const AvailableCountriesDocument = gql`
	query availableCountries {
		availableCountries {
			id
			name
			code
		}
	}
`;
export const EligibleShippingMethodsDocument = gql`
	query eligibleShippingMethods {
		eligibleShippingMethods {
			id
			name
			description
			metadata
			price
			priceWithTax
		}
	}
`;
export const AddPaymentToOrderDocument = gql`
	mutation addPaymentToOrder($input: PaymentInput!) {
		addPaymentToOrder(input: $input) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
	${OrderDetailFragmentDoc}
`;
export const TransitionOrderToStateDocument = gql`
	mutation transitionOrderToState($state: String!) {
		transitionOrderToState(state: $state) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
	${OrderDetailFragmentDoc}
`;
export const EligiblePaymentMethodsDocument = gql`
	query eligiblePaymentMethods {
		eligiblePaymentMethods {
			id
			code
			name
			description
			eligibilityMessage
			isEligible
		}
	}
`;
export const CreateStripePaymentIntentDocument = gql`
	mutation createStripePaymentIntent {
		createStripePaymentIntent
	}
`;
export const GenerateBraintreeClientTokenDocument = gql`
	query generateBraintreeClientToken($orderId: ID!, $includeCustomerId: Boolean!) {
		generateBraintreeClientToken(orderId: $orderId, includeCustomerId: $includeCustomerId)
	}
`;
export const CollectionsDocument = gql`
	query collections {
		collections {
			items {
				id
				name
				slug
				parent {
					name
				}
				featuredAsset {
					id
					preview
				}
			}
		}
	}
`;
export const CollectionDocument = gql`
	query collection($slug: String, $id: ID) {
		collection(slug: $slug, id: $id) {
			id
			name
			slug
			breadcrumbs {
				id
				name
				slug
			}
			children {
				id
				name
				slug
				featuredAsset {
					id
					preview
				}
			}
		}
	}
`;
export const ActiveCustomerAddressesDocument = gql`
	query activeCustomerAddresses {
		activeCustomer {
			id
			addresses {
				id
				fullName
				company
				streetLine1
				streetLine2
				city
				province
				postalCode
				country {
					code
				}
				phoneNumber
				defaultShippingAddress
				defaultBillingAddress
			}
		}
	}
`;
export const ActiveCustomerDocument = gql`
	query activeCustomer {
		activeCustomer {
			id
			title
			firstName
			lastName
			emailAddress
			phoneNumber
			customFields {
				upvoteReviews
			}
		}
	}
`;
export const CreateCustomerAddressDocument = gql`
	mutation createCustomerAddress($input: CreateAddressInput!) {
		createCustomerAddress(input: $input) {
			...Address
			__typename
		}
	}
	${AddressFragmentDoc}
`;
export const ActiveCustomerOrdersDocument = gql`
	query activeCustomerOrders($options: OrderListOptions) {
		activeCustomer {
			id
			orders(options: $options) {
				items {
					id
					createdAt
					code
					state
					totalWithTax
					currencyCode
					lines {
						featuredAsset {
							preview
						}
						productVariant {
							id
							name
						}
					}
				}
				totalItems
			}
		}
	}
`;
export const UpdateCustomerPasswordDocument = gql`
	mutation updateCustomerPassword($currentPassword: String!, $newPassword: String!) {
		updateCustomerPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
			__typename
			... on Success {
				success
			}
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;
export const DeleteCustomerAddressDocument = gql`
	mutation deleteCustomerAddress($id: ID!) {
		deleteCustomerAddress(id: $id) {
			success
		}
	}
`;
export const UpdateCustomerAddressMutationDocument = gql`
	mutation updateCustomerAddressMutation($input: UpdateAddressInput!) {
		updateCustomerAddress(input: $input) {
			...Address
			__typename
		}
	}
	${AddressFragmentDoc}
`;
export const CreateCustomerAddressMutationDocument = gql`
	mutation createCustomerAddressMutation($input: CreateAddressInput!) {
		createCustomerAddress(input: $input) {
			...Address
			__typename
		}
	}
	${AddressFragmentDoc}
`;
export const FontMenuFindAllDocument = gql`
	query fontMenuFindAll {
		fontMenuFindAll {
			id
			name
			additiveFontId
			subtractiveFontId
			isDisabled
		}
	}
`;
export const FilamentColorFindSupportedDocument = gql`
	query filamentColorFindSupported {
		filamentColorFindSupported {
			id
			name
			displayName
			hexCode
			isOutOfStock
		}
	}
`;
export const CustomizableClassDefFindAllDocument = gql`
	query customizableClassDefFindAll {
		customizableClassDefFindAll {
			name
			optionDefinition
		}
	}
`;
export const BatchAddCustomizedImagesToOrderDocument = gql`
	mutation batchAddCustomizedImagesToOrder($files: [Upload!]!, $orderLineIds: [ID!]!) {
		batchAddCustomizedImagesToOrder(files: $files, orderLineIds: $orderLineIds) {
			... on BatchAddCustomizedImagesToOrderSuccess {
				message
				orderLineIds
				assetIds
			}
			... on CreateCustomizedImageAssetError {
				errorCode
				message
			}
		}
	}
`;
export const SetOrderCustomFieldsDocument = gql`
	mutation setOrderCustomFields($input: UpdateOrderInput!) {
		setOrderCustomFields(input: $input) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
	${OrderDetailFragmentDoc}
`;
export const ApplyCouponCodeDocument = gql`
	mutation applyCouponCode($couponCode: String!) {
		applyCouponCode(couponCode: $couponCode) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
	${OrderDetailFragmentDoc}
`;
export const RemoveCouponCodeDocument = gql`
	mutation removeCouponCode($couponCode: String!) {
		removeCouponCode(couponCode: $couponCode) {
			...OrderDetail
		}
	}
	${OrderDetailFragmentDoc}
`;
export const SetOrderShippingAddressDocument = gql`
	mutation setOrderShippingAddress($input: CreateAddressInput!) {
		setOrderShippingAddress(input: $input) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
	${OrderDetailFragmentDoc}
`;
export const SetCustomerForOrderDocument = gql`
	mutation setCustomerForOrder($input: CreateCustomerInput!) {
		setCustomerForOrder(input: $input) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
	${OrderDetailFragmentDoc}
`;
export const AddItemToOrderDocument = gql`
	mutation addItemToOrder(
		$productVariantId: ID!
		$quantity: Int!
		$customFields: OrderLineCustomFieldsInput
	) {
		addItemToOrder(
			productVariantId: $productVariantId
			quantity: $quantity
			customFields: $customFields
		) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
	${OrderDetailFragmentDoc}
`;
export const SetOrderShippingMethodDocument = gql`
	mutation setOrderShippingMethod($shippingMethodId: [ID!]!) {
		setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
	${OrderDetailFragmentDoc}
`;
export const AdjustOrderLineDocument = gql`
	mutation adjustOrderLine($orderLineId: ID!, $quantity: Int!) {
		adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
	${OrderDetailFragmentDoc}
`;
export const RemoveOrderLineDocument = gql`
	mutation removeOrderLine($orderLineId: ID!) {
		removeOrderLine(orderLineId: $orderLineId) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
	${OrderDetailFragmentDoc}
`;
export const ActiveOrderDocument = gql`
	query activeOrder {
		activeOrder {
			...OrderDetail
		}
	}
	${OrderDetailFragmentDoc}
`;
export const OrderByCodeDocument = gql`
	query orderByCode($code: String!) {
		orderByCode(code: $code) {
			...OrderDetail
		}
	}
	${OrderDetailFragmentDoc}
`;
export const BatchUpdateShippoFulfillmentStateDocument = gql`
	mutation batchUpdateShippoFulfillmentState {
		batchUpdateShippoFulfillmentState {
			... on UpdateFulfillmentStateError {
				errorCode
				message
			}
			... on UpdateFulfillmentStateSuccess {
				success
				message
				numFulfillmentsUpdated
			}
		}
	}
`;
export const SubmitProductReviewDocument = gql`
	mutation submitProductReview($input: SubmitProductReviewInput!) {
		submitProductReview(input: $input) {
			... on ProductReview {
				__typename
				id
				state
			}
			... on ReviewSubmissionError {
				__typename
				errorCode
				message
			}
		}
	}
`;
export const GetPurchasedVariantForReviewQueryDocument = gql`
	query getPurchasedVariantForReviewQuery {
		getPurchasedVariantForReview {
			... on PurchasedVariantWithReviewStatusList {
				__typename
				items {
					variantId
					canReview
					notReviewableReason
				}
			}
			... on ErrorResult {
				__typename
				errorCode
				message
			}
		}
	}
`;
export const IsReviewAllowedDocument = gql`
	query isReviewAllowed($productVariantId: ID!) {
		isReviewAllowed(productVariantId: $productVariantId) {
			... on PurchasedVariantWithReviewStatus {
				__typename
				variantId
				canReview
				notReviewableReason
			}
			... on ErrorResult {
				__typename
				errorCode
				message
			}
		}
	}
`;
export const GetProductReviewsDocument = gql`
	query getProductReviews($id: ID!, $options: ProductReviewListOptions) {
		product(id: $id) {
			id
			reviews(options: $options) {
				items {
					id
					productVariant {
						id
						name
					}
					rating
					summary
					body
					rating
					authorName
					authorLocation
					createdAt
					upvotes
					assets {
						id
						preview
						focalPoint {
							x
							y
						}
					}
					response
					responseCreatedAt
				}
				totalItems
			}
		}
	}
`;
export const GetReviewHistogramDocument = gql`
	query getReviewHistogram($productId: ID!) {
		product(id: $productId) {
			id
			reviewsHistogram {
				bin
				frequency
			}
		}
	}
`;
export const VoteOnReviewDocument = gql`
	mutation voteOnReview($id: ID!, $vote: Boolean!) {
		voteOnReview(id: $id, vote: $vote) {
			... on Success {
				__typename
				success
			}
			... on ErrorResult {
				__typename
				errorCode
				message
			}
		}
	}
`;
export const ProductDocument = gql`
	query product($slug: String, $id: ID) {
		product(slug: $slug, id: $id) {
			...DetailedProduct
		}
	}
	${DetailedProductFragmentDoc}
`;
export const SearchDocument = gql`
	query search($input: SearchInput!) {
		search(input: $input) {
			totalItems
			items {
				...ListedProduct
			}
			facetValues {
				count
				facetValue {
					id
					name
					facet {
						id
						name
					}
				}
			}
		}
	}
	${ListedProductFragmentDoc}
`;
export type Requester<C = {}> = <R, V>(
	doc: DocumentNode,
	vars?: V,
	options?: C
) => Promise<R> | AsyncIterable<R>;
export function getSdk<C>(requester: Requester<C>) {
	return {
		authenticate(
			variables: AuthenticateMutationVariables,
			options?: C
		): Promise<AuthenticateMutation> {
			return requester<AuthenticateMutation, AuthenticateMutationVariables>(
				AuthenticateDocument,
				variables,
				options
			) as Promise<AuthenticateMutation>;
		},
		login(variables: LoginMutationVariables, options?: C): Promise<LoginMutation> {
			return requester<LoginMutation, LoginMutationVariables>(
				LoginDocument,
				variables,
				options
			) as Promise<LoginMutation>;
		},
		logout(variables?: LogoutMutationVariables, options?: C): Promise<LogoutMutation> {
			return requester<LogoutMutation, LogoutMutationVariables>(
				LogoutDocument,
				variables,
				options
			) as Promise<LogoutMutation>;
		},
		registerCustomerAccount(
			variables: RegisterCustomerAccountMutationVariables,
			options?: C
		): Promise<RegisterCustomerAccountMutation> {
			return requester<RegisterCustomerAccountMutation, RegisterCustomerAccountMutationVariables>(
				RegisterCustomerAccountDocument,
				variables,
				options
			) as Promise<RegisterCustomerAccountMutation>;
		},
		verifyCustomerAccount(
			variables: VerifyCustomerAccountMutationVariables,
			options?: C
		): Promise<VerifyCustomerAccountMutation> {
			return requester<VerifyCustomerAccountMutation, VerifyCustomerAccountMutationVariables>(
				VerifyCustomerAccountDocument,
				variables,
				options
			) as Promise<VerifyCustomerAccountMutation>;
		},
		updateCustomer(
			variables: UpdateCustomerMutationVariables,
			options?: C
		): Promise<UpdateCustomerMutation> {
			return requester<UpdateCustomerMutation, UpdateCustomerMutationVariables>(
				UpdateCustomerDocument,
				variables,
				options
			) as Promise<UpdateCustomerMutation>;
		},
		requestUpdateCustomerEmailAddress(
			variables: RequestUpdateCustomerEmailAddressMutationVariables,
			options?: C
		): Promise<RequestUpdateCustomerEmailAddressMutation> {
			return requester<
				RequestUpdateCustomerEmailAddressMutation,
				RequestUpdateCustomerEmailAddressMutationVariables
			>(
				RequestUpdateCustomerEmailAddressDocument,
				variables,
				options
			) as Promise<RequestUpdateCustomerEmailAddressMutation>;
		},
		updateCustomerEmailAddress(
			variables: UpdateCustomerEmailAddressMutationVariables,
			options?: C
		): Promise<UpdateCustomerEmailAddressMutation> {
			return requester<
				UpdateCustomerEmailAddressMutation,
				UpdateCustomerEmailAddressMutationVariables
			>(
				UpdateCustomerEmailAddressDocument,
				variables,
				options
			) as Promise<UpdateCustomerEmailAddressMutation>;
		},
		resetPassword(
			variables: ResetPasswordMutationVariables,
			options?: C
		): Promise<ResetPasswordMutation> {
			return requester<ResetPasswordMutation, ResetPasswordMutationVariables>(
				ResetPasswordDocument,
				variables,
				options
			) as Promise<ResetPasswordMutation>;
		},
		requestPasswordReset(
			variables: RequestPasswordResetMutationVariables,
			options?: C
		): Promise<RequestPasswordResetMutation> {
			return requester<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>(
				RequestPasswordResetDocument,
				variables,
				options
			) as Promise<RequestPasswordResetMutation>;
		},
		validateAddressByShippo(
			variables: ValidateAddressByShippoQueryVariables,
			options?: C
		): Promise<ValidateAddressByShippoQuery> {
			return requester<ValidateAddressByShippoQuery, ValidateAddressByShippoQueryVariables>(
				ValidateAddressByShippoDocument,
				variables,
				options
			) as Promise<ValidateAddressByShippoQuery>;
		},
		availableCountries(
			variables?: AvailableCountriesQueryVariables,
			options?: C
		): Promise<AvailableCountriesQuery> {
			return requester<AvailableCountriesQuery, AvailableCountriesQueryVariables>(
				AvailableCountriesDocument,
				variables,
				options
			) as Promise<AvailableCountriesQuery>;
		},
		eligibleShippingMethods(
			variables?: EligibleShippingMethodsQueryVariables,
			options?: C
		): Promise<EligibleShippingMethodsQuery> {
			return requester<EligibleShippingMethodsQuery, EligibleShippingMethodsQueryVariables>(
				EligibleShippingMethodsDocument,
				variables,
				options
			) as Promise<EligibleShippingMethodsQuery>;
		},
		addPaymentToOrder(
			variables: AddPaymentToOrderMutationVariables,
			options?: C
		): Promise<AddPaymentToOrderMutation> {
			return requester<AddPaymentToOrderMutation, AddPaymentToOrderMutationVariables>(
				AddPaymentToOrderDocument,
				variables,
				options
			) as Promise<AddPaymentToOrderMutation>;
		},
		transitionOrderToState(
			variables: TransitionOrderToStateMutationVariables,
			options?: C
		): Promise<TransitionOrderToStateMutation> {
			return requester<TransitionOrderToStateMutation, TransitionOrderToStateMutationVariables>(
				TransitionOrderToStateDocument,
				variables,
				options
			) as Promise<TransitionOrderToStateMutation>;
		},
		eligiblePaymentMethods(
			variables?: EligiblePaymentMethodsQueryVariables,
			options?: C
		): Promise<EligiblePaymentMethodsQuery> {
			return requester<EligiblePaymentMethodsQuery, EligiblePaymentMethodsQueryVariables>(
				EligiblePaymentMethodsDocument,
				variables,
				options
			) as Promise<EligiblePaymentMethodsQuery>;
		},
		createStripePaymentIntent(
			variables?: CreateStripePaymentIntentMutationVariables,
			options?: C
		): Promise<CreateStripePaymentIntentMutation> {
			return requester<
				CreateStripePaymentIntentMutation,
				CreateStripePaymentIntentMutationVariables
			>(
				CreateStripePaymentIntentDocument,
				variables,
				options
			) as Promise<CreateStripePaymentIntentMutation>;
		},
		generateBraintreeClientToken(
			variables: GenerateBraintreeClientTokenQueryVariables,
			options?: C
		): Promise<GenerateBraintreeClientTokenQuery> {
			return requester<
				GenerateBraintreeClientTokenQuery,
				GenerateBraintreeClientTokenQueryVariables
			>(
				GenerateBraintreeClientTokenDocument,
				variables,
				options
			) as Promise<GenerateBraintreeClientTokenQuery>;
		},
		collections(variables?: CollectionsQueryVariables, options?: C): Promise<CollectionsQuery> {
			return requester<CollectionsQuery, CollectionsQueryVariables>(
				CollectionsDocument,
				variables,
				options
			) as Promise<CollectionsQuery>;
		},
		collection(variables?: CollectionQueryVariables, options?: C): Promise<CollectionQuery> {
			return requester<CollectionQuery, CollectionQueryVariables>(
				CollectionDocument,
				variables,
				options
			) as Promise<CollectionQuery>;
		},
		activeCustomerAddresses(
			variables?: ActiveCustomerAddressesQueryVariables,
			options?: C
		): Promise<ActiveCustomerAddressesQuery> {
			return requester<ActiveCustomerAddressesQuery, ActiveCustomerAddressesQueryVariables>(
				ActiveCustomerAddressesDocument,
				variables,
				options
			) as Promise<ActiveCustomerAddressesQuery>;
		},
		activeCustomer(
			variables?: ActiveCustomerQueryVariables,
			options?: C
		): Promise<ActiveCustomerQuery> {
			return requester<ActiveCustomerQuery, ActiveCustomerQueryVariables>(
				ActiveCustomerDocument,
				variables,
				options
			) as Promise<ActiveCustomerQuery>;
		},
		createCustomerAddress(
			variables: CreateCustomerAddressMutationVariables,
			options?: C
		): Promise<CreateCustomerAddressMutation> {
			return requester<CreateCustomerAddressMutation, CreateCustomerAddressMutationVariables>(
				CreateCustomerAddressDocument,
				variables,
				options
			) as Promise<CreateCustomerAddressMutation>;
		},
		activeCustomerOrders(
			variables?: ActiveCustomerOrdersQueryVariables,
			options?: C
		): Promise<ActiveCustomerOrdersQuery> {
			return requester<ActiveCustomerOrdersQuery, ActiveCustomerOrdersQueryVariables>(
				ActiveCustomerOrdersDocument,
				variables,
				options
			) as Promise<ActiveCustomerOrdersQuery>;
		},
		updateCustomerPassword(
			variables: UpdateCustomerPasswordMutationVariables,
			options?: C
		): Promise<UpdateCustomerPasswordMutation> {
			return requester<UpdateCustomerPasswordMutation, UpdateCustomerPasswordMutationVariables>(
				UpdateCustomerPasswordDocument,
				variables,
				options
			) as Promise<UpdateCustomerPasswordMutation>;
		},
		deleteCustomerAddress(
			variables: DeleteCustomerAddressMutationVariables,
			options?: C
		): Promise<DeleteCustomerAddressMutation> {
			return requester<DeleteCustomerAddressMutation, DeleteCustomerAddressMutationVariables>(
				DeleteCustomerAddressDocument,
				variables,
				options
			) as Promise<DeleteCustomerAddressMutation>;
		},
		updateCustomerAddressMutation(
			variables: UpdateCustomerAddressMutationMutationVariables,
			options?: C
		): Promise<UpdateCustomerAddressMutationMutation> {
			return requester<
				UpdateCustomerAddressMutationMutation,
				UpdateCustomerAddressMutationMutationVariables
			>(
				UpdateCustomerAddressMutationDocument,
				variables,
				options
			) as Promise<UpdateCustomerAddressMutationMutation>;
		},
		createCustomerAddressMutation(
			variables: CreateCustomerAddressMutationMutationVariables,
			options?: C
		): Promise<CreateCustomerAddressMutationMutation> {
			return requester<
				CreateCustomerAddressMutationMutation,
				CreateCustomerAddressMutationMutationVariables
			>(
				CreateCustomerAddressMutationDocument,
				variables,
				options
			) as Promise<CreateCustomerAddressMutationMutation>;
		},
		fontMenuFindAll(
			variables?: FontMenuFindAllQueryVariables,
			options?: C
		): Promise<FontMenuFindAllQuery> {
			return requester<FontMenuFindAllQuery, FontMenuFindAllQueryVariables>(
				FontMenuFindAllDocument,
				variables,
				options
			) as Promise<FontMenuFindAllQuery>;
		},
		filamentColorFindSupported(
			variables?: FilamentColorFindSupportedQueryVariables,
			options?: C
		): Promise<FilamentColorFindSupportedQuery> {
			return requester<FilamentColorFindSupportedQuery, FilamentColorFindSupportedQueryVariables>(
				FilamentColorFindSupportedDocument,
				variables,
				options
			) as Promise<FilamentColorFindSupportedQuery>;
		},
		customizableClassDefFindAll(
			variables?: CustomizableClassDefFindAllQueryVariables,
			options?: C
		): Promise<CustomizableClassDefFindAllQuery> {
			return requester<CustomizableClassDefFindAllQuery, CustomizableClassDefFindAllQueryVariables>(
				CustomizableClassDefFindAllDocument,
				variables,
				options
			) as Promise<CustomizableClassDefFindAllQuery>;
		},
		batchAddCustomizedImagesToOrder(
			variables: BatchAddCustomizedImagesToOrderMutationVariables,
			options?: C
		): Promise<BatchAddCustomizedImagesToOrderMutation> {
			return requester<
				BatchAddCustomizedImagesToOrderMutation,
				BatchAddCustomizedImagesToOrderMutationVariables
			>(
				BatchAddCustomizedImagesToOrderDocument,
				variables,
				options
			) as Promise<BatchAddCustomizedImagesToOrderMutation>;
		},
		setOrderCustomFields(
			variables: SetOrderCustomFieldsMutationVariables,
			options?: C
		): Promise<SetOrderCustomFieldsMutation> {
			return requester<SetOrderCustomFieldsMutation, SetOrderCustomFieldsMutationVariables>(
				SetOrderCustomFieldsDocument,
				variables,
				options
			) as Promise<SetOrderCustomFieldsMutation>;
		},
		applyCouponCode(
			variables: ApplyCouponCodeMutationVariables,
			options?: C
		): Promise<ApplyCouponCodeMutation> {
			return requester<ApplyCouponCodeMutation, ApplyCouponCodeMutationVariables>(
				ApplyCouponCodeDocument,
				variables,
				options
			) as Promise<ApplyCouponCodeMutation>;
		},
		removeCouponCode(
			variables: RemoveCouponCodeMutationVariables,
			options?: C
		): Promise<RemoveCouponCodeMutation> {
			return requester<RemoveCouponCodeMutation, RemoveCouponCodeMutationVariables>(
				RemoveCouponCodeDocument,
				variables,
				options
			) as Promise<RemoveCouponCodeMutation>;
		},
		setOrderShippingAddress(
			variables: SetOrderShippingAddressMutationVariables,
			options?: C
		): Promise<SetOrderShippingAddressMutation> {
			return requester<SetOrderShippingAddressMutation, SetOrderShippingAddressMutationVariables>(
				SetOrderShippingAddressDocument,
				variables,
				options
			) as Promise<SetOrderShippingAddressMutation>;
		},
		setCustomerForOrder(
			variables: SetCustomerForOrderMutationVariables,
			options?: C
		): Promise<SetCustomerForOrderMutation> {
			return requester<SetCustomerForOrderMutation, SetCustomerForOrderMutationVariables>(
				SetCustomerForOrderDocument,
				variables,
				options
			) as Promise<SetCustomerForOrderMutation>;
		},
		addItemToOrder(
			variables: AddItemToOrderMutationVariables,
			options?: C
		): Promise<AddItemToOrderMutation> {
			return requester<AddItemToOrderMutation, AddItemToOrderMutationVariables>(
				AddItemToOrderDocument,
				variables,
				options
			) as Promise<AddItemToOrderMutation>;
		},
		setOrderShippingMethod(
			variables: SetOrderShippingMethodMutationVariables,
			options?: C
		): Promise<SetOrderShippingMethodMutation> {
			return requester<SetOrderShippingMethodMutation, SetOrderShippingMethodMutationVariables>(
				SetOrderShippingMethodDocument,
				variables,
				options
			) as Promise<SetOrderShippingMethodMutation>;
		},
		adjustOrderLine(
			variables: AdjustOrderLineMutationVariables,
			options?: C
		): Promise<AdjustOrderLineMutation> {
			return requester<AdjustOrderLineMutation, AdjustOrderLineMutationVariables>(
				AdjustOrderLineDocument,
				variables,
				options
			) as Promise<AdjustOrderLineMutation>;
		},
		removeOrderLine(
			variables: RemoveOrderLineMutationVariables,
			options?: C
		): Promise<RemoveOrderLineMutation> {
			return requester<RemoveOrderLineMutation, RemoveOrderLineMutationVariables>(
				RemoveOrderLineDocument,
				variables,
				options
			) as Promise<RemoveOrderLineMutation>;
		},
		activeOrder(variables?: ActiveOrderQueryVariables, options?: C): Promise<ActiveOrderQuery> {
			return requester<ActiveOrderQuery, ActiveOrderQueryVariables>(
				ActiveOrderDocument,
				variables,
				options
			) as Promise<ActiveOrderQuery>;
		},
		orderByCode(variables: OrderByCodeQueryVariables, options?: C): Promise<OrderByCodeQuery> {
			return requester<OrderByCodeQuery, OrderByCodeQueryVariables>(
				OrderByCodeDocument,
				variables,
				options
			) as Promise<OrderByCodeQuery>;
		},
		batchUpdateShippoFulfillmentState(
			variables?: BatchUpdateShippoFulfillmentStateMutationVariables,
			options?: C
		): Promise<BatchUpdateShippoFulfillmentStateMutation> {
			return requester<
				BatchUpdateShippoFulfillmentStateMutation,
				BatchUpdateShippoFulfillmentStateMutationVariables
			>(
				BatchUpdateShippoFulfillmentStateDocument,
				variables,
				options
			) as Promise<BatchUpdateShippoFulfillmentStateMutation>;
		},
		submitProductReview(
			variables: SubmitProductReviewMutationVariables,
			options?: C
		): Promise<SubmitProductReviewMutation> {
			return requester<SubmitProductReviewMutation, SubmitProductReviewMutationVariables>(
				SubmitProductReviewDocument,
				variables,
				options
			) as Promise<SubmitProductReviewMutation>;
		},
		getPurchasedVariantForReviewQuery(
			variables?: GetPurchasedVariantForReviewQueryQueryVariables,
			options?: C
		): Promise<GetPurchasedVariantForReviewQueryQuery> {
			return requester<
				GetPurchasedVariantForReviewQueryQuery,
				GetPurchasedVariantForReviewQueryQueryVariables
			>(
				GetPurchasedVariantForReviewQueryDocument,
				variables,
				options
			) as Promise<GetPurchasedVariantForReviewQueryQuery>;
		},
		isReviewAllowed(
			variables: IsReviewAllowedQueryVariables,
			options?: C
		): Promise<IsReviewAllowedQuery> {
			return requester<IsReviewAllowedQuery, IsReviewAllowedQueryVariables>(
				IsReviewAllowedDocument,
				variables,
				options
			) as Promise<IsReviewAllowedQuery>;
		},
		getProductReviews(
			variables: GetProductReviewsQueryVariables,
			options?: C
		): Promise<GetProductReviewsQuery> {
			return requester<GetProductReviewsQuery, GetProductReviewsQueryVariables>(
				GetProductReviewsDocument,
				variables,
				options
			) as Promise<GetProductReviewsQuery>;
		},
		getReviewHistogram(
			variables: GetReviewHistogramQueryVariables,
			options?: C
		): Promise<GetReviewHistogramQuery> {
			return requester<GetReviewHistogramQuery, GetReviewHistogramQueryVariables>(
				GetReviewHistogramDocument,
				variables,
				options
			) as Promise<GetReviewHistogramQuery>;
		},
		voteOnReview(
			variables: VoteOnReviewMutationVariables,
			options?: C
		): Promise<VoteOnReviewMutation> {
			return requester<VoteOnReviewMutation, VoteOnReviewMutationVariables>(
				VoteOnReviewDocument,
				variables,
				options
			) as Promise<VoteOnReviewMutation>;
		},
		product(variables?: ProductQueryVariables, options?: C): Promise<ProductQuery> {
			return requester<ProductQuery, ProductQueryVariables>(
				ProductDocument,
				variables,
				options
			) as Promise<ProductQuery>;
		},
		search(variables: SearchQueryVariables, options?: C): Promise<SearchQuery> {
			return requester<SearchQuery, SearchQueryVariables>(
				SearchDocument,
				variables,
				options
			) as Promise<SearchQuery>;
		},
	};
}
export type Sdk = ReturnType<typeof getSdk>;
