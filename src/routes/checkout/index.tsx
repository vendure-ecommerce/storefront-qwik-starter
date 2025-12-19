import { $, component$, useContext, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { LuCheck, LuCreditCard, LuTruck } from '@qwikest/icons/lucide';
import CartContents from '~/components/cart-contents/CartContents';
import CartTotals from '~/components/cart-totals/CartTotals';
import SectionWithLabel from '~/components/common/SectionWithLabel';
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
		{ name: $localize`Shipping`, state: 'SHIPPING' },
		{ name: $localize`Payment`, state: 'PAYMENT' },
		{ name: $localize`Confirmation`, state: 'CONFIRMATION' },
	];

	useVisibleTask$(async () => {
		if (appState.activeOrder?.lines?.length === 0 || !appState.activeOrder?.id) {
			navigate('/');
		}
	});

	const confirmPayment = $(async () => {
		await safeUpdateCustomizedImages(appState.activeOrder.lines);
		navigate(`/checkout/confirmation/${appState.activeOrder.code}`);
	});

	const goToPaymentStep = $(async () => {
		// if there is customized images, update them before navigating to confirmation page

		if (isEnvVariableEnabled('VITE_SHOW_PAYMENT_STEP')) {
			state.step = 'PAYMENT';
			orderReadOnly.value = true;
			window && window.scrollTo(0, 0);
		} else {
			confirmPayment();
		}
	});

	return (
		<div class="pb-4">
			<div
				class={`${
					state.step === 'CONFIRMATION' ? 'lg:max-w-3xl mx-auto' : 'lg:max-w-7xl'
				} max-w-2xl mx-auto pt-8 mb-24 px-4 sm:px-6 lg:px-8 `}
			>
				<h2 class="sr-only">{$localize`Checkout`}</h2>
				<ul class="steps flex items-center justify-center m-5">
					{steps.map((step, index) => (
						<li
							class={`
								step 
								${index <= steps.findIndex((s) => s.state === state.step) ? 'step-primary' : ''}
								`}
						>
							{/* <span class='mx-10'> {step.name} </span>
							 */}
							<span class="step-icon mx-10" title={step.name}>
								{step.state === 'SHIPPING' ? (
									<LuTruck />
								) : step.state === 'PAYMENT' ? (
									<LuCreditCard />
								) : (
									<LuCheck />
								)}
							</span>
						</li>
					))}
				</ul>

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
							{/* Note that this should be here except CONFIRMATION, as we will save the customized 
							images when payment complete, this prevent taking up unnecessary space on our asset folder */}
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
									<CartTotals order={appState.activeOrder} readOnly={orderReadOnly} />
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
			</div>
		</div>
	);
});
