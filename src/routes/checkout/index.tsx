import { component$, useContext, useStore, useTask$ } from '@builder.io/qwik';
import { isBrowser } from '@builder.io/qwik/build';
import CartContents from '~/components/cart-contents/CartContents';
import CartTotals from '~/components/cart-totals/CartTotals';
import Confirmation from '~/components/confirmation/Confirmation';
import ChevronRightIcon from '~/components/icons/ChevronRightIcon';
import Payment from '~/components/payment/Payment';
import Shipping from '~/components/shipping/Shipping';
import { APP_STATE } from '~/constants';
import {
	addPaymentToOrderMutation,
	setCustomerForOrderdMutation,
	transitionOrderToStateMutation,
} from '~/graphql/mutations';
import { ActiveCustomer, ActiveOrder } from '~/types';
import { execute } from '~/utils/api';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const state = useStore<{ step: 'SHIPPING' | 'PAYMENT' | 'CONFIRMATION' }>({ step: 'SHIPPING' });
	const steps = [
		{ name: 'Shipping', state: 'SHIPPING' },
		{ name: 'Payment', state: 'PAYMENT' },
		{ name: 'Confirmation', state: 'CONFIRMATION' },
	];

	useTask$(() => {
		if (isBrowser) {
			window.scrollTo(0, 0);
			appState.showCart = false;
		}
	});

	return (
		<div>
			{appState.activeOrder?.id && (
				<div class="bg-gray-50">
					<div
						class={`${
							state.step === 'CONFIRMATION' ? 'lg:max-w-3xl mx-auto' : 'lg:max-w-7xl'
						} max-w-2xl mx-auto pt-8 pb-24 px-4 sm:px-6 lg:px-8`}
					>
						<h2 class="sr-only">Checkout</h2>
						<nav class="hidden sm:block pb-8 mb-8 border-b">
							<ol class="flex space-x-4 justify-center">
								{steps.map((step, index) => (
									<li key={step.name} class="flex items-center">
										<span class={`${step.state === state.step ? 'text-primary-600' : ''}`}>
											{step.name}
										</span>
										{index !== steps.length - 1 ? <ChevronRightIcon /> : null}
									</li>
								))}
							</ol>
						</nav>
						<div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
							<div class={state.step === 'CONFIRMATION' ? 'lg:col-span-2' : ''}>
								{state.step === 'SHIPPING' ? (
									<Shipping
										onForward$={async (customer: Omit<ActiveCustomer, 'id'>) => {
											if (appState.customer?.id === '-1') {
												const { setCustomerForOrder } = await execute<{
													setCustomerForOrder: ActiveOrder;
												}>(setCustomerForOrderdMutation(customer));

												if (!setCustomerForOrder.errorCode) {
													state.step = 'PAYMENT';
												}
											} else {
												state.step = 'PAYMENT';
											}
										}}
									/>
								) : state.step === 'PAYMENT' ? (
									<Payment
										onForward$={async () => {
											await execute(transitionOrderToStateMutation());
											const { addPaymentToOrder: activeOrder } = await execute<{
												addPaymentToOrder: ActiveOrder;
											}>(addPaymentToOrderMutation());
											appState.activeOrder = activeOrder;
											state.step = 'CONFIRMATION';
										}}
									/>
								) : state.step === 'CONFIRMATION' ? (
									<Confirmation
										onForward$={async () => {
											window.location.href = '/';
										}}
									/>
								) : (
									<div></div>
								)}
							</div>

							{state.step !== 'CONFIRMATION' && (
								<div class="mt-10 lg:mt-0">
									<h2 class="text-lg font-medium text-gray-900 mb-4">Order summary</h2>

									<CartContents
										currencyCode={appState.activeOrder.currencyCode || 'USD'}
									></CartContents>
									<CartTotals />
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
});
