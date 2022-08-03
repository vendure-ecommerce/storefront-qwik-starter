import { qwikCity } from '@builder.io/qwik-city/middleware/cloudflare-pages';
import render from './entry.ssr';

/**
 * Cloudflare Pages Request Handler
 */
const qwikCityMiddleware = qwikCity(render, {
	prefetchStrategy: {
		implementation: 'link-prefetch',
	},
});

export const onRequest = [qwikCityMiddleware];
