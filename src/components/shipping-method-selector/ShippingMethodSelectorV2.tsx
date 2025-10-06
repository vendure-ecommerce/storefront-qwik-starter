import { component$, useContext, useStore, useTask$ } from '@qwik.dev/core';
import { APP_STATE } from '~/constants';
import { ShippingMethodQuote } from '~/generated/graphql';
import { getEligibleShippingMethodsQuery } from '~/providers/shop/checkout/checkout';
import { setOrderShippingMethodMutation } from '~/providers/shop/orders/order';
import ShippoShippingMethodCard from '../checkout/ShippoShippingMethodCard';

export default component$(() => {
	const appState = useContext(APP_STATE);

	const currencyCode = appState.activeOrder.currencyCode || 'USD';
	const state = useStore<{ selectedMethodId: string; methods: ShippingMethodQuote[] }>({
		selectedMethodId: '',
		methods: [],
	});

	useTask$(async () => {
		state.methods = await getEligibleShippingMethodsQuery();
		// remove dummy shipping methods if any
		state.methods = state.methods.filter((method) => method.name !== 'dummy shipping');
		// preselect the first method
		state.selectedMethodId = state.methods[0]?.id;
	});

	useTask$(async (tracker) => {
		const selected = tracker.track(() => state.selectedMethodId);
		if (selected) {
			appState.activeOrder = await setOrderShippingMethodMutation([selected]);
		}
	});

	return (
		<div>
			<label class="text-lg font-medium text-gray-900">{$localize`Delivery method`}</label>
			<div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
				{state.methods.map((method, index) => (
					<div
						key={method.id}
						class={`relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none`}
						onClick$={() => (state.selectedMethodId = state.methods[index].id)}
					>
						<ShippoShippingMethodCard
							shippingMethod={method}
							checked={state.selectedMethodId === method.id}
						/>
					</div>
				))}
			</div>
		</div>
	);
});
