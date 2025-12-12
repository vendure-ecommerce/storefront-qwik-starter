import { qwikCity } from '@builder.io/qwik-city/vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(async (config) => {
	return {
		// Resolve legacy @qwik.dev/core imports (some older packages still import these names)
		// to the installed '@builder.io/qwik' package so dev SSR can evaluate correctly.
		// resolve: {
		// 	alias: {
		// 		'@qwik.dev/core': '@builder.io/qwik',
		// 		'@qwik.dev/core/server': '@builder.io/qwik/server',
		// 		'@qwik.dev/core/build': '@builder.io/qwik/build',
		// 	},
		// },
		// Enable to analyze via source-map-explorer
		ssr: { target: 'webworker' },
		build: {
			sourcemap: config.mode === 'development',
		},
		plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
		preview: {
			headers: {
				'Cache-Control': 'public, max-age=600',
			},
		},
	};
});
