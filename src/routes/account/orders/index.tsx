import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import OrderCard from '~/components/account/OrderCard';
import { scrollToTop } from '~/utils';
import { getActiveCustomerOrdersQuery } from '~/providers/customer/customer';
import { Customer, Order } from '~/generated/graphql';

export default component$(() => {
	const activeCustomerOrdersSignal = useSignal<Customer>();

	useVisibleTask$(async () => {
		activeCustomerOrdersSignal.value = await getActiveCustomerOrdersQuery();
		scrollToTop();
	});

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
