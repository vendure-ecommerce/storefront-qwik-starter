import gql from 'graphql-tag';
import { Product, ProductQuery, SearchInput, SearchResponse } from '~/generated/graphql';
import { shopSdk } from '~/graphql-wrapper';

export const search = async (searchInput: SearchInput, languageCode: string) => {
	return await shopSdk
		.search({
			input: { groupByProduct: true, ...searchInput },
			languageCode,
		})
		.then((res: { search: SearchResponse }) => res.search as SearchResponse);
};

export const searchQueryWithCollectionSlug = async (collectionSlug: string, languageCode: string) =>
	search({ collectionSlug }, languageCode);

export const searchQueryWithTerm = async (
	collectionSlug: string,
	term: string,
	facetValueIds: string[],
	languageCode: string
) =>
	search(
		{
			collectionSlug,
			term,
			facetValueFilters: [{ or: facetValueIds }],
		},
		languageCode
	);

export const getProductBySlug = async (slug: string, languageCode: string) => {
	return shopSdk
		.product({
			slug,
			languageCode, // Pass directly as a variable
		})
		.then((res: ProductQuery) => res.product as Product);
};

export const detailedProductFragment = gql`
	fragment DetailedProduct on Product {
		id
		name(languageCode: $languageCode)
		description(languageCode: $languageCode)
		collections {
			id
			slug
			name(languageCode: $languageCode)
			breadcrumbs {
				id
				name(languageCode: $languageCode)
				slug
			}
		}
		facetValues {
			facet {
				id
				code
				name(languageCode: $languageCode)
			}
			id
			code
			name(languageCode: $languageCode)
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
			name(languageCode: $languageCode)
			priceWithTax
			currencyCode
			sku
			stockLevel
			featuredAsset {
				id
				preview
			}
		}
	}
`;

gql`
	query product($slug: String, $id: ID, $languageCode: LanguageCode!) {
		product(slug: $slug, id: $id) {
			...DetailedProduct
		}
	}
`;

export const listedProductFragment = gql`
	fragment ListedProduct on SearchResult {
		productId
		productName(languageCode: $languageCode)
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

gql`
	query search($input: SearchInput!, $languageCode: LanguageCode!) {
		search(input: $input) {
			totalItems
			items {
				...ListedProduct
			}
			facetValues {
				count
				facetValue {
					id
					name(languageCode: $languageCode)
					facet {
						id
						name(languageCode: $languageCode)
					}
				}
			}
		}
	}
	${listedProductFragment}
`;
