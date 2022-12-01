import { createQwikCity } from '@builder.io/qwik-city/middleware/cloudflare-pages';
import qwikCityPlan from '@qwik-city-plan';
import render from './entry.ssr';

/**
 * Cloudflare Pages Request Handler
 */
const qwikCityMiddleware = createQwikCity({ render, qwikCityPlan });

export const onRequest = [qwikCityMiddleware];
