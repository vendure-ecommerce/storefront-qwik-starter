// import gql from 'graphql-tag';
// import { Collection } from '~/generated/graphql';
// import { shopSdk } from '~/graphql-wrapper';

// export const getCollections = async () => {
// 	return await shopSdk.collections().then((res) => res?.collections.items as Collection[]);
// };

// export const getCollectionBySlug = async (slug: string) => {
// 	return await shopSdk.collection({ slug }).then((res) => res.collection as Collection);
// };

// gql`
// 	query collections {
// 		collections {
// 			items {
// 				id
// 				name
// 				slug
// 				parent {
// 					name
// 				}
// 				featuredAsset {
// 					id
// 					preview
// 				}
// 			}
// 		}
// 	}
// `;

// gql`
// 	query collection($slug: String, $id: ID) {
// 		collection(slug: $slug, id: $id) {
// 			id
// 			name
// 			slug
// 			breadcrumbs {
// 				id
// 				name
// 				slug
// 			}
// 			children {
// 				id
// 				name
// 				slug
// 				featuredAsset {
// 					id
// 					preview
// 				}
// 			}
// 		}
// 	}
// `;

import gql from 'graphql-tag';
import { Collection } from '~/generated/graphql';
import { shopSdk, esShopSdk, frShopSdk, deShopSdk, itShopSdk } from '~/graphql-wrapper';

// Helper function to get the appropriate SDK based on language
const getLanguageSpecificSdk = (language: string) => {
	switch (language) {
		case 'es':
			return esShopSdk;
		case 'fr':
			return frShopSdk;
		case 'de':
			return deShopSdk;
		case 'it':
			return itShopSdk;
		case 'en':
			return shopSdk;
		default:
			return shopSdk;
	}
};

export const getCollections = async (language: string = 'en') => {
	const sdk = getLanguageSpecificSdk(language);
	return await sdk.collections().then((res) => res?.collections.items as Collection[]);
};

export const getCollectionBySlug = async (slug: string, language: string = 'en') => {
	const sdk = getLanguageSpecificSdk(language);
	return await sdk.collection({ slug }).then((res) => res.collection as Collection);
};

// GraphQL queries remain the same
gql`
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

gql`
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
