import { Collection as CollectionGql, Order } from '~/generated/graphql';

export type AppState = {
	collections: CollectionGql[];
	activeOrder: Order;
	showCart: boolean;
	showMenu: boolean;
	customer: ActiveCustomer;
	shippingAddress: ShippingAddress;
	availableCountries: Country[];
	addressBook: ShippingAddress[];
};

export type Product = {
	id: string;
	name: string;
	slug?: string;
	description: string;
	collections: Collection[];
	facetValues: FacetValue[];
	featuredAsset: FeaturedAsset;
	assets: Asset[];
	variants: Variant[];
};

type Breadcrumb = {
	id: string;
	name: string;
	slug: string;
};

export type Collection = {
	id: string;
	slug: string;
	name: string;
	breadcrumbs?: Breadcrumb[];
	parent?: { name: '__root_collection__' };
	featuredAsset?: { id: string; preview: string };
	children: any[];
};

type Facet = {
	id: string;
	code: string;
	name: string;
};

type FacetValue = {
	facet: Facet;
	id: string;
	code: string;
	name: string;
};

type FeaturedAsset = {
	id: string;
	preview: string;
};

type Asset = {
	id: string;
	preview: string;
};

export type Variant = {
	id: string;
	name: string;
	priceWithTax: number;
	currencyCode: CurrencyCode;
	sku: string;
	stockLevel: string;
	featuredAsset?: any;
};

// activeOrder

type TaxSummary = {
	description: string;
	taxRate: number;
	taxTotal: number;
};

export type ShippingAddress = {
	id?: string;
	fullName?: string;
	streetLine1?: string;
	streetLine2?: string;
	company?: string;
	city?: string;
	province?: string;
	postalCode?: string;
	countryCode?: string;
	phoneNumber?: string;
	defaultShippingAddress?: boolean;
	defaultBillingAddress?: boolean;
	country?: string;
};

type ProductVariant = {
	id: string;
	name: string;
	price: number;
	product: Product;
};

export type Line = {
	id: string;
	unitPriceWithTax: number;
	linePriceWithTax: number;
	quantity: number;
	featuredAsset: FeaturedAsset;
	productVariant: ProductVariant;
};

export type ActiveOrder = {
	__typename: string;
	id: string;
	code: string;
	active: boolean;
	createdAt: Date;
	state: string;
	currencyCode: CurrencyCode;
	totalQuantity: number;
	subTotal: number;
	subTotalWithTax: number;
	taxSummary: TaxSummary[];
	shippingWithTax: number;
	totalWithTax: number;
	customer?: any;
	shippingAddress: ShippingAddress;
	shippingLines: ShippingLine[];
	lines: Line[];
	errorCode?: string;
};

export type OrderPriceFields = keyof Pick<
	ActiveOrder,
	'subTotal' | 'totalWithTax' | 'subTotalWithTax' | 'shippingWithTax'
>;

type ShippingLine = {
	priceWithTax: 1000;
	shippingMethod: { id: string; name: string };
};

// search

type ProductAsset = {
	id: string;
	preview: string;
};

type PriceWithTax = {
	value: number;
};

type Item = {
	productId: string;
	productName: string;
	slug: string;
	productAsset: ProductAsset;
	currencyCode: CurrencyCode;
	priceWithTax: PriceWithTax;
};

type FilterFacetValueDetail = {
	id: string;
	name: string;
	facet: Facet;
};

type FilterFacetValue = {
	count: number;
	facetValue: FilterFacetValueDetail;
};

export type Search = {
	totalItems: number;
	items: Item[];
	facetValues: FilterFacetValue[];
};

export type FacetWithValues = {
	id: string;
	name: string;
	open: boolean;
	values: Array<{
		id: string;
		name: string;
		selected: boolean;
	}>;
};

export type Review = {
	id: number;
	title: string;
	rating: number;
	content: string;
	author: string;
	date: string;
	datetime: string;
};

export type ActiveCustomer = {
	title?: string;
	firstName: string;
	id: string;
	lastName: string;
	emailAddress?: string;
	phoneNumber?: string;
};

export type Login = ActiveCustomer & {
	__typename: 'CurrentUser' | string;
	message: string;
};

export type RegisterCustomer = Omit<ActiveCustomer, 'id'> & {
	password: string;
	success?: boolean;
	message?: string;
};

export type EligibleShippingMethods = {
	id: string;
	name: string;
	price: number;
	priceWithTax: number;
};

export type EligiblePaymentMethods = {
	name: string;
	code: string;
	isEligible: boolean;
};

