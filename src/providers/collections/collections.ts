import gql from 'graphql-tag';
import { sdk } from '~/graphql-wrapper';

export const getCollections = async () => {
	return sdk.collections();
};

export const getCollectionBySlug = async (slug: string) => {
	return sdk.collection({ slug });
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
