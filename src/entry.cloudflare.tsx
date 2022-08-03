import { qwikCity } from '@builder.io/qwik-city/middleware/cloudflare-pages';
import qwikCityPlan from '@qwik-city-plan';
import render from './entry.ssr';

/**
 * Cloudflare Pages Request Handler
 */
export const onRequest = async (args: any) => {
	const handler = qwikCity(render, {
		...qwikCityPlan,
		prefetchStrategy: { implementation: 'worker-fetch' },
	});
	return await handler(args);
};
