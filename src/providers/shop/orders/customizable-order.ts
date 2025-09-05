import gql from 'graphql-tag';
import {
	FilamentColorFindSupportedQuery,
	FontMenuFindAllQuery,
	GetCustomBuildOptionQuery,
} from '~/generated/graphql-shop';
import { shopSdk } from '~/graphql-wrapper';

export const fontMenuFindAll = async () => {
	return shopSdk.fontMenuFindAll().then((res: FontMenuFindAllQuery) => res.fontMenuFindAll);
};

export const filamentColorFindSupported = async () => {
	return await shopSdk
		.filamentColorFindSupported()
		.then((res: FilamentColorFindSupportedQuery) => res.filamentColorFindSupported);
};

// export const createOrRetrieveCustomNameTag = async (input: CreateCustomNameTagInput) => {
// 	return shopSdk
// 		.createOrRetrieveCustomNameTag({ input })
// 		.then((res: CreateOrRetrieveCustomNameTagMutation) => res.createOrRetrieveCustomNameTag);
// };

gql`
	query fontMenuFindAll {
		fontMenuFindAll {
			id
			name
			additiveFontId
			subtractiveFontId
			isDisabled
		}
	}
`;

gql`
	query filamentColorFindSupported {
		filamentColorFindSupported {
			id
			name
			displayName
			hexCode
			isOutOfStock
		}
	}
`;

// gql`
// 	mutation createOrRetrieveCustomNameTag($input: CreateCustomNameTagInput!) {
// 		createOrRetrieveCustomNameTag(input: $input) {
// 			... on CreateCustomNameTagError {
// 				errorCode
// 				message
// 			}
// 			... on CreateCustomNameTagSuccess {
// 				customNameTagId
// 			}
// 		}
// 	}
// `;

gql`
	query getCustomBuildOption($customVariantId: ID!) {
		getCustomBuildOption(customVariantId: $customVariantId) {
			... on CustomNameTag {
				__typename
				id
				isTopAdditive
				textTop
				textBottom
				fontTop {
					id
				}
				fontBottom {
					id
				}
				primaryColor {
					id
				}
				baseColor {
					id
				}
			}
			... on DummyBuildOption {
				__typename
				dummyField
			}
			... on GetCustomBuildOptionError {
				__typename
				errorCode
				message
			}
		}
	}
`;

export const getCustomBuildOption = async (customVariantId: string) => {
	return shopSdk
		.getCustomBuildOption({ customVariantId })
		.then((res: GetCustomBuildOptionQuery) => res.getCustomBuildOption);
};