export type Country = {
	id: string;
	code: string;
	name: string;
};

export type ActiveCustomerOrders = {
	id: string;
	orders: {
		items: ActiveCustomerOrder[];
		totalItems: string;
	};
};

export type ActiveCustomerOrder = {
	id: string;
	code: string;
	state: string;
	totalWithTax: number;
	currencyCode: string;
	lines: {
		featuredAsset: {
			preview: string;
		};
		productVariant: { name: string };
	}[];
};

export type CurrencyCode =
	/** United Arab Emirates dirham */
	| 'AED'
	/** Afghan afghani */
	| 'AFN'
	/** Albanian lek */
	| 'ALL'
	/** Armenian dram */
	| 'AMD'
	/** Netherlands Antillean guilder */
	| 'ANG'
	/** Angolan kwanza */
	| 'AOA'
	/** Argentine peso */
	| 'ARS'
	/** Australian dollar */
	| 'AUD'
	/** Aruban florin */
	| 'AWG'
	/** Azerbaijani manat */
	| 'AZN'
	/** Bosnia and Herzegovina convertible mark */
	| 'BAM'
	/** Barbados dollar */
	| 'BBD'
	/** Bangladeshi taka */
	| 'BDT'
	/** Bulgarian lev */
	| 'BGN'
	/** Bahraini dinar */
	| 'BHD'
	/** Burundian franc */
	| 'BIF'
	/** Bermudian dollar */
	| 'BMD'
	/** Brunei dollar */
	| 'BND'
	/** Boliviano */
	| 'BOB'
	/** Brazilian real */
	| 'BRL'
	/** Bahamian dollar */
	| 'BSD'
	/** Bhutanese ngultrum */
	| 'BTN'
	/** Botswana pula */
	| 'BWP'
	/** Belarusian ruble */
	| 'BYN'
	/** Belize dollar */
	| 'BZD'
	/** Canadian dollar */
	| 'CAD'
	/** Congolese franc */
	| 'CDF'
	/** Swiss franc */
	| 'CHF'
	/** Chilean peso */
	| 'CLP'
	/** Renminbi (Chinese) yuan */
	| 'CNY'
	/** Colombian peso */
	| 'COP'
	/** Costa Rican colon */
	| 'CRC'
	/** Cuban convertible peso */
	| 'CUC'
	/** Cuban peso */
	| 'CUP'
	/** Cape Verde escudo */
	| 'CVE'
	/** Czech koruna */
	| 'CZK'
	/** Djiboutian franc */
	| 'DJF'
	/** Danish krone */
	| 'DKK'
	/** Dominican peso */
	| 'DOP'
	/** Algerian dinar */
	| 'DZD'
	/** Egyptian pound */
	| 'EGP'
	/** Eritrean nakfa */
	| 'ERN'
	/** Ethiopian birr */
	| 'ETB'
	/** Euro */
	| 'EUR'
	/** Fiji dollar */
	| 'FJD'
	/** Falkland Islands pound */
	| 'FKP'
	/** Pound sterling */
	| 'GBP'
	/** Georgian lari */
	| 'GEL'
	/** Ghanaian cedi */
	| 'GHS'
	/** Gibraltar pound */
	| 'GIP'
	/** Gambian dalasi */
	| 'GMD'
	/** Guinean franc */
	| 'GNF'
	/** Guatemalan quetzal */
	| 'GTQ'
	/** Guyanese dollar */
	| 'GYD'
	/** Hong Kong dollar */
	| 'HKD'
	/** Honduran lempira */
	| 'HNL'
	/** Croatian kuna */
	| 'HRK'
	/** Haitian gourde */
	| 'HTG'
	/** Hungarian forint */
	| 'HUF'
	/** Indonesian rupiah */
	| 'IDR'
	/** Israeli new shekel */
	| 'ILS'
	/** Indian rupee */
	| 'INR'
	/** Iraqi dinar */
	| 'IQD'
	/** Iranian rial */
	| 'IRR'
	/** Icelandic króna */
	| 'ISK'
	/** Jamaican dollar */
	| 'JMD'
	/** Jordanian dinar */
	| 'JOD'
	/** Japanese yen */
	| 'JPY'
	/** Kenyan shilling */
	| 'KES'
	/** Kyrgyzstani som */
	| 'KGS'
	/** Cambodian riel */
	| 'KHR'
	/** Comoro franc */
	| 'KMF'
	/** North Korean won */
	| 'KPW'
	/** South Korean won */
	| 'KRW'
	/** Kuwaiti dinar */
	| 'KWD'
	/** Cayman Islands dollar */
	| 'KYD'
	/** Kazakhstani tenge */
	| 'KZT'
	/** Lao kip */
	| 'LAK'
	/** Lebanese pound */
	| 'LBP'
	/** Sri Lankan rupee */
	| 'LKR'
	/** Liberian dollar */
	| 'LRD'
	/** Lesotho loti */
	| 'LSL'
	/** Libyan dinar */
	| 'LYD'
	/** Moroccan dirham */
	| 'MAD'
	/** Moldovan leu */
	| 'MDL'
	/** Malagasy ariary */
	| 'MGA'
	/** Macedonian denar */
	| 'MKD'
	/** Myanmar kyat */
	| 'MMK'
	/** Mongolian tögrög */
	| 'MNT'
	/** Macanese pataca */
	| 'MOP'
	/** Mauritanian ouguiya */
	| 'MRU'
	/** Mauritian rupee */
	| 'MUR'
	/** Maldivian rufiyaa */
	| 'MVR'
	/** Malawian kwacha */
	| 'MWK'
	/** Mexican peso */
	| 'MXN'
	/** Malaysian ringgit */
	| 'MYR'
	/** Mozambican metical */
	| 'MZN'
	/** Namibian dollar */
	| 'NAD'
	/** Nigerian naira */
	| 'NGN'
	/** Nicaraguan córdoba */
	| 'NIO'
	/** Norwegian krone */
	| 'NOK'
	/** Nepalese rupee */
	| 'NPR'
	/** New Zealand dollar */
	| 'NZD'
	/** Omani rial */
	| 'OMR'
	/** Panamanian balboa */
	| 'PAB'
	/** Peruvian sol */
	| 'PEN'
	/** Papua New Guinean kina */
	| 'PGK'
	/** Philippine peso */
	| 'PHP'
	/** Pakistani rupee */
	| 'PKR'
	/** Polish złoty */
	| 'PLN'
	/** Paraguayan guaraní */
	| 'PYG'
	/** Qatari riyal */
	| 'QAR'
	/** Romanian leu */
	| 'RON'
	/** Serbian dinar */
	| 'RSD'
	/** Russian ruble */
	| 'RUB'
	/** Rwandan franc */
	| 'RWF'
	/** Saudi riyal */
	| 'SAR'
	/** Solomon Islands dollar */
	| 'SBD'
	/** Seychelles rupee */
	| 'SCR'
	/** Sudanese pound */
	| 'SDG'
	/** Swedish krona/kronor */
	| 'SEK'
	/** Singapore dollar */
	| 'SGD'
	/** Saint Helena pound */
	| 'SHP'
	/** Sierra Leonean leone */
	| 'SLL'
	/** Somali shilling */
	| 'SOS'
	/** Surinamese dollar */
	| 'SRD'
	/** South Sudanese pound */
	| 'SSP'
	/** São Tomé and Príncipe dobra */
	| 'STN'
	/** Salvadoran colón */
	| 'SVC'
	/** Syrian pound */
	| 'SYP'
	/** Swazi lilangeni */
	| 'SZL'
	/** Thai baht */
	| 'THB'
	/** Tajikistani somoni */
	| 'TJS'
	/** Turkmenistan manat */
	| 'TMT'
	/** Tunisian dinar */
	| 'TND'
	/** Tongan paʻanga */
	| 'TOP'
	/** Turkish lira */
	| 'TRY'
	/** Trinidad and Tobago dollar */
	| 'TTD'
	/** New Taiwan dollar */
	| 'TWD'
	/** Tanzanian shilling */
	| 'TZS'
	/** Ukrainian hryvnia */
	| 'UAH'
	/** Ugandan shilling */
	| 'UGX'
	/** United States dollar */
	| 'USD'
	/** Uruguayan peso */
	| 'UYU'
	/** Uzbekistan som */
	| 'UZS'
	/** Venezuelan bolívar soberano */
	| 'VES'
	/** Vietnamese đồng */
	| 'VND'
	/** Vanuatu vatu */
	| 'VUV'
	/** Samoan tala */
	| 'WST'
	/** CFA franc BEAC */
	| 'XAF'
	/** East Caribbean dollar */
	| 'XCD'
	/** CFA franc BCEAO */
	| 'XOF'
	/** CFP franc (franc Pacifique) */
	| 'XPF'
	/** Yemeni rial */
	| 'YER'
	/** South African rand */
	| 'ZAR'
	/** Zambian kwacha */
	| 'ZMW'
	/** Zimbabwean dollar */
	| 'ZWL';
