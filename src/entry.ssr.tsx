/**
 * WHAT IS THIS FILE?
 *
 * SSR entry point, in all cases the application is rendered outside the browser, this
 * entry point will be the common one.
 *
 * - Server (express, cloudflare...)
 * - pnpm start
 * - pnpm preview
 * - pnpm build
 *
 */
import { manifest } from '@qwik-client-manifest';
import { renderToStream, RenderToStreamOptions } from '@qwik.dev/core/server';
import Root from './root';

export default function (opts: RenderToStreamOptions) {
	return renderToStream(<Root />, {
		manifest,
		...opts,
		// Use container attributes to set attributes on the html tag.
		containerAttributes: {
			lang: 'en-us',
			...opts.containerAttributes,
		},
	});
}
