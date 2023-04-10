import { createContextId } from '@builder.io/qwik';
import { AppState } from './types';

export const APP_STATE = createContextId<AppState>('app_state');
export const AUTH_TOKEN = 'authToken';
export const CUSTOMER_NOT_DEFINED_ID = 'CUSTOMER_NOT_DEFINED_ID';
export const HEADER_AUTH_TOKEN_KEY = 'vendure-auth-token';
export const IMAGE_RESOLUTIONS = [1000, 800, 600, 400];
export const HOMEPAGE_IMAGE = '/homepage.webp';
export const IMAGE_PLACEHOLDER_BACKGROUND =
	'linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(166,206,247,1) 0%, rgba(37,99,235,1) 83%);';
export const METADATA_IMAGE = 'https://qwik-storefront.vendure.io/social-image.png';
export const OG_METATAGS = [
	{ property: 'og:type', content: 'website' },
	{ property: 'og:url', content: 'https://qwik-storefront.vendure.io/' },
	{ property: 'og:title', content: 'Vendure Qwik Storefront' },
	{
		property: 'og:description',
		content: 'Qwik, Vendure, e-commerce, starter-kit',
	},
	{
		property: 'og:image',
		content: METADATA_IMAGE,
	},
];
export const TWITTER_METATAGS = [
	{ property: 'twitter:card', content: 'summary_large_image' },
	{ property: 'twitter:url', content: 'https://qwik-storefront.vendure.io/' },
	{ property: 'twitter:title', content: 'Vendure Qwik Storefront' },
	{
		property: 'twitter:description',
		content: 'Qwik, Vendure, e-commerce, starter-kit',
	},
	{
		property: 'twitter:image',
		content: METADATA_IMAGE,
	},
];
