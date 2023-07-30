import { $, component$, useContext, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import braintree from 'braintree-web-drop-in';
import { APP_STATE } from '~/constants';
import {
	addPaymentToOrderMutation,
	generateBraintreeClientTokenQuery,
	transitionOrderToStateMutation,
} from '~/providers/shop/checkout/checkout';
import CreditCardIcon from '../icons/CreditCardIcon';
import XCircleIcon from '../icons/XCircleIcon';
const client = {
	dropin: {} as braintree.Dropin,
};

export default component$(() => {
	const appState = useContext(APP_STATE);
	const store = useStore({
		clientToken: '',
		error: '',
	});
	const navigate = useNavigate();

	useVisibleTask$(async () => {
		store.clientToken =
			(await generateBraintreeClientTokenQuery(appState.activeOrder.id, true)) || '';
		client.dropin = await braintree.create({
			authorization: store.clientToken,
			// This assumes a div in your view with the corresponding ID
			container: '#payment-form',
			card: {
				cardholderName: {
					required: true,
				},
				overrides: {},
			},
			// Additional config is passed here depending on
			// which payment methods you have enabled in your
			// Braintree account.
			paypal: {
				flow: 'checkout',
				amount: appState.activeOrder.totalWithTax / 100,
				currency: appState.activeOrder.currencyCode,
			},
		});
	});

	return (
		<div class="flex flex-col items-center max-w-xs">
			<div id="payment-form" class="mb-8"></div>
			{store.error !== '' && (
				<div class="rounded-md bg-red-50 p-4 mb-8">
					<div class="flex">
						<div class="flex-shrink-0">
							<XCircleIcon />
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800">We ran into a problem with payment!</h3>
							<p class="text-sm text-red-700 mt-2">{store.error}</p>
						</div>
					</div>
				</div>
			)}

			<button
				class="flex px-6 bg-primary-600 hover:bg-primary-700 items-center justify-center space-x-2 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
				onClick$={$(async () => {
					if (!client.dropin.isPaymentMethodRequestable()) {
						return;
					}
					const paymentResult = await client.dropin.requestPaymentMethod();
					await transitionOrderToStateMutation();
					const activeOrder = await addPaymentToOrderMutation({
						method: 'braintree-payment',
						metadata: paymentResult,
					});
					if (activeOrder.__typename === 'Order') {
						appState.activeOrder = activeOrder;
						navigate(`/checkout/confirmation/${activeOrder.code}`);
					} else {
						// @ts-ignore
						store.error = activeOrder.message;
					}
				})}
			>
				<CreditCardIcon />
				<span>Pay with Braintree</span>
			</button>
		</div>
	);
});
