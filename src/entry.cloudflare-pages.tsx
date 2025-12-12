/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for Cloudflare Pages when building for production.
 *
 * Learn more about the Cloudflare Pages integration here:
 * - https://qwik.builder.io/docs/deployments/cloudflare-pages/
 *
 */
// Import the middleware namespace and resolve the router factory at runtime
// to avoid TypeScript type mismatches between versions.
import * as qwikCityCF from '@builder.io/qwik-city/middleware/cloudflare-pages';
type PlatformCloudflarePages = any;
const createQwikRouter: any = (qwikCityCF as any).createQwikRouter ?? (qwikCityCF as any).default;
import qwikCityPlan from '@qwik-city-plan';
import { manifest } from '@qwik-client-manifest';
import render from './entry.ssr';

declare global {
	interface QwikCityPlatform extends PlatformCloudflarePages {}
}

const fetch = createQwikRouter({ render, qwikCityPlan, manifest });

export { fetch };
