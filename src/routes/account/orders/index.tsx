import { component$, useBrowserVisibleTask$, useSignal } from '@builder.io/qwik';
import OrderCard from '~/components/account/OrderCard';
import { getActiveCustomerOrdersQuery } from '~/graphql/queries';
import { ActiveCustomerOrders } from '~/types';
import { scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const activeCustomerOrdersSignal = useSignal<ActiveCustomerOrders>();

	useBrowserVisibleTask$(async () => {
		const { activeCustomer: activeCustomerOrders } = await execute<{
			activeCustomer: ActiveCustomerOrders;
		}>(getActiveCustomerOrdersQuery());
		activeCustomerOrdersSignal.value = activeCustomerOrders;
		scrollToTop();
	});

	return activeCustomerOrdersSignal.value ? (
		<div class="min-h-[24rem] max-w-6xl m-auto rounded-lg p-4 space-y-4">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-md md:max-w-6xl mx-auto">
				{(activeCustomerOrdersSignal.value?.orders?.items || []).map((order) => (
					<div key={order.id}>
						<OrderCard order={order} />
					</div>
				))}
			</div>
		</div>
	) : (
		<div class="h-[100vh]" />
	);
});
