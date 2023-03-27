import { $, component$, useContext, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import CartContents from '~/components/cart-contents/CartContents';
import CartTotals from '~/components/cart-totals/CartTotals';
import ChevronRightIcon from '~/components/icons/ChevronRightIcon';
import Payment from '~/components/payment/Payment';
import Shipping from '~/components/shipping/Shipping';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import {
	addPaymentToOrderMutation,
	setCustomerForOrderMutation,
	setOrderShippingAddressMutation,
	transitionOrderToStateMutation,
} from '~/graphql/mutations';
import { ActiveCustomer, ActiveOrder, ShippingAddress } from '~/types';
import { isEnvVariableEnabled, scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

type Step = 'SHIPPING' | 'PAYMENT' | 'CONFIRMATION';

export default component$(() => {
	const navigate = useNavigate();
	const appState = useContext(APP_STATE);
	const state = useStore<{ step: Step }>({ step: 'SHIPPING' });
	const steps: { name: string; state: Step }[] = [
		{ name: 'Shipping', state: 'SHIPPING' },
		{ name: 'Payment', state: 'PAYMENT' },
		{ name: 'Confirmation', state: 'CONFIRMATION' },
	];

	useVisibleTask$(async () => {
		scrollToTop();
		appState.showCart = false;
		if (appState.activeOrder?.lines?.length === 0) {
			navigate('/');
		}
	});

	const confirmPayment = $(async () => {
		await execute(transitionOrderToStateMutation());
		const { addPaymentToOrder: activeOrder } = await execute<{
			addPaymentToOrder: ActiveOrder;
		}>(addPaymentToOrderMutation());
		appState.activeOrder = activeOrder;
		scrollToTop();
		navigate(`/checkout/confirmation/${activeOrder.code}`);
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
									<div key={index}>
										{(isEnvVariableEnabled('VITE_SHOW_PAYMENT_STEP') ||
											step.state !== 'PAYMENT') && (
											<li key={step.name} class="flex items-center">
												<span class={`${step.state === state.step ? 'text-primary-600' : ''}`}>
													{step.name}
												</span>
												{index !== steps.length - 1 ? <ChevronRightIcon /> : null}
											</li>
										)}
									</div>
								))}
							</ol>
						</nav>
						<div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
							<div class={state.step === 'CONFIRMATION' ? 'lg:col-span-2' : ''}>
								{state.step === 'SHIPPING' ? (
									<Shipping
										onForward$={async (
											customer: Omit<ActiveCustomer, 'id'>,
											shippingAddress: ShippingAddress
										) => {
											delete shippingAddress.id;
											delete shippingAddress.country;
											delete shippingAddress.defaultShippingAddress;
											delete shippingAddress.defaultBillingAddress;

											const setOrderShippingAddress = async () => {
												const { setOrderShippingAddress } = await execute<{
													setOrderShippingAddress: ActiveOrder;
												}>(setOrderShippingAddressMutation(shippingAddress));

												if (!setOrderShippingAddress.errorCode) {
													if (isEnvVariableEnabled('VITE_SHOW_PAYMENT_STEP')) {
														state.step = 'PAYMENT';
													} else {
														confirmPayment();
													}
												}
											};

											if (appState.customer.id === CUSTOMER_NOT_DEFINED_ID) {
												const { setCustomerForOrder } = await execute<{
													setCustomerForOrder: ActiveOrder;
												}>(setCustomerForOrderMutation(customer));
												if (!setCustomerForOrder.errorCode) {
													setOrderShippingAddress();
												}
											} else {
												setOrderShippingAddress();
											}
											scrollToTop();
										}}
									/>
								) : state.step === 'PAYMENT' ? (
									<Payment onForward$={confirmPayment} />
								) : (
									<div></div>
								)}
							</div>

							{state.step !== 'CONFIRMATION' && (
								<div class="mt-10 lg:mt-0">
									<h2 class="text-lg font-medium text-gray-900 mb-4">Order summary</h2>
									<CartContents />
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
