import { component$, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import OrderCard from '~/components/account/OrderCard';
import AnimatedSpinnerIcon from '~/components/icons/AnimatedSpinnerIcon';
import { Customer, Order } from '~/generated/graphql';
import { getActiveCustomerOrdersQuery } from '~/providers/shop/customer/customer';
import { batchUpdateShippoFulfillmentStateMutation } from '~/providers/shop/orders/order';

export default component$(() => {
	const activeCustomerOrdersSignal = useSignal<Customer>();
	const isLoading = useSignal(true);

	useVisibleTask$(async () => {
		isLoading.value = true;
		await batchUpdateShippoFulfillmentStateMutation(); // Update shippo fulfillment states on load
		activeCustomerOrdersSignal.value = await getActiveCustomerOrdersQuery();
		isLoading.value = false;
	});

	if (isLoading.value) {
		return (
			<div class="h-[60vh] flex items-center justify-center">
				<p>Loading your orders...</p>
				<AnimatedSpinnerIcon forcedClass="h-48 w-48" />
			</div>
		);
	}

	return activeCustomerOrdersSignal.value ? (
		<div class="max-w-6xl m-auto rounded-lg p-4 space-y-4">
			<div class="flex flex-wrap gap-6 justify-evenly">
				{(activeCustomerOrdersSignal.value?.orders?.items || []).map((order: Order) => (
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
