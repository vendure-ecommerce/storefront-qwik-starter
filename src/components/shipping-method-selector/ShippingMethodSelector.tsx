import { component$, useStore, useTask$ } from '@builder.io/qwik';
import { getEligibleShippingMethodsQuery } from '~/providers/shop/checkout/checkout';
import { setOrderShippingMethodMutation } from '~/providers/shop/orders/order';
import { AppState, EligibleShippingMethods } from '~/types';
import { formatPrice } from '~/utils';
import CheckCircleIcon from '../icons/CheckCircleIcon';

type Props = {
	appState: AppState;
};

export default component$<Props>(({ appState }) => {
	const currencyCode = appState.activeOrder.currencyCode || 'USD';
	const state = useStore<{ selectedMethodId: string; methods: EligibleShippingMethods[] }>({
		selectedMethodId: '',
		methods: [],
	});

	useTask$(async () => {
		state.methods = await getEligibleShippingMethodsQuery();
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
						<span class="flex-1 flex">
							<span class="flex flex-col">
								<span class="block text-sm font-medium text-gray-900">{method.name}</span>
								<span class="mt-6 text-sm font-medium text-gray-900">
									{formatPrice(method.priceWithTax, currencyCode)}
								</span>
							</span>
						</span>
						{state.selectedMethodId === method.id && <CheckCircleIcon />}
						<span
							class={`border-2 ${
								state.selectedMethodId === method.id ? 'border-primary-500' : ''
							} absolute -inset-px rounded-lg pointer-events-none`}
						></span>
					</div>
				))}
			</div>
		</div>
	);
});
