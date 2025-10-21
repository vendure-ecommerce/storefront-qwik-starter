import gql from 'graphql-tag';
import {
	CustomizableClassDefFindAllQuery,
	FilamentColorFindSupportedQuery,
	FontMenuFindAllQuery,
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

export const customizableClassDefFindAll = async (): Promise<
	{ name: string; optionDefinition: string }[]
> => {
	return await shopSdk
		.customizableClassDefFindAll()
		.then((res: CustomizableClassDefFindAllQuery) => res.customizableClassDefFindAll);
};

export const createCustomizedImageAssetMutation = async (file: File) => {
	return await shopSdk
		.createCustomizedImageAsset({ file })
		.then((res) => res.createCustomizedImageAsset);
};

export const batchAddCustomizedImagesToOrderMutation = async (
	files: File[],
	orderLineIds: string[]
) => {
	return await shopSdk
		.batchAddCustomizedImagesToOrder({ files, orderLineIds })
		.then((res) => res.batchAddCustomizedImagesToOrder);
};

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

gql`
	query customizableClassDefFindAll {
		customizableClassDefFindAll {
			name
			optionDefinition
		}
	}
`;

gql`
	mutation createCustomizedImageAsset($file: Upload!) {
		createCustomizedImageAsset(file: $file) {
			... on CreateAssetSuccess {
				assetId
			}
			... on CreateCustomizedImageAssetError {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation batchAddCustomizedImagesToOrder($files: [Upload!]!, $orderLineIds: [ID!]!) {
		batchAddCustomizedImagesToOrder(files: $files, orderLineIds: $orderLineIds) {
			... on BatchAddCustomizedImagesToOrderSuccess {
				message
				orderLineIds
				assetIds
			}
			... on CreateCustomizedImageAssetError {
				errorCode
				message
			}
		}
	}
`;
