import { getSdk as getAdminSdk } from '~/generated/graphql-admin';
import { getSdk as getShopSdk, type LogicalOperator } from '~/generated/graphql-shop';
import { requester } from '~/utils/api';

export type SortDirection = 'DESC' | 'ASC';
export type LanguageCode = 'en' | 'fr' | 'de' | 'it' | string; // Add your supported languages

export interface Options {
	// Vendure Channel code or token.
	channelToken?: string;
	// Auth bearer token
	token?: string;
	// The API URL to call. This can be the local shop API, dev shop API,
	// dev admin API, production shop API..etc.
	apiUrl?: string;
	// Language code for translations
	languageCode?: LanguageCode;
	take?: number;
	sort?: {
		updatedAt?: SortDirection;
		createdAt?: SortDirection;
		totalWithTax?: SortDirection;
		totalQuantity?: SortDirection;
	};
	skip?: number;
	filter?: { [name: string]: { [operator: string]: number | string } };
	filterOperator?: LogicalOperator;
	headers?: {
		'Accept-Language'?: string;
		[key: string]: string | undefined;
	};
}

// Create a wrapper function to include language code in requests
const createSdkWithLanguage = (sdk: any) => {
	return (options?: Options) => {
		const wrappedRequester = async (document: any, variables: any) => {
			const languageCode = options?.languageCode || 'en';
			return requester(
				document,
				{
					...variables,
					languageCode,
				},
				{
					...options,
					headers: {
						...options?.headers,
						'Accept-Language': languageCode,
					},
				}
			);
		};
		return sdk(wrappedRequester);
	};
};

// @ts-ignore
export const shopSdk = createSdkWithLanguage(getShopSdk)<Options>(requester);
// @ts-ignore
export const adminSdk = createSdkWithLanguage(getAdminSdk)<Options>(requester);

// Helper function to create options with language
export const createOptionsWithLanguage = (
	languageCode: LanguageCode,
	options?: Partial<Options>
): Options => {
	return {
		...options,
		languageCode,
		headers: {
			...options?.headers,
			'Accept-Language': languageCode,
		},
	};
};
