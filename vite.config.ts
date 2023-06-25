import { qwikCity } from '@builder.io/qwik-city/vite';
import { insightsEntryStrategy } from '@builder.io/qwik-labs/vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(async () => {
	return {
		ssr: { target: 'webworker' },
		plugins: [
			qwikCity(),
			qwikVite({
				entryStrategy: await insightsEntryStrategy({
					publicApiKey: loadEnv('', '.').VITE_QWIK_INSIGHTS_KEY,
				}),
			}),
			tsconfigPaths(),
		],
		preview: {
			headers: {
				'Cache-Control': 'public, max-age=600',
			},
		},
	};
});
