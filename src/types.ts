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
	currencycode: string;
	sku: string;
	stockLevel: string;
	featuredAsset?: any;
};
