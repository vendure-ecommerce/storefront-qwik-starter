import {
	component$,
	Signal,
	useComputed$,
	useContext,
	useSignal,
	useStore,
	useVisibleTask$,
} from '@qwik.dev/core';
import { APP_STATE } from '~/constants';
import { CreateAddressInput, ShippingMethodQuote } from '~/generated/graphql';
import { getEligibleShippingMethodsQuery } from '~/providers/shop/checkout/checkout';
import {
	setOrderCustomFieldsMutation,
	setOrderShippingMethodMutation,
} from '~/providers/shop/orders/order';
import { ShippingAddress } from '~/types';
import ShippoShippingMethodCard from '../checkout/ShippoShippingMethodCard';
import AnimatedSpinnerIcon from '../icons/AnimatedSpinnerIcon';

interface IProps {
	reCalculateShipping$: Signal<boolean>;
}

/**
 * I've hunted down the activeOrder.shippingWithTax's change.
 * It is not changed by executing getEligibleShippingMethodsQuery here (I tried to not run this function, but the shippingWithTax still changes)
 * it looks like it changes whenever order's shippingAddress or line items changes.
 * This is because when execute addItemToOrder or setShippingAddress, orderService will:
 * 1. call orderService.applyPriceAdjustments(ctx, order, order.lines)
 * 2. that will call order-calculator and update the shippingWithTax
 * with the cheapest shipping method eligible. (see https://github.com/vendure-ecommerce/vendure/blob/1bb9cf8ca1584bce026ccc82f33f866b766ef47d/packages/core/src/service/helpers/order-calculator/order-calculator.ts#L332)
 */
export default component$<IProps>(({ reCalculateShipping$ }) => {
	const appState = useContext(APP_STATE);
	const selecting = useSignal(false);

	const state = useStore<{ selectedMethodId: string; methods: ShippingMethodQuote[] }>({
		selectedMethodId: '',
		methods: [],
	});
	const maxWaitDays = useComputed$(
		() =>
			state.methods.find((method) => method.id === state.selectedMethodId)?.metadata?.maxWaitDays ||
			null
	);

	useVisibleTask$(async (task) => {
		// This task will re-run whenever reCalculateShipping$.value changes
		task.track(() => reCalculateShipping$.value);
		if (reCalculateShipping$.value) {
			console.warn('reCalculateShipping$ is true, fetching shipping methods...');
			state.methods = await getEligibleShippingMethodsQuery();
			// preselect the first method
			state.selectedMethodId = state.methods[0]?.id;
		}
		reCalculateShipping$.value = false;
	});

	useVisibleTask$(async (task) => {
		// This track which shipping method is selected, if there is only one, this one will only be called once.
		const selected = task.track(() => state.selectedMethodId);
		if (selected) {
			selecting.value = true;
			const updated = await setOrderShippingMethodMutation([selected]);
			if (updated) {
				appState.activeOrder = updated;
			}
		}
		selecting.value = false;
	});

	useVisibleTask$(async (task) => {
		// track the promisedArrivalDays changes
		const promiseArrivalDays = task.track(() => maxWaitDays.value);
		if (promiseArrivalDays) {
			selecting.value = true;
			await setOrderCustomFieldsMutation({
				customFields: {
					promisedArrivalDays: promiseArrivalDays,
				},
			});
		}
		selecting.value = false;
	});

	return (
		<div>
			{reCalculateShipping$.value && (
				<div>
					<AnimatedSpinnerIcon forcedClass="h-5 w-5 mt-4" />
				</div>
			)}

			{!reCalculateShipping$.value && (
				<div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
					{state.methods.map((method, index) => (
						<div
							key={method.id}
							class={`relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none${selecting.value ? ' opacity-50 pointer-events-none' : ''}`}
							onClick$={() => {
								if (selecting.value) return;
								state.selectedMethodId = state.methods[index].id;
							}}
						>
							<ShippoShippingMethodCard
								shippingMethod={method}
								checked={state.selectedMethodId === method.id}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
});

const parseShippingAddressToCreateAddressInput = (address: ShippingAddress): CreateAddressInput => {
	return {
		fullName: address.fullName,
		streetLine1: address.streetLine1,
		streetLine2: address.streetLine2,
		city: address.city,
		province: address.province,
		postalCode: address.postalCode,
		countryCode: address.countryCode,
		phoneNumber: address.phoneNumber,
		company: address.company,
	};
};
