import gql from 'graphql-tag';
import { sdk } from '~/graphql-wrapper';
import { SearchInput } from '~/generated/graphql';

export const search = async (searchInput: SearchInput) => {
	return sdk.search({ input: { groupByProduct: true, ...searchInput } });
};

export const searchQueryWithCollectionSlug = async (collectionSlug: string) =>
	search({ collectionSlug });

export const searchQueryWithTerm = async (
	collectionSlug: string,
	term: string,
	facetValueIds: string[]
) => search({ collectionSlug, term, facetValueIds });

export function getProductBySlug(slug: string) {
	return sdk.product({ slug });
}

export const detailedProductFragment = gql`
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
		}
	}
`;

gql`
	query product($slug: String, $id: ID) {
		product(slug: $slug, id: $id) {
			...DetailedProduct
		}
	}
`;

export const listedProductFragment = gql`
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

gql`
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
	${listedProductFragment}
`;
