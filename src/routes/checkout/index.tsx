import { $, component$, useContext, useSignal, useStore, useVisibleTask$ } from '@qwik.dev/core';
import { useNavigate } from '@qwik.dev/router';
import CartContents from '~/components/cart-contents/CartContents';
import CartTotals from '~/components/cart-totals/CartTotals';
import SectionWithLabel from '~/components/common/SectionWithLabel';
import ChevronRightIcon from '~/components/icons/ChevronRightIcon';
import Payment from '~/components/payment/Payment';
import Shipping from '~/components/shipping/ShippingV2';
import { APP_STATE } from '~/constants';
import { isEnvVariableEnabled } from '~/utils';
import { safeUpdateCustomizedImages } from '~/utils/customizable-order';

type Step = 'SHIPPING' | 'PAYMENT' | 'CONFIRMATION';

export default component$(() => {
	const navigate = useNavigate();
	const appState = useContext(APP_STATE);
	const reCalculateShipping = useSignal(true);
	const orderLineReadyToProceed = useSignal(true);
	const orderReadOnly = useSignal(false);
	const state = useStore<{ step: Step }>({ step: 'SHIPPING' });
	const steps: { name: string; state: Step }[] = [
		{ name: $localize`Shipping Checkout`, state: 'SHIPPING' },
		{ name: $localize`Payment`, state: 'PAYMENT' },
		{ name: $localize`Confirmation`, state: 'CONFIRMATION' },
	];

	useVisibleTask$(async () => {
		appState.showCart = false;
		if (appState.activeOrder?.lines?.length === 0 || !appState.activeOrder?.id) {
			navigate('/');
		}
	});

	const confirmPayment = $(async () => {
		navigate(`/checkout/confirmation/${appState.activeOrder.code}`);
	});

	const goToPaymentStep = $(async () => {
		// if there is customized images, update them before navigating to confirmation page
		await safeUpdateCustomizedImages(appState.activeOrder.lines);
		if (isEnvVariableEnabled('VITE_SHOW_PAYMENT_STEP')) {
			state.step = 'PAYMENT';
			orderReadOnly.value = true;
			window && window.scrollTo(0, 0);
		} else {
			confirmPayment();
		}
	});

	return (
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
								{(isEnvVariableEnabled('VITE_SHOW_PAYMENT_STEP') || step.state !== 'PAYMENT') && (
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
				{/* <div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"> */}
				<div
					class={
						state.step === 'CONFIRMATION'
							? 'lg:col-span-2'
							: 'lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16'
					}
				>
					{state.step !== 'CONFIRMATION' && (
						<div>
							{/* Cart Content */}

							<SectionWithLabel label={$localize`Order summary`}>
								<CartContents
									readOnly={orderReadOnly}
									readyToProceedSignal={orderLineReadyToProceed}
									onOrderLineChange$={async () => {
										reCalculateShipping.value = true;
									}}
								/>
							</SectionWithLabel>

							{!reCalculateShipping.value && (
								<SectionWithLabel>
									<CartTotals order={appState.activeOrder} readonly={orderReadOnly} />
								</SectionWithLabel>
							)}
						</div>
					)}

					{state.step === 'SHIPPING' ? (
						<Shipping
							reCalculateShipping={reCalculateShipping}
							orderLineReadyToProceed={orderLineReadyToProceed}
							onForward$={async () => {
								goToPaymentStep();
							}}
						/>
					) : state.step === 'PAYMENT' ? (
						<Payment onPaymentSuccess$={confirmPayment} />
					) : (
						<div></div>
					)}
				</div>

				{/* temporary button to run the updateCustomizedImageForOrderLine function */}
				{/* <button
							class="mt-4 p-2 bg-blue-500 text-white rounded"
							onClick$={async () => {
								console.log('active order lines', JSON.stringify(appState.activeOrder?.lines, null, 2));
								if (appState.activeOrder?.lines) {
									await updateCustomizedImageForOrderLine(appState.activeOrder.lines);
								}
							}}
						>
							Update Customized Images
						</button> */}

				{/* {state.step !== 'CONFIRMATION' && (
								<div class="mt-10 lg:mt-0">
									<h2 class="text-lg font-medium text-gray-900 mb-4">{$localize`Order summary`}</h2>
									<CartContents />
									<CartTotals order={appState.activeOrder} />
								</div>
							)}
						</div> */}
			</div>
		</div>
	);
});
