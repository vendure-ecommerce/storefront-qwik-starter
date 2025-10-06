import {
	component$,
	Signal,
	useContext,
	useSignal,
	useStore,
	useTask$,
	useVisibleTask$,
} from '@qwik.dev/core';
import { APP_STATE } from '~/constants';
import { CreateAddressInput, ShippingMethodQuote } from '~/generated/graphql';
import { getEligibleShippingMethodsQuery } from '~/providers/shop/checkout/checkout';
import { setOrderShippingMethodMutation } from '~/providers/shop/orders/order';
import { ShippingAddress } from '~/types';
import ShippoShippingMethodCard from '../checkout/ShippoShippingMethodCard';
import AnimatedSpinnerIcon from '../icons/AnimatedSpinnerIcon';

interface IProps {
	needCalculateShipping$: Signal<boolean>;
}

export default component$<IProps>(({ needCalculateShipping$ }) => {
	const appState = useContext(APP_STATE);
	const isCalculating = useSignal(false);

	const currencyCode = appState.activeOrder.currencyCode || 'USD';
	const state = useStore<{ selectedMethodId: string; methods: ShippingMethodQuote[] }>({
		selectedMethodId: '',
		methods: [],
	});

	useVisibleTask$(async (task) => {
		// This task will re-run whenever needCalculateShipping$.value changes
		task.track(() => needCalculateShipping$.value);
		isCalculating.value = true;
		if (!needCalculateShipping$.value) {
			state.methods = await getEligibleShippingMethodsQuery();
			// remove dummy shipping methods if any
			state.methods = state.methods.filter((method) => method.name !== 'dummy shipping');
			// preselect the first method
			state.selectedMethodId = state.methods[0]?.id;
			isCalculating.value = false;
		}

		needCalculateShipping$.value = false;
	});

	useTask$(async (tracker) => {
		const selected = tracker.track(() => state.selectedMethodId);
		if (selected) {
			appState.activeOrder = await setOrderShippingMethodMutation([selected]);
		}
	});

	return (
		<div>
			{isCalculating.value && (
				<div>
					<AnimatedSpinnerIcon forcedClass="h-5 w-5 mt-4" />
				</div>
			)}

			{!isCalculating.value && !needCalculateShipping$.value && (
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
