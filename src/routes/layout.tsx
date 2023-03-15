import {
	$,
	component$,
	Slot,
	useBrowserVisibleTask$,
	useContextProvider,
	useOn,
	useStore,
} from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { ImageTransformerProps, useImageProvider } from '~/components/image/Image';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID, IMAGE_RESOLUTIONS } from '~/constants';
import { getActiveOrderQuery, getAvailableCountriesQuery } from '~/graphql/queries';
import { ActiveCustomer, ActiveOrder, AppState, Country } from '~/types';
import { scrollToTop } from '~/utils';
import { execute } from '~/utils/api';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import { getCollections } from '~/providers/collections/collections';
import { Collection } from '~/generated/graphql';

export const useCollectionsLoader = routeLoader$(async () => {
	const { collections } = await getCollections();
	return collections.items as Collection[];
});

export const useAvailableCountriesLoader = routeLoader$(async () => {
	const { availableCountries } = await execute<{ availableCountries: Country[] }>(
		getAvailableCountriesQuery()
	);
	return availableCountries;
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
		customer: { id: CUSTOMER_NOT_DEFINED_ID, firstName: '', lastName: '' } as ActiveCustomer,
		activeOrder: {} as ActiveOrder,
		collections: collectionsSignal.value || [],
		availableCountries: availableCountriesSignal.value || [],
		shippingAddress: {
			id: '',
			city: '',
			company: '',
			countryCode: availableCountriesSignal.value[0].code,
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

	useBrowserVisibleTask$(async () => {
		scrollToTop();
		const { activeOrder } = await execute<{ activeOrder: ActiveOrder }>(getActiveOrderQuery());
		state.activeOrder = activeOrder;
	});

	useOn(
		'keydown',
		$((event: unknown) => {
			if ((event as KeyboardEvent).key === 'Escape') {
				state.showCart = false;
			}
		})
	);

	return (
		<div>
			<Header />
			<main>
				<Slot />
			</main>
			<Footer />
		</div>
	);
});
