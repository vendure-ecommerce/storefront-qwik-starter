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
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import {
	getActiveOrderQuery,
	getAvailableCountriesQuery,
	getCollectionsQuery,
} from '~/graphql/queries';
import { ActiveCustomer, ActiveOrder, AppState, Collection, Country } from '~/types';
import { scrollToTop } from '~/utils';
import { execute } from '~/utils/api';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';

export const collectionsLoader$ = routeLoader$(async () => {
	const { collections: collections } = await execute<{
		collections: { items: Collection[] };
	}>(getCollectionsQuery());
	return collections.items;
});

export const availableCountriesLoader$ = routeLoader$(async () => {
	const { availableCountries } = await execute<{ availableCountries: Country[] }>(
		getAvailableCountriesQuery()
	);
	return availableCountries;
});

export default component$(() => {
	const collectionsSignal = collectionsLoader$.use();
	const availableCountriesSignal = availableCountriesLoader$.use();

	const state = useStore<AppState>({
		showCart: false,
		customer: { id: CUSTOMER_NOT_DEFINED_ID, firstName: '', lastName: '' } as ActiveCustomer,
		activeOrder: {} as ActiveOrder,
		collections: collectionsSignal.value || [],
		availableCountries: availableCountriesSignal.value || [],
		shippingAddress: {
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
