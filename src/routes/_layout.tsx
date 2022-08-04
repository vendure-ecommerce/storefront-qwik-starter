import {
	component$,
	Host,
	Slot,
	useClientEffect$,
	useContextProvider,
	useServerMount$,
	useStore,
} from '@builder.io/qwik';
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

	useServerMount$(async () => {
		const { collections } = await execute<{ collections: { items: Collection[] } }>(
			getCollectionsQuery()
		);
		state.collections = collections.items;
	});

	useClientEffect$(async () => {
		window.scrollTo(0, 0);
		const { activeOrder } = await execute<{ activeOrder: ActiveOrder }>(getActiveOrderQuery());
		state.activeOrder = activeOrder;
	});

	return (
		<Host>
			<Header />
			<main>
				<Slot />
			</main>
			<Footer />
		</Host>
	);
});
