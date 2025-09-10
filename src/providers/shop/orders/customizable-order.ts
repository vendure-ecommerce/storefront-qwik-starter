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
