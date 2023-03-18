import gql from 'graphql-tag';
import { sdk } from '~/graphql-wrapper';
import { Collection } from '~/generated/graphql';

export const getCollections = async () => {
	return await sdk.collections().then((res) => res.collections.items as Collection[]);
};

export const getCollectionBySlug = async (slug: string) => {
	return await sdk.collection({ slug }).then((res) => res.collection as Collection);
};

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
