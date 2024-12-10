import {
	$,
	Slot,
	component$,
	useContextProvider,
	useOn,
	useStore,
	useVisibleTask$,
} from '@builder.io/qwik';
import { RequestHandler, routeLoader$, useLocation, useNavigate } from '@builder.io/qwik-city';
import { ImageTransformerProps, useImageProvider } from 'qwik-image';
import Cart from '~/components/cart/Cart';
import Footer from '~/components/footer/footer';
import Header from '~/components/header/header';
import Menu from '~/components/menu/Menu';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID, IMAGE_RESOLUTIONS } from '~/constants';
import { Collection as CollectionGql, Order } from '~/generated/graphql';
import { getAvailableCountriesQuery } from '~/providers/shop/checkout/checkout';
import { getCollections } from '~/providers/shop/collections/collections';
import { getActiveOrderQuery } from '~/providers/shop/orders/order';
import type { AppState } from '~/types';

const SUPPORTED_LANGUAGES = ['en', 'fr', 'de', 'it', 'es'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const getBrowserLanguage = (acceptLanguage: string | null): SupportedLanguage => {
	if (!acceptLanguage) return 'en';

	// Extract language codes from Accept-Language header
	const languages = acceptLanguage
		.split(',')
		.map((lang) => lang.split(';')[0].trim().toLowerCase())
		.map((lang) => lang.split('-')[0]); // Handle cases like 'en-US'

	// Find the first matching supported language
	const matchedLang = languages.find((lang) =>
		SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
	) as SupportedLanguage;

	return matchedLang || 'en';
};

export const onRequest: RequestHandler = ({ request, locale, redirect }) => {
	const url = new URL(request.url);
	const pathSegments = url.pathname.split('/').filter(Boolean);
	const currentLang = pathSegments[0] as SupportedLanguage;

	// If no language in URL or unsupported language
	if (!currentLang || !SUPPORTED_LANGUAGES.includes(currentLang)) {
		const browserLang = getBrowserLanguage(request.headers.get('accept-language'));
		throw redirect(301, `/${browserLang}${url.pathname}`);
	}

	locale(currentLang);
};

export const onGet: RequestHandler = async ({ cacheControl }) => {
	cacheControl({ staleWhileRevalidate: 60 * 60 * 24 * 7, maxAge: 5 });
};

export const useCollectionsLoader = routeLoader$(async ({ locale }) => {
	const lang = locale();
	try {
		return await getCollections(lang);
	} catch (error) {
		console.error('Failed to fetch collections:', error);
		return [];
	}
});

export const useAvailableCountriesLoader = routeLoader$(async () => {
	try {
		return await getAvailableCountriesQuery();
	} catch (error) {
		console.error('Failed to fetch available countries:', error);
		return [];
	}
});

export default component$(() => {
	const location = useLocation();
	const navigate = useNavigate();

	const imageTransformer$ = $(({ src, width, height }: ImageTransformerProps): string => {
		return `${src}?w=${width}&h=${height}&format=webp`;
	});

	useImageProvider({
		imageTransformer$,
		resolutions: IMAGE_RESOLUTIONS,
	});

	const collectionsSignal = useCollectionsLoader();
	const availableCountriesSignal = useAvailableCountriesLoader();

	const state = useStore<AppState>({
		products: [],
		language: '',
		activeLanguage: null,
		showCart: false,
		showMenu: false,
		customer: { id: CUSTOMER_NOT_DEFINED_ID, firstName: '', lastName: '' },
		activeOrder: {} as Order,
		collections: (collectionsSignal.value as CollectionGql[]) || [],
		availableCountries: availableCountriesSignal.value || [],
		shippingAddress: {
			city: '',
			company: '',
			countryCode: availableCountriesSignal.value?.[0]?.code || '',
			fullName: '',
			phoneNumber: '',
			postalCode: '',
			province: '',
			streetLine1: '',
			streetLine2: '',
		},
		addressBook: [],
	});

	useContextProvider(APP_STATE, state);

	useVisibleTask$(async ({ track }) => {
		track(() => state.language);
		track(() => state.activeLanguage);

		const urlLang = location.url.pathname.split('/')[1] as SupportedLanguage;
		const storedLang = localStorage.getItem('lang') as SupportedLanguage;

		let selectedLang: SupportedLanguage = 'en';
		if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
			selectedLang = urlLang;
		} else if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
			selectedLang = storedLang;
		} else {
			const browserLang = getBrowserLanguage(navigator.languages.join(','));
			selectedLang = browserLang;
			navigate(`/${browserLang}${location.url.pathname}`);
		}

		localStorage.setItem('lang', selectedLang);
		state.language = selectedLang;
		state.activeLanguage = selectedLang;

		try {
			const collections = await getCollections(selectedLang);
			state.collections = collections;
			state.activeOrder = await getActiveOrderQuery();
		} catch (error) {
			console.error('Failed to fetch data:', error);
		}
	});

	useVisibleTask$(({ track }) => {
		track(() => state.showCart);
		track(() => state.showMenu);
		document.body.classList.toggle('overflow-hidden', state.showCart || state.showMenu);
	});

	useOn(
		'keydown',
		$((event: unknown) => {
			if ((event as KeyboardEvent).key === 'Escape') {
				state.showCart = false;
				state.showMenu = false;
			}
		})
	);

	return (
		<div>
			<Header />
			{state.showCart && <Cart />}
			{state.showMenu && <Menu />}
			<main class="pb-12 bg-gray-50">
				<Slot />
			</main>
			<Footer />
		</div>
	);
});

