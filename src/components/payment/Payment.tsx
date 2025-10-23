import { $, component$, QRL, useContext, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { APP_STATE } from '~/constants';
import {
	addPaymentToOrderMutation,
	getEligiblePaymentMethodsQuery,
	transitionOrderToStateMutation,
} from '~/providers/shop/checkout/checkout';
import { EligiblePaymentMethods } from '~/types';
import CreditCardIcon from '../icons/CreditCardIcon';
import BraintreePayment from './BraintreePayment';

export interface PaymentProps {
	onPaymentSuccess$: QRL<() => void>;
}

export default component$<PaymentProps>(({ onPaymentSuccess$ }) => {
	const paymentMethods = useSignal<EligiblePaymentMethods[]>();
	const appState = useContext(APP_STATE);

	useVisibleTask$(async () => {
		paymentMethods.value = await getEligiblePaymentMethodsQuery();
		console.log('payment methods', paymentMethods.value);
	});

	return (
		<div>
			{paymentMethods.value?.map((method) => (
				<div key={method.code} class="flex flex-col items-center">
					{method.code === 'dummy-payment-method' && (
						<>
							<p class="text-gray-600 text-sm p-6">
								{$localize`This is a dummy payment for demonstration purposes only`}
							</p>
							<button
								class="flex px-6 bg-primary-600 hover:bg-primary-700 items-center justify-center space-x-2 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
								onClick$={$(async () => {
									await transitionOrderToStateMutation();
									const activeOrder = await addPaymentToOrderMutation({
										method: method.code,
										metadata: {
											shouldDecline: false,
											shouldError: false,
											shouldErrorOnSettle: false,
										},
									});
									if (activeOrder.__typename === 'Order') {
										// Payment successful
										appState.activeOrder = activeOrder;
										onPaymentSuccess$();
									} else {
										// @ts-ignore
										alert(activeOrder.message);
									}
								})}
							>
								<CreditCardIcon />
								<span>{$localize`Pay with ${method.name}`}</span>
							</button>
						</>
					)}

					{/* {method.code.includes('stripe') && <StripePayment />} */}
					{method.code.includes('braintree') && (
						<BraintreePayment onPaymentSuccess$={onPaymentSuccess$} />
					)}
				</div>
			))}
		</div>
	);
});
