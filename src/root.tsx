import { $, component$, useOnDocument, useStyles$ } from '@qwik.dev/core';
import { QwikRouterProvider, RouterOutlet, ServiceWorkerRegister } from '@qwik.dev/router';
import { Head } from './components/head/head';

import globalStyles from './global.css?inline';
import { useI18n } from './utils/i18n';

export default component$(() => {
	/**
	 * The root of a QwikCity site always start with the <QwikCityProvider> component,
	 * immediately followed by the document's <head> and <body>.
	 *
	 * Don't remove the `<head>` and `<body>` elements.
	 */
	useStyles$(globalStyles);
	useOnDocument('qinit', $(useI18n));

	return (
		<QwikRouterProvider>
			<Head />
			<body lang="en">
				<RouterOutlet />
				<ServiceWorkerRegister />
			</body>
		</QwikRouterProvider>
	);
});
