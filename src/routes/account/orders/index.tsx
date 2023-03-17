import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import OrderCard from '~/components/account/OrderCard';
import { getActiveCustomerOrdersQuery } from '~/graphql/queries';
import { ActiveCustomerOrders } from '~/types';
import { scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const activeCustomerOrdersSignal = useSignal<ActiveCustomerOrders>();

	useVisibleTask$(async () => {
		const { activeCustomer: activeCustomerOrders } = await execute<{
			activeCustomer: ActiveCustomerOrders;
		}>(getActiveCustomerOrdersQuery());
		activeCustomerOrdersSignal.value = activeCustomerOrders;
		scrollToTop();
	});

	return activeCustomerOrdersSignal.value ? (
		<div class="max-w-6xl m-auto rounded-lg p-4 space-y-4">
			<div class="flex flex-wrap gap-6 justify-evenly">
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
