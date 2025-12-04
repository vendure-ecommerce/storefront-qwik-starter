import {
	$,
	Slot,
	component$,
	useContextProvider,
	useOn,
	useStore,
	useVisibleTask$,
} from '@qwik.dev/core';
import { RequestHandler, routeLoader$ } from '@qwik.dev/router';
import { ImageTransformerProps, useImageProvider } from 'qwik-image';
import Menu from '~/components/menu/Menu';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID, IMAGE_RESOLUTIONS } from '~/constants';
import { Order } from '~/generated/graphql';
import { getAvailableCountriesQuery } from '~/providers/shop/checkout/checkout';
import { getCollections } from '~/providers/shop/collections/collections';
import {
	customizableClassDefFindAll,
	filamentColorFindSupported,
	fontMenuFindAll,
} from '~/providers/shop/orders/customizable-order';
import { getActiveOrderQuery } from '~/providers/shop/orders/order';
import { ActiveCustomer, AppState } from '~/types';
import { getDefaultCustomNameTagOptions, getGoogleFontLink, loadCustomerData } from '~/utils';
import { parseCustomizableClassDef } from '~/utils/customizable-order';
import { extractLang } from '~/utils/i18n';
import Cart from '../components/cart/Cart';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import {
	CUSTOMIZABLE_CLASS_DEF_TAG,
	CustomizableClassDefTag,
	DEFAULT_OPTIONS_FOR_NAME_TAG,
	DefaultOptionsForNameTag,
} from './constants';

export const onGet: RequestHandler = async ({ cacheControl }) => {
	cacheControl({ staleWhileRevalidate: 60 * 60 * 24 * 7, maxAge: 5 });
};

export const useCollectionsLoader = routeLoader$(async () => {
	return await getCollections();
});

export const useAvailableCountriesLoader = routeLoader$(async () => {
	return await getAvailableCountriesQuery();
});

export const onRequest: RequestHandler = ({ request, locale }) => {
	locale(extractLang(request.headers.get('accept-language'), request.url));
};

export const useFilamentColor = routeLoader$(async () => {
	return await filamentColorFindSupported();
});
export const useFontMenu = routeLoader$(async () => {
	return await fontMenuFindAll();
});

export const useCustomizableClassDef = routeLoader$(async () => {
	return await customizableClassDefFindAll();
});

export default component$(() => {
	const imageTransformer$ = $(({ src, width, height }: ImageTransformerProps): string => {
		return `${src}?w=${width}&h=${height}&format=webp`;
	});

	// Provide your default options
	useImageProvider({
		imageTransformer$,
		resolutions: IMAGE_RESOLUTIONS,
	});

	const collectionsSignal = useCollectionsLoader();
	const availableCountriesSignal = useAvailableCountriesLoader();

	const state = useStore<AppState>({
		showCart: false,
		showMenu: false,
		customer: {
			id: CUSTOMER_NOT_DEFINED_ID,
			firstName: '',
			lastName: '',
			upvoteReviewIds: [],
			downvoteReviewIds: [],
		} as ActiveCustomer,
		activeOrder: {} as Order,
		collections: collectionsSignal.value || [],
		availableCountries: availableCountriesSignal.value || [],
		shippingAddress: {
			id: '',
			city: '',
			company: '',
			countryCode:
				availableCountriesSignal.value && availableCountriesSignal.value.length > 0
					? availableCountriesSignal.value[0].code
					: '',
			fullName: '',
			phoneNumber: '',
			postalCode: '',
			province: '',
			streetLine1: '',
			streetLine2: '',
		},
		addressBook: [],
	});

	// Note that this context APP_STATE holds the reference to state object (like a pointer),
	// so any changes to state will be reflected in the context value, and it will be reflected
	// for all consumers of this context (by `useContext(APP_STATE)` in other components)
	useContextProvider(APP_STATE, state);

	const FilamentColorSignal = useFilamentColor(); // Load the Filament_Color from db
	const FontMenuSignal = useFontMenu(); // Load the Font_Menu from db
	const CustomizableClassDefSignal = useCustomizableClassDef(); // Load the Customizable_Class_Def from db

	const defaultOptionsForNameTag = useStore<DefaultOptionsForNameTag>(() => {
		return getDefaultCustomNameTagOptions(FontMenuSignal.value, FilamentColorSignal.value);
	});

	useContextProvider(DEFAULT_OPTIONS_FOR_NAME_TAG, defaultOptionsForNameTag);

	const customizableClassDefTag = useStore<CustomizableClassDefTag[]>(() => {
		return parseCustomizableClassDef(CustomizableClassDefSignal.value);
	});

	useContextProvider(CUSTOMIZABLE_CLASS_DEF_TAG, customizableClassDefTag);

	useVisibleTask$(async () => {
		// This should happen once when the layout is initialized
		// This shouldn't happen on every navigation (if so, please use <Link> instead of <a href...>)
		console.log('Layout useVisibleTask$ running...');
		state.customer = await loadCustomerData();
		const activeOrder = await getActiveOrderQuery();
		if (activeOrder) state.activeOrder = activeOrder;

		const fontLink = getGoogleFontLink(FontMenuSignal.value);
		const existingLink = document.querySelector(`link[href="${fontLink}"]`);
		if (!existingLink) {
			const linkElement = document.createElement('link');
			linkElement.rel = 'stylesheet';
			linkElement.href = fontLink;
			document.head.appendChild(linkElement);
		}
	});

	useVisibleTask$(({ track }) => {
		track(() => state.showCart);
		track(() => state.showMenu);

		state.showCart || state.showMenu
			? document.body.classList.add('overflow-hidden')
			: document.body.classList.remove('overflow-hidden');
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
			<Cart />
			<Menu />
			<main class="pb-12 bg-gray-50">
				<Slot />
			</main>
			<Footer />
		</div>
	);
});
