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
import { extractBase, setSsrLocaleGetter } from 'compiled-i18n/qwik';
import Root from './root';

setSsrLocaleGetter();

export default function (opts: RenderToStreamOptions) {
	return renderToStream(<Root />, {
		manifest,
		...opts,
		base: extractBase,
		// Use container attributes to set attributes on the html tag.
		containerAttributes: {
			lang: opts.serverData!.locale,
			...opts.containerAttributes,
		},
	});
}
