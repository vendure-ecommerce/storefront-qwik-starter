import {
	$,
	component$,
	Slot,
	useContextProvider,
	useOn,
	useStore,
	useTask$,
} from '@builder.io/qwik';
import { isBrowser, isServer } from '@builder.io/qwik/build';
import { APP_STATE } from '~/constants';
import { getActiveOrderQuery, getCollectionsQuery } from '~/graphql/queries';
import { ActiveOrder, AppState, Collection } from '~/types';
import { execute } from '~/utils/api';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';

export default component$(() => {
	const state = useStore<AppState>({
		collections: [],
		activeOrder: {} as ActiveOrder,
		showCart: false,
	});
	useContextProvider(APP_STATE, state);

	useTask$(async () => {
		if (isServer) {
			const { collections } = await execute<{
				collections: { items: Collection[] };
			}>(getCollectionsQuery());
			state.collections = collections.items;
		}
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
