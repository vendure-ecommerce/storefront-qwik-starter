import gql from 'graphql-tag';
import { Collection } from '~/generated/graphql';
import { shopSdk } from '~/graphql-wrapper';

// GraphQL query for fetching all collections with language support
const COLLECTIONS_QUERY = gql`
	query collections($languageCode: LanguageCode!) {
		collections {
			items {
				id
				name(languageCode: $languageCode)
				slug
				parent {
					name(languageCode: $languageCode)
				}
				featuredAsset {
					id
					preview
				}
			}
		}
	}
`;

// GraphQL query for fetching a single collection with language support
const COLLECTION_QUERY = gql`
	query collection($slug: String, $id: ID, $languageCode: LanguageCode!) {
		collection(slug: $slug, id: $id) {
			id
			name(languageCode: $languageCode)
			slug
			breadcrumbs {
				id
				name(languageCode: $languageCode)
				slug
			}
			children {
				id
				name(languageCode: $languageCode)
				slug
				featuredAsset {
					id
					preview
				}
			}
		}
	}
`;

/**
 * Fetch all collections with language support
 */
export const getCollections = async (locale: string = 'fr') => {
	return await shopSdk
		.collections(
			{
				languageCode: locale.toUpperCase(),
			},
			{
				headers: {
					'Accept-Language': locale,
					'Content-Type': 'application/json',
				},
			}
		)
		.then((res: { collections: { items: Collection[] } }) => {
			if (!res?.collections?.items) {
				console.error('Failed to fetch collections');
				return [];
			}
			return res.collections.items as Collection[];
		})
		.catch((error: any) => {
			console.error('Error fetching collections:', error);
			return [];
		});
};

/**
 * Fetch collection by slug with language support
 */
export const getCollectionBySlug = async (slug: string, locale: string = 'fr') => {
	return await shopSdk
		.collection(
			{
				slug,
				languageCode: locale.toUpperCase(),
			},
			{
				headers: {
					'Accept-Language': locale,
					'Content-Type': 'application/json',
				},
			}
		)
		.then((res: { collection: Collection }) => {
			if (!res?.collection) {
				throw new Error(`Collection not found for slug: ${slug}`);
			}
			return res.collection as Collection;
		})
		.catch((error: any) => {
			console.error(`Error fetching collection with slug ${slug}:`, error);
			throw error;
		});
};

// Export queries for use in other parts of the application
export const queries = {
	COLLECTIONS_QUERY,
	COLLECTION_QUERY,
};

// Type definitions for better type safety
export type CollectionsResponse = {
	collections: {
		items: Collection[];
	};
};

export type CollectionResponse = {
	collection: Collection;
};

// Utility function to validate locale
export function validateLocale(locale: string): string {
	const supportedLocales = ['fr', 'en', 'de', 'es']; // Add your supported locales
	const normalizedLocale = locale.toLowerCase().trim();

	if (supportedLocales.includes(normalizedLocale)) {
		return normalizedLocale;
	}

	console.warn(`Unsupported locale: ${locale}, falling back to fr`);
	return 'fr';
}
