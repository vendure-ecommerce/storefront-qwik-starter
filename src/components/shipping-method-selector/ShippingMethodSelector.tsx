import { component$, useContext, useStore, useTask$ } from '@builder.io/qwik';
import { APP_STATE } from '~/constants';
import { setOrderShippingMethodMutation } from '~/graphql/mutations';
import { getEligibleShippingMethodsQuery } from '~/graphql/queries';
import { ActiveOrder, EligibleShippingMethods } from '~/types';
import { formatPrice } from '~/utils';
import { execute } from '~/utils/api';
import CheckCircleIcon from '../icons/CheckCircleIcon';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const currencyCode = useContext(APP_STATE).activeOrder?.currencyCode || 'USD';
	const state = useStore<{ selected: number; methods: EligibleShippingMethods[] }>({
		selected: 1,
		methods: [],
	});

	useTask$(async () => {
		const { eligibleShippingMethods } = await execute<{
			eligibleShippingMethods: EligibleShippingMethods[];
		}>(getEligibleShippingMethodsQuery());
		state.methods = eligibleShippingMethods;
	});

	useTask$(async (tracker) => {
		const selected = tracker.track(() => state.selected);
		const { setOrderShippingMethod: activeOrder } = await execute<{
			setOrderShippingMethod: ActiveOrder;
		}>(setOrderShippingMethodMutation(selected.toString()));
		appState.activeOrder = activeOrder;
	});

	return (
		<div>
			<label class="text-lg font-medium text-gray-900">Delivery method</label>
			<div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
				{state.methods.map((method, index) => (
					<div
						key={index}
						class={`relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none`}
						onClick$={() => (state.selected = index + 1)}
					>
						<span class="flex-1 flex">
							<span class="flex flex-col">
								<span class="block text-sm font-medium text-gray-900">{method.name}</span>
								<span class="mt-6 text-sm font-medium text-gray-900">
									{formatPrice(method.price, currencyCode)}
								</span>
							</span>
						</span>
						{state.selected === index + 1 && <CheckCircleIcon />}
						<span
							class={`border-2 ${
								state.selected === index + 1 ? 'border-primary-500' : ''
							} absolute -inset-px rounded-lg pointer-events-none`}
						></span>
					</div>
				))}
			</div>
		</div>
	);
});
