import {
	$,
	component$,
	Slot,
	useClientEffect$,
	useContextProvider,
	useOn,
	useStore,
	useTask$,
} from '@builder.io/qwik';
import { isBrowser, isServer } from '@builder.io/qwik/build';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { getActiveOrderQuery, getCollectionsQuery } from '~/graphql/queries';
import { ActiveCustomer, ActiveOrder, AppState, Collection } from '~/types';
import { execute } from '~/utils/api';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';

export default component$(() => {
	const state = useStore<AppState>({
		collections: [],
		activeOrder: {} as ActiveOrder,
		showCart: false,
		customer: { id: CUSTOMER_NOT_DEFINED_ID, firstName: '', lastName: '' } as ActiveCustomer,
	});
	useContextProvider(APP_STATE, state);

	useTask$(async () => {
		if (isServer) {
			const { collections } = await execute<{
				collections: { items: Collection[] };
			}>(getCollectionsQuery());
			state.collections = collections.items;
		}
	});

	// with useTask$ doesn't have the same behaviour
	useClientEffect$(async () => {
		if (isBrowser) {
			window.scrollTo(0, 0);
			const { activeOrder } = await execute<{ activeOrder: ActiveOrder }>(getActiveOrderQuery());
			state.activeOrder = activeOrder;
		}
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
