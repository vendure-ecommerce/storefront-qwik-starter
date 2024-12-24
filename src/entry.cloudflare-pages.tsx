/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for Cloudflare Pages when building for production.
 *
 * Learn more about the Cloudflare Pages integration here:
 * - https://qwik.builder.io/docs/deployments/cloudflare-pages/
 *
 */
import {
	createQwikRouter,
	type PlatformCloudflarePages,
} from '@qwik.dev/router/middleware/cloudflare-pages';
import qwikCityPlan from '@qwik-city-plan';
import { manifest } from '@qwik-client-manifest';
import render from './entry.ssr';

declare global {
	interface QwikCityPlatform extends PlatformCloudflarePages {}
}

const fetch = createQwikRouter({ render, qwikCityPlan, manifest });

export { fetch };
