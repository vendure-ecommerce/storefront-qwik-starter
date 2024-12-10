import { createContextId } from '@builder.io/qwik';
import { ENV_VARIABLES } from '~/env';
import { AppState } from './types';
export const APP_STATE = createContextId<AppState>('app_state');
export const AUTH_TOKEN = 'authToken';
export const CUSTOMER_NOT_DEFINED_ID = 'CUSTOMER_NOT_DEFINED_ID';
export const HEADER_AUTH_TOKEN_KEY = 'vendure-auth-token';
export const IMAGE_RESOLUTIONS = [1000, 800, 600, 400];
export const HOMEPAGE_IMAGE = '/homepage.webp';
export const DEFAULT_METADATA_URL = 'https://qwik-storefront.vendure.io/';
export const DEFAULT_METADATA_TITLE = 'Vendure Qwik Storefront';
export const DEFAULT_METADATA_DESCRIPTION =
	'A headless commerce storefront starter kit built with Vendure & Qwik';
export const DEFAULT_METADATA_IMAGE = 'https://qwik-storefront.vendure.io/social-image.png';
export const DEFAULT_LOCALE = 'en';
export const DEV_API = ENV_VARIABLES.VITE_VENDURE_DEV_URL || 'https://readonlydemo.vendure.io';
export const PROD_API = ENV_VARIABLES.VITE_VENDURE_PROD_URL || 'https://readonlydemo.vendure.io';
export const LOCAL_API = ENV_VARIABLES.VITE_VENDURE_LOCAL_URL || 'http://localhost:3000';
