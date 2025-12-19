import { ImageTransformerProps, useImageProvider } from 'qwik-image';
import { Decorator, Parameters } from 'storybook-framework-qwik';

import { $, component$, useContextProvider } from '@builder.io/qwik';
import { QwikCityMockProvider } from '@builder.io/qwik-city';
import { Country } from '~/generated/graphql';
import { APP_STATE, IMAGE_RESOLUTIONS } from '../src/constants';
import '../src/global.css';
import { ActiveCustomer, AppState } from '../src/types';
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

/**
 * Global mock for APP_STATE context
 */
const mockAppState: AppState = {
	collections: [],
	activeOrder: {} as any,
	showCart: false,
	showMenu: false,
	customer: {
		id: 'mock-customer-id',
		title: 'Mr.',
		firstName: 'Customer',
		lastName: 'NotGuest',
		emailAddress: 'guest@example.com',
		phoneNumber: '555-0100',
	} as ActiveCustomer,
	shippingAddress: {} as any,
	availableCountries: [{ code: 'US' }, { code: 'CA' }] as Country[],
	addressBook: [],
	purchasedVariantsWithReviewStatus: [],
};

/**
 * Global decorator to provide context defined in src/routes/layout.tsx
 */
const WithAppState = component$<{ story: any }>(({ story }) => {
	// Provide the mock APP_STATE context to all stories
	useContextProvider(APP_STATE, mockAppState);
	const imageTransformer$ = $(({ src, width, height }: ImageTransformerProps): string => {
		return `${src}?w=${width}&h=${height}&format=webp`;
	});

	// Provide your default options
	useImageProvider({
		imageTransformer$,
		resolutions: IMAGE_RESOLUTIONS,
	});
	return <>{story}</>;
});

export const decorators: Decorator[] = [
	(Story) => <WithAppState story={<Story />} />,
	(Story) => <QwikCityMockProvider>{<Story />}</QwikCityMockProvider>,
];
