import { $, component$, PropFunction, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { EligiblePaymentMethods } from '~/types';
import CreditCardIcon from '../icons/CreditCardIcon';
import StripePayment from './StripePayment';
import { getEligiblePaymentMethodsQuery } from '~/providers/checkout/checkout';

export default component$<{ onForward$: PropFunction<() => void> }>(({ onForward$ }) => {
	const paymentMethods = useSignal<EligiblePaymentMethods[]>();

	useVisibleTask$(async () => {
		paymentMethods.value = await getEligiblePaymentMethodsQuery();
	});

	return (
		<div class="flex flex-col space-y-24 items-center">
			{paymentMethods.value?.map((method) => (
				<div key={method.code} class="flex flex-col items-center">
					{method.code === 'standard-payment' && (
						<>
							<p class="text-gray-600 text-sm p-6">
								This is a dummy payment for demonstration purposes only
							</p>
							<button
								class="flex px-6 bg-primary-600 hover:bg-primary-700 items-center justify-center space-x-2 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
								onClick$={$(async () => {
									onForward$();
								})}
							>
								<CreditCardIcon />
								<span>Pay with {method.name}</span>
							</button>
						</>
					)}
					{method.code.includes('stripe') && <StripePayment />}
				</div>
			))}
		</div>
	);
});
