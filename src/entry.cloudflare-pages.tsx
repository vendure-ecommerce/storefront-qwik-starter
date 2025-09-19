/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for Cloudflare Pages when building for production.
 *
 * Learn more about the Cloudflare Pages integration here:
 * - https://qwik.builder.io/docs/deployments/cloudflare-pages/
 *
 */
import { manifest } from '@qwik-client-manifest';
import {
	createQwikRouter,
	type PlatformCloudflarePages,
} from '@qwik.dev/router/middleware/cloudflare-pages';
import render from './entry.ssr';

declare global {
	interface QwikCityPlatform extends PlatformCloudflarePages {}
}

const fetch = createQwikRouter({ render, manifest });

export { fetch };