// import {
// 	$,
// 	Slot,
// 	component$,
// 	useContextProvider,
// 	useOn,
// 	useStore,
// 	useVisibleTask$,
// } from '@builder.io/qwik';
// import { RequestHandler, routeLoader$ } from '@builder.io/qwik-city';
// import { ImageTransformerProps, useImageProvider } from 'qwik-image';
// import Cart from '~/components/cart/Cart';
// import Footer from '~/components/footer/footer';
// import Header from '~/components/header/header';
// import Menu from '~/components/menu/Menu';
// import { APP_STATE, CUSTOMER_NOT_DEFINED_ID, IMAGE_RESOLUTIONS } from '~/constants';
// import { Collection as CollectionGql, Order } from '~/generated/graphql';
// import { getAvailableCountriesQuery } from '~/providers/shop/checkout/checkout';
// import { getCollections } from '~/providers/shop/collections/collections';
// import { getActiveOrderQuery } from '~/providers/shop/orders/order';
// import type { AppState } from '~/types';
// import { extractLang } from '~/utils/i18n';

// export const onGet: RequestHandler = async ({ cacheControl }) => {
// 	cacheControl({ staleWhileRevalidate: 60 * 60 * 24 * 7, maxAge: 5 });
// };

// export const useCollectionsLoader = routeLoader$(async ({ locale }) => {
// 	const lang = locale();
// 	try {
// 		return await getCollections(lang);
// 	} catch (error) {
// 		console.error('Failed to fetch collections:', error);
// 		return [];
// 	}
// });

// export const useAvailableCountriesLoader = routeLoader$(async () => {
// 	try {
// 		return await getAvailableCountriesQuery();
// 	} catch (error) {
// 		console.error('Failed to fetch available countries:', error);
// 		return [];
// 	}
// });

// export const onRequest: RequestHandler = ({ request, locale }) => {
// 	locale(extractLang(request.headers.get('accept-language'), request.url));
// };

// export default component$(() => {
// 	const imageTransformer$ = $(({ src, width, height }: ImageTransformerProps): string => {
// 		return `${src}?w=${width}&h=${height}&format=webp`;
// 	});

// 	useImageProvider({
// 		imageTransformer$,
// 		resolutions: IMAGE_RESOLUTIONS,
// 	});

// 	const collectionsSignal = useCollectionsLoader();
// 	const availableCountriesSignal = useAvailableCountriesLoader();

// 	const state = useStore<AppState>({
// 		products: [],
// 		language: '',
// 		activeLanguage: null,
// 		showCart: false,
// 		showMenu: false,
// 		customer: { id: CUSTOMER_NOT_DEFINED_ID, firstName: '', lastName: '' },
// 		activeOrder: {} as Order,
// 		collections: (collectionsSignal.value as CollectionGql[]) || [],
// 		//@ts-ignore
// 		availableCountries: availableCountriesSignal.value || [],
// 		shippingAddress: {
// 			city: '',
// 			company: '',
// 			countryCode: availableCountriesSignal.value?.[0]?.code || '',
// 			fullName: '',
// 			phoneNumber: '',
// 			postalCode: '',
// 			province: '',
// 			streetLine1: '',
// 			streetLine2: '',
// 		},
// 		addressBook: [],
// 	});

// 	useContextProvider(APP_STATE, state);

// 	useVisibleTask$(async ({ track }) => {
// 		track(() => state.language);
// 		track(() => state.activeLanguage);

// 		const urlLang = window.location.pathname.split('/')[1];
// 		const storedLang = localStorage.getItem('lang');
// 		const supportedLangs = ['en', 'fr', 'de', 'it', 'es'];

// 		let selectedLang = 'en';
// 		if (urlLang && supportedLangs.includes(urlLang)) {
// 			selectedLang = urlLang;
// 		} else if (storedLang && supportedLangs.includes(storedLang)) {
// 			selectedLang = storedLang;
// 		}

// 		state.language = selectedLang;
// 		state.activeLanguage = selectedLang;

// 		try {
// 			const collections = await getCollections(selectedLang);
// 			state.collections = collections;
// 			state.activeOrder = await getActiveOrderQuery();
// 		} catch (error) {
// 			console.error('Failed to fetch data:', error);
// 		}
// 	});

// 	useVisibleTask$(({ track }) => {
// 		track(() => state.showCart);
// 		track(() => state.showMenu);
// 		document.body.classList.toggle('overflow-hidden', state.showCart || state.showMenu);
// 	});

// 	useOn(
// 		'keydown',
// 		$((event: unknown) => {
// 			if ((event as KeyboardEvent).key === 'Escape') {
// 				state.showCart = false;
// 				state.showMenu = false;
// 			}
// 		})
// 	);

// 	return (

// 		<div>

// 			<Header />
// 			{state.showCart && <Cart />}
// 			{state.showMenu && <Menu />}
// 			<main class="pb-12 bg-gray-50">
// 				<Slot />
// 			</main>
// 			<Footer />
// 		</div>

// 	);
// });
