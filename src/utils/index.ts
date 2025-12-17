import {
	CUSTOMER_NOT_DEFINED_ID,
	DEFAULT_METADATA_DESCRIPTION,
	DEFAULT_METADATA_IMAGE,
	DEFAULT_METADATA_TITLE,
	DEFAULT_METADATA_URL,
} from '~/constants';
import { ENV_VARIABLES } from '~/env';
import { SearchResponse } from '~/generated/graphql';
import { getActiveCustomerQuery } from '~/providers/shop/customer/customer';
import { FONT_MENU } from '~/routes/constants';
import { ActiveCustomer, AppState, FacetWithValues, ShippingAddress } from '~/types';

export const getRandomInt = (max: number) => Math.floor(Math.random() * max);

export function formatPrice(value = 0, currency: any) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
	}).format(value / 100);
}

export const groupFacetValues = (
	search: SearchResponse,
	activeFacetValueIds: string[]
): FacetWithValues[] => {
	if (!search) {
		return [];
	}
	const facetMap = new Map<string, FacetWithValues>();
	for (const {
		facetValue: { id, name, facet },
		count,
	} of search.facetValues) {
		if (count === search.totalItems) {
			continue;
		}
		const facetFromMap = facetMap.get(facet.id);
		const selected = (activeFacetValueIds || []).includes(id);
		if (facetFromMap) {
			facetFromMap.values.push({ id, name, selected });
		} else {
			facetMap.set(facet.id, {
				id: facet.id,
				name: facet.name,
				open: true,
				values: [{ id, name, selected }],
			});
		}
	}
	return Array.from(facetMap.values());
};

export const enableDisableFacetValues = (_facedValues: FacetWithValues[], ids: string[]) => {
	const facetValueIds: string[] = [];
	const facedValues = _facedValues.map((facet) => {
		facet.values = facet.values.map((value) => {
			if (ids.includes(value.id)) {
				facetValueIds.push(value.id);
				value.selected = true;
			} else {
				value.selected = false;
			}
			return value;
		});
		return facet;
	});
	return { facedValues, facetValueIds };
};

export const changeUrlParamsWithoutRefresh = (term: string, facetValueIds: string[]) => {
	const f = facetValueIds.join('-');
	return window.history.pushState(
		'',
		'',
		`${window.location.origin}${window.location.pathname}?q=${term}${f ? `&f=${f}` : ''}`
	);
};

export const setCookie = (name: string, value: string, days: number) => {
	let expires = '';
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = '; expires=' + date.toUTCString();
	}
	const secureCookie = isEnvVariableEnabled('VITE_SECURE_COOKIE')
		? ' Secure; SameSite=Strict;'
		: '';
	document.cookie = name + '=' + (value || '') + expires + `;${secureCookie} path=/`;
};

export const getCookie = (name: string) => {
	const keyValues = document.cookie.split(';');
	let result = '';
	keyValues.forEach((item) => {
		const [key, value] = item.split('=');
		if (key.trim() === name) {
			result = value;
		}
	});
	return result;
};

export const cleanUpParams = (params: Record<string, string>) => {
	if ('slug' in params && params.slug[params.slug.length - 1] === '/') {
		params.slug = params.slug.slice(0, params.slug.length - 1);
	}
	return params;
};

export const isEnvVariableEnabled = (envVariable: keyof typeof ENV_VARIABLES) =>
	ENV_VARIABLES[envVariable] === 'true';

export const isShippingAddressValid = (orderAddress: ShippingAddress): boolean =>
	!!(
		!!orderAddress &&
		orderAddress.fullName &&
		orderAddress.streetLine1 &&
		orderAddress.city &&
		orderAddress.province &&
		orderAddress.postalCode &&
		orderAddress.countryCode
	);

export const isActiveCustomerValid = (activeCustomer: ActiveCustomer): boolean =>
	!!(
		!!activeCustomer &&
		activeCustomer.emailAddress &&
		activeCustomer.firstName &&
		activeCustomer.lastName
	);

export const fullNameWithTitle = ({
	title,
	firstName,
	lastName,
}: Pick<ActiveCustomer, 'title' | 'firstName' | 'lastName'>): string => {
	return [title, firstName, lastName].filter((x) => !!x).join(' ');
};

