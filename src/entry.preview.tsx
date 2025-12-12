/*
 * WHAT IS THIS FILE?
 *
 * It's the bundle entry point for `pnpm preview`.
 * That is, serving your app built in production mode.
 *
 * Feel free to modify this file, but don't remove it!
 *
 * Learn more about Vite's preview command:
 * - https://vitejs.dev/config/preview-options.html#preview-options
 *
 */
// Import the middleware as a namespace and access the router factory at runtime
// to avoid TypeScript errors if the installed package's types don't include
// the named export. We then fallback to `.default` as a last resort.
import * as qwikCityNode from '@builder.io/qwik-city/middleware/node';
const createQwikRouter: any =
	(qwikCityNode as any).createQwikRouter ?? (qwikCityNode as any).default;
import qwikCityPlan from '@qwik-city-plan';
import render from './entry.ssr';

/**
 * The default export is the QwikCity adapter used by Vite preview.
 */
export default createQwikRouter({ render, qwikCityPlan });
