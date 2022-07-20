import {
	component$,
	Host,
	mutable,
	Slot,
	useContextProvider,
	useServerMount$,
	useStore,
} from '@builder.io/qwik';
import { APP_STATE } from '~/constants';
import { getActiveOrderQuery, getCollectionsQuery } from '~/graphql/queries';
import { ActiveOrder, Collection } from '~/types';
import { sendQuery } from '~/utils/api';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';

export default component$(() => {
	const state = useStore<{ collections: Collection[]; activeOrder: ActiveOrder }>({
		collections: [],
		activeOrder: {} as ActiveOrder,
	});
	useServerMount$(async () => {
		const { collections } = await sendQuery<{ collections: { items: Collection[] } }>(
			getCollectionsQuery()
		);
		state.collections = collections.items;
		const { activeOrder } = await sendQuery<{ activeOrder: ActiveOrder }>(getActiveOrderQuery());
		state.activeOrder = activeOrder;
	});
	useContextProvider(APP_STATE, state);

	return (
		<Host>
			<Header totalQuantity={mutable(state.activeOrder?.totalQuantity || 0)} />
			<main>
				<Slot />
			</main>
			<Footer />
		</Host>
	);
});
