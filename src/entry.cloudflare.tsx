import { qwikCity } from '@builder.io/qwik-city/middleware/cloudflare-pages';
import render from './entry.ssr';

const qwikCityMiddleware = qwikCity(render, {
	prefetchStrategy: {
		implementation: 'link-prefetch',
	},
});

export const onRequestGet = [qwikCityMiddleware];
