export type AppState = {
	collections: Collection[];
	activeOrder: ActiveOrder;
	showCart: boolean;
	customer?: ActiveCustomer;
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

export type Breadcrumb = {
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

export type Facet = {
	id: string;
	code: string;
	name: string;
};

export type FacetValue = {
	facet: Facet;
	id: string;
	code: string;
	name: string;
};

export type FeaturedAsset = {
	id: string;
	preview: string;
};

export type Asset = {
	id: string;
	preview: string;
};

export type Variant = {
	id: string;
	name: string;
	priceWithTax: number;
	currencyCode: string;
	sku: string;
	stockLevel: string;
	featuredAsset?: any;
};

// activeOrder

export type TaxSummary = {
	description: string;
	taxRate: number;
	taxTotal: number;
};

export type ShippingAddress = {
	fullName?: any;
	streetLine1?: any;
	streetLine2?: any;
	company?: any;
	city?: any;
	province?: any;
	postalCode?: any;
	countryCode?: any;
	phoneNumber?: any;
};

export type ProductVariant = {
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
	shippingLines: any[];
	lines: Line[];
	errorCode?: string;
};

// search

export type ProductAsset = {
	id: string;
	preview: string;
};

export type PriceWithTax = {
	value: number;
};

export type Item = {
	productId: string;
	productName: string;
	slug: string;
	productAsset: ProductAsset;
	currencyCode: string;
	priceWithTax: PriceWithTax;
};

export type FilterFacetValueDetail = {
	id: string;
	name: string;
	facet: Facet;
};

export type FilterFacetValue = {
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
	firstName: string;
	id: string;
	lastName: string;
};

export enum CurrencyCode {
	/** United Arab Emirates dirham */
	Aed = 'AED',
	/** Afghan afghani */
	Afn = 'AFN',
	/** Albanian lek */
	All = 'ALL',
	/** Armenian dram */
	Amd = 'AMD',
	/** Netherlands Antillean guilder */
	Ang = 'ANG',
	/** Angolan kwanza */
	Aoa = 'AOA',
	/** Argentine peso */
	Ars = 'ARS',
	/** Australian dollar */
	Aud = 'AUD',
	/** Aruban florin */
	Awg = 'AWG',
	/** Azerbaijani manat */
	Azn = 'AZN',
	/** Bosnia and Herzegovina convertible mark */
	Bam = 'BAM',
	/** Barbados dollar */
	Bbd = 'BBD',
	/** Bangladeshi taka */
	Bdt = 'BDT',
	/** Bulgarian lev */
	Bgn = 'BGN',
	/** Bahraini dinar */
	Bhd = 'BHD',
	/** Burundian franc */
	Bif = 'BIF',
	/** Bermudian dollar */
	Bmd = 'BMD',
	/** Brunei dollar */
	Bnd = 'BND',
	/** Boliviano */
	Bob = 'BOB',
	/** Brazilian real */
	Brl = 'BRL',
	/** Bahamian dollar */
	Bsd = 'BSD',
	/** Bhutanese ngultrum */
	Btn = 'BTN',
	/** Botswana pula */
	Bwp = 'BWP',
	/** Belarusian ruble */
	Byn = 'BYN',
	/** Belize dollar */
	Bzd = 'BZD',
	/** Canadian dollar */
	Cad = 'CAD',
	/** Congolese franc */
	Cdf = 'CDF',
	/** Swiss franc */
	Chf = 'CHF',
	/** Chilean peso */
	Clp = 'CLP',
	/** Renminbi (Chinese) yuan */
	Cny = 'CNY',
	/** Colombian peso */
	Cop = 'COP',
	/** Costa Rican colon */
	Crc = 'CRC',
	/** Cuban convertible peso */
	Cuc = 'CUC',
	/** Cuban peso */
	Cup = 'CUP',
	/** Cape Verde escudo */
	Cve = 'CVE',
	/** Czech koruna */
	Czk = 'CZK',
	/** Djiboutian franc */
	Djf = 'DJF',
	/** Danish krone */
	Dkk = 'DKK',
	/** Dominican peso */
	Dop = 'DOP',
	/** Algerian dinar */
	Dzd = 'DZD',
	/** Egyptian pound */
	Egp = 'EGP',
	/** Eritrean nakfa */
	Ern = 'ERN',
	/** Ethiopian birr */
	Etb = 'ETB',
	/** Euro */
	Eur = 'EUR',
	/** Fiji dollar */
	Fjd = 'FJD',
	/** Falkland Islands pound */
	Fkp = 'FKP',
	/** Pound sterling */
	Gbp = 'GBP',
	/** Georgian lari */
	Gel = 'GEL',
	/** Ghanaian cedi */
	Ghs = 'GHS',
	/** Gibraltar pound */
	Gip = 'GIP',
	/** Gambian dalasi */
	Gmd = 'GMD',
	/** Guinean franc */
	Gnf = 'GNF',
	/** Guatemalan quetzal */
	Gtq = 'GTQ',
	/** Guyanese dollar */
	Gyd = 'GYD',
	/** Hong Kong dollar */
	Hkd = 'HKD',
	/** Honduran lempira */
	Hnl = 'HNL',
	/** Croatian kuna */
	Hrk = 'HRK',
	/** Haitian gourde */
	Htg = 'HTG',
	/** Hungarian forint */
	Huf = 'HUF',
	/** Indonesian rupiah */
	Idr = 'IDR',
	/** Israeli new shekel */
	Ils = 'ILS',
	/** Indian rupee */
	Inr = 'INR',
	/** Iraqi dinar */
	Iqd = 'IQD',
	/** Iranian rial */
	Irr = 'IRR',
	/** Icelandic króna */
	Isk = 'ISK',
	/** Jamaican dollar */
	Jmd = 'JMD',
	/** Jordanian dinar */
	Jod = 'JOD',
	/** Japanese yen */
	Jpy = 'JPY',
	/** Kenyan shilling */
	Kes = 'KES',
	/** Kyrgyzstani som */
	Kgs = 'KGS',
	/** Cambodian riel */
	Khr = 'KHR',
	/** Comoro franc */
	Kmf = 'KMF',
	/** North Korean won */
	Kpw = 'KPW',
	/** South Korean won */
	Krw = 'KRW',
	/** Kuwaiti dinar */
	Kwd = 'KWD',
	/** Cayman Islands dollar */
	Kyd = 'KYD',
	/** Kazakhstani tenge */
	Kzt = 'KZT',
	/** Lao kip */
	Lak = 'LAK',
	/** Lebanese pound */
	Lbp = 'LBP',
	/** Sri Lankan rupee */
	Lkr = 'LKR',
	/** Liberian dollar */
	Lrd = 'LRD',
	/** Lesotho loti */
	Lsl = 'LSL',
	/** Libyan dinar */
	Lyd = 'LYD',
	/** Moroccan dirham */
	Mad = 'MAD',
	/** Moldovan leu */
	Mdl = 'MDL',
	/** Malagasy ariary */
	Mga = 'MGA',
	/** Macedonian denar */
	Mkd = 'MKD',
	/** Myanmar kyat */
	Mmk = 'MMK',
	/** Mongolian tögrög */
	Mnt = 'MNT',
	/** Macanese pataca */
	Mop = 'MOP',
	/** Mauritanian ouguiya */
	Mru = 'MRU',
	/** Mauritian rupee */
	Mur = 'MUR',
	/** Maldivian rufiyaa */
	Mvr = 'MVR',
	/** Malawian kwacha */
	Mwk = 'MWK',
	/** Mexican peso */
	Mxn = 'MXN',
	/** Malaysian ringgit */
	Myr = 'MYR',
	/** Mozambican metical */
	Mzn = 'MZN',
	/** Namibian dollar */
	Nad = 'NAD',
	/** Nigerian naira */
	Ngn = 'NGN',
	/** Nicaraguan córdoba */
	Nio = 'NIO',
	/** Norwegian krone */
	Nok = 'NOK',
	/** Nepalese rupee */
	Npr = 'NPR',
	/** New Zealand dollar */
	Nzd = 'NZD',
	/** Omani rial */
	Omr = 'OMR',
	/** Panamanian balboa */
	Pab = 'PAB',
	/** Peruvian sol */
	Pen = 'PEN',
	/** Papua New Guinean kina */
	Pgk = 'PGK',
	/** Philippine peso */
	Php = 'PHP',
	/** Pakistani rupee */
	Pkr = 'PKR',
	/** Polish złoty */
	Pln = 'PLN',
	/** Paraguayan guaraní */
	Pyg = 'PYG',
	/** Qatari riyal */
	Qar = 'QAR',
	/** Romanian leu */
	Ron = 'RON',
	/** Serbian dinar */
	Rsd = 'RSD',
	/** Russian ruble */
	Rub = 'RUB',
	/** Rwandan franc */
	Rwf = 'RWF',
	/** Saudi riyal */
	Sar = 'SAR',
	/** Solomon Islands dollar */
	Sbd = 'SBD',
	/** Seychelles rupee */
	Scr = 'SCR',
	/** Sudanese pound */
	Sdg = 'SDG',
	/** Swedish krona/kronor */
	Sek = 'SEK',
	/** Singapore dollar */
	Sgd = 'SGD',
	/** Saint Helena pound */
	Shp = 'SHP',
	/** Sierra Leonean leone */
	Sll = 'SLL',
	/** Somali shilling */
	Sos = 'SOS',
	/** Surinamese dollar */
	Srd = 'SRD',
	/** South Sudanese pound */
	Ssp = 'SSP',
	/** São Tomé and Príncipe dobra */
	Stn = 'STN',
	/** Salvadoran colón */
	Svc = 'SVC',
	/** Syrian pound */
	Syp = 'SYP',
	/** Swazi lilangeni */
	Szl = 'SZL',
	/** Thai baht */
	Thb = 'THB',
	/** Tajikistani somoni */
	Tjs = 'TJS',
	/** Turkmenistan manat */
	Tmt = 'TMT',
	/** Tunisian dinar */
	Tnd = 'TND',
	/** Tongan paʻanga */
	Top = 'TOP',
	/** Turkish lira */
	Try = 'TRY',
	/** Trinidad and Tobago dollar */
	Ttd = 'TTD',
	/** New Taiwan dollar */
	Twd = 'TWD',
	/** Tanzanian shilling */
	Tzs = 'TZS',
	/** Ukrainian hryvnia */
	Uah = 'UAH',
	/** Ugandan shilling */
	Ugx = 'UGX',
	/** United States dollar */
	Usd = 'USD',
	/** Uruguayan peso */
	Uyu = 'UYU',
	/** Uzbekistan som */
	Uzs = 'UZS',
	/** Venezuelan bolívar soberano */
	Ves = 'VES',
	/** Vietnamese đồng */
	Vnd = 'VND',
	/** Vanuatu vatu */
	Vuv = 'VUV',
	/** Samoan tala */
	Wst = 'WST',
	/** CFA franc BEAC */
	Xaf = 'XAF',
	/** East Caribbean dollar */
	Xcd = 'XCD',
	/** CFA franc BCEAO */
	Xof = 'XOF',
	/** CFP franc (franc Pacifique) */
	Xpf = 'XPF',
	/** Yemeni rial */
	Yer = 'YER',
	/** South African rand */
	Zar = 'ZAR',
	/** Zambian kwacha */
	Zmw = 'ZMW',
	/** Zimbabwean dollar */
	Zwl = 'ZWL',
}
