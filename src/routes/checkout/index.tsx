import { $, component$, useContext, useStore, useVisibleTask$ } from '@qwik.dev/core';
import { useNavigate } from '@qwik.dev/router';
import CartContents from '~/components/cart-contents/CartContents';
import CartTotals from '~/components/cart-totals/CartTotals';
import ChevronRightIcon from '~/components/icons/ChevronRightIcon';
import Payment from '~/components/payment/Payment';
import Shipping from '~/components/shipping/Shipping';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { CreateAddressInput, CreateCustomerInput } from '~/generated/graphql';
import {
	addPaymentToOrderMutation,
	transitionOrderToStateMutation,
} from '~/providers/shop/checkout/checkout';
import {
	setCustomerForOrderMutation,
	setOrderShippingAddressMutation,
} from '~/providers/shop/orders/order';
import { isEnvVariableEnabled } from '~/utils';

type Step = 'SHIPPING' | 'PAYMENT' | 'CONFIRMATION';

export default component$(() => {
	const navigate = useNavigate();
	const appState = useContext(APP_STATE);
	const state = useStore<{ step: Step }>({ step: 'SHIPPING' });
	const steps: { name: string; state: Step }[] = [
		{ name: $localize`Shipping Checkout`, state: 'SHIPPING' },
		{ name: $localize`Payment`, state: 'PAYMENT' },
		{ name: $localize`Confirmation`, state: 'CONFIRMATION' },
	];

	useVisibleTask$(async () => {
		appState.showCart = false;
		if (appState.activeOrder?.lines?.length === 0) {
			navigate('/');
		}
	});

	const confirmPayment = $(async () => {
		await transitionOrderToStateMutation();
		const activeOrder = await addPaymentToOrderMutation();
		appState.activeOrder = activeOrder;
		navigate(`/checkout/confirmation/${activeOrder.code}`);
	});

	return (
		<div>
			{appState.activeOrder?.id && (
				<div class="bg-gray-50 pb-48">
					<div
						class={`${
							state.step === 'CONFIRMATION' ? 'lg:max-w-3xl mx-auto' : 'lg:max-w-7xl'
						} max-w-2xl mx-auto pt-8 mb-24 px-4 sm:px-6 lg:px-8 `}
					>
						<h2 class="sr-only">{$localize`Checkout`}</h2>
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
											customer: CreateCustomerInput,
											shippingAddress: CreateAddressInput
										) => {
											delete shippingAddress.defaultShippingAddress;
											delete shippingAddress.defaultBillingAddress;

											const setOrderShippingAddress = async () => {
												const setOrderShippingAddress =
													await setOrderShippingAddressMutation(shippingAddress);

												if (setOrderShippingAddress.__typename === 'Order') {
													if (isEnvVariableEnabled('VITE_SHOW_PAYMENT_STEP')) {
														state.step = 'PAYMENT';
														window && window.scrollTo(0, 0);
													} else {
														confirmPayment();
													}
												}
											};

											if (appState.customer.id === CUSTOMER_NOT_DEFINED_ID) {
												const setCustomerForOrder = await setCustomerForOrderMutation(customer);
												if (setCustomerForOrder.__typename === 'Order') {
													setOrderShippingAddress();
												}
											} else {
												setOrderShippingAddress();
											}
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
									<h2 class="text-lg font-medium text-gray-900 mb-4">{$localize`Order summary`}</h2>
									<CartContents />
									<CartTotals order={appState.activeOrder} />
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
});
