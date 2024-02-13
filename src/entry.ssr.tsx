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
import { renderToStream, RenderToStreamOptions } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import Root from './root';
import { extractBase } from './utils/i18n';

export default function (opts: RenderToStreamOptions) {
	return renderToStream(<Root />, {
		manifest,
		...opts,
		base: extractBase,
		// Use container attributes to set attributes on the html tag.
		containerAttributes: {
			lang: 'en-us',
			...opts.containerAttributes,
		},
	});
}