export const formatDateTime = (dateToConvert?: string | Date | null) => {
	if (!dateToConvert) return '';
	const d = new Date(dateToConvert as any);
	if (isNaN(d.getTime())) return '';
	// Example output: "Jan 15, 2015, 2:30 PM GMT+2"
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
		timeZoneName: 'short',
	}).format(d);
};

export const isCheckoutPage = (url: string) => url.indexOf('/checkout/') >= 0;

export const generateDocumentHead = (
	url = DEFAULT_METADATA_URL,
	title = DEFAULT_METADATA_TITLE,
	description = DEFAULT_METADATA_DESCRIPTION,
	image = DEFAULT_METADATA_IMAGE
) => {
	const OG_METATAGS = [
		{ property: 'og:type', content: 'website' },
		{ property: 'og:url', content: url },
		{ property: 'og:title', content: title },
		{
			property: 'og:description',
			content: description,
		},
		{
			property: 'og:image',
			content: image ? image + '?w=800&h=800&format=webp' : undefined,
		},
	];
	const TWITTER_METATAGS = [
		{ property: 'twitter:card', content: 'summary_large_image' },
		{ property: 'twitter:url', content: url },
		{ property: 'twitter:title', content: title },
		{
			property: 'twitter:description',
			content: description,
		},
		{
			property: 'twitter:image',
			content: image ? image + '?w=800&h=800&format=webp' : undefined,
		},
	];
	return { title, meta: [...OG_METATAGS, ...TWITTER_METATAGS] };
};

export const slugToRoute = (slug: string) => {
	const entityName = slugToCustomizableClass(slug);
	switch (entityName) {
		case CustomizableClassName.CustomNameTag:
			return `/products/${slug}/customizable`;
		default:
			return `/products/${slug}/default`;
	}
};

export enum CustomizableClassName {
	Default = 'Default',
	CustomNameTag = 'CustomNameTag',
	DummyCustomProduct = 'DummyCustomProduct',
}

export const slugToCustomizableClass = (slug: string): CustomizableClassName => {
	switch (slug) {
		case 'customizable-key-ring':
			return CustomizableClassName.CustomNameTag;
		case 'dummy-custom-product':
			return CustomizableClassName.DummyCustomProduct;
		default:
			return CustomizableClassName.Default;
	}
};

export const getGoogleFontLink = (fontMenuItems: FONT_MENU[]): string => {
	const fontFamilies = fontMenuItems
		.map((font) => font.name.split(' (')[0].replace(/ /g, '+'))
		.join('&family='); // join the font family with &family=
	return `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;
};

export const isGuestCustomer = (appState: AppState): boolean => {
	return appState.customer.id === CUSTOMER_NOT_DEFINED_ID;
};

/**
 * Async generic helper to normalize GraphQL/Vendure mutation results which
 * may return either a success payload or an ErrorResult (with errorCode/message).
 * Accepts either a value or a promise and returns the success value T on
 * success, or null on error (after logging).
 */
export async function handleGqlResult<TSuccess = any>(
	resultOrPromise: unknown
): Promise<TSuccess | null> {
	const result = await (resultOrPromise as Promise<unknown>);
	if (result == null) return null;

	if (typeof result === 'object' && result !== null && 'errorCode' in (result as any)) {
		// eslint-disable-next-line no-console
		console.error(`${(result as any).errorCode}: ${(result as any).message}`);
		return null;
	}

	return result as TSuccess;
}

export async function loadCustomerData(): Promise<ActiveCustomer> {
	const activeCustomer = await getActiveCustomerQuery();

	if (activeCustomer) {
		return {
			id: activeCustomer.id,
			title: activeCustomer.title ?? '',
			firstName: activeCustomer.firstName,
			lastName: activeCustomer.lastName,
			emailAddress: activeCustomer.emailAddress,
			phoneNumber: activeCustomer.phoneNumber ?? '',
			upvoteReviewIds: activeCustomer.customFields?.upvoteReviews || [],
		};
	}

	return {
		id: CUSTOMER_NOT_DEFINED_ID,
		title: '',
		firstName: '',
		lastName: '',
		emailAddress: '',
		phoneNumber: '',
		upvoteReviewIds: [],
	};
}
