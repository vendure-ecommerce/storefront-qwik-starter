export type Product = {
	id: string;
	name: string;
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
	currencyCode: string;
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
};
