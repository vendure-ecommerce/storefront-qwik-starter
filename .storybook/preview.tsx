import { Parameters } from 'storybook-framework-qwik';

import '../src/global.css';
import '../src/utils/localize-shim';

export const parameters: Parameters = {
	a11y: {
		config: {},
		options: {
			checks: { 'color-contrast': { options: { noScroll: true } } },
			restoreScroll: true,
		},
	},
	options: {
		showRoots: true,
	},
	docs: {
		iframeHeight: '200px',
	},
};
