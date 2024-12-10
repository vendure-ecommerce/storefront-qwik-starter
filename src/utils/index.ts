// utils/index.ts
import {
	DEFAULT_METADATA_DESCRIPTION,
	DEFAULT_METADATA_IMAGE,
	DEFAULT_METADATA_TITLE,
	DEFAULT_METADATA_URL,
	DEFAULT_LOCALE,
} from '~/constants';
import { ENV_VARIABLES } from '~/env';
import { SearchResponse } from '~/generated/graphql';
import { ActiveCustomer, FacetWithValues, ShippingAddress } from '~/types';

// Language Support
export const languages = [
	{ code: 'en', name: 'English', flag: '🇬🇧' },
	{ code: 'fr', name: 'Français', flag: '🇫🇷' },
	{ code: 'de', name: 'Deutsch', flag: '🇩🇪' },
	{ code: 'it', name: 'Italiano', flag: '🇮🇹' },
	{ code: 'es', name: 'Español', flag: '🇪🇸' },
] as const;

export type SupportedLanguages = (typeof languages)[number]['code'];

export const isValidLanguage = (lang: string): lang is SupportedLanguages => {
	return languages.map((l) => l.code).includes(lang as SupportedLanguages);
};

export const getLanguageCode = async (requestEvent?: {
	headers: Headers;
}): Promise<SupportedLanguages> => {
	// Server-side language detection
	if (requestEvent?.headers) {
		// Try URL language first
		const url = new URL(requestEvent.headers.get('referer') || 'http://localhost');
		const urlLang = url.pathname.split('/')[1];
		if (urlLang && isValidLanguage(urlLang)) {
			return urlLang;
		}

		// Try Accept-Language header
		const acceptLanguage = requestEvent.headers.get('accept-language');
		if (acceptLanguage) {
			const preferredLanguages = acceptLanguage
				.split(',')
				.map((lang) => lang.split(';')[0].split('-')[0].toLowerCase());

			const matchedLang = preferredLanguages.find((lang) =>
				languages.some((supportedLang) => supportedLang.code === lang)
			);

			if (matchedLang && isValidLanguage(matchedLang)) {
				return matchedLang;
			}
		}
	}

	// Client-side language detection
	if (typeof window !== 'undefined') {
		// Try URL language
		const urlLang = window.location.pathname.split('/')[1];
		if (urlLang && isValidLanguage(urlLang)) {
			return urlLang;
		}

		// Try localStorage
		try {
			const storedLang = localStorage.getItem('lang');
			if (storedLang && isValidLanguage(storedLang)) {
				return storedLang;
			}
		} catch (e) {
			console.warn('localStorage is not available:', e);
		}

		// Try browser language
		try {
			const browserLangs = navigator.languages || [navigator.language];
			const simpleLangs = browserLangs.map((lang) => lang.split('-')[0]);
			const matchedLang = simpleLangs.find((lang) =>
				languages.some((supportedLang) => supportedLang.code === lang)
			);

			if (matchedLang && isValidLanguage(matchedLang)) {
				return matchedLang;
			}
		} catch (e) {
			console.warn('Navigator languages are not available:', e);
		}
	}

	return DEFAULT_LOCALE as SupportedLanguages;
};

// Existing Utils
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
		orderAddress.countryCode &&
		orderAddress.phoneNumber
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

export const formatDateTime = (dateToConvert: Date) => {
	const result = new Date(dateToConvert).toISOString();
	const [date, time] = result.split('T');
	const [hour, minutes] = time.split(':');
	const orderedDate = date.split('-').reverse().join('-');
	return `${orderedDate} ${hour}:${minutes}`;
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
