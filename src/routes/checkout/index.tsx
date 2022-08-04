import { component$, useClientEffect$, useContext, useStore } from '@builder.io/qwik';
import CartContents from '~/components/cart-contents/CartContents';
import CartTotals from '~/components/cart-totals/CartTotals';
import Confirmation from '~/components/confirmation/Confirmation';
import ChevronRightIcon from '~/components/icons/ChevronRightIcon';
import Payment from '~/components/payment/Payment';
import Shipping from '~/components/shipping/Shipping';
import { APP_STATE } from '~/constants';
import { addPaymentToOrderMutation, transitionOrderToStateMutation } from '~/graphql/mutations';
import { ActiveOrder } from '~/types';
import { execute } from '~/utils/api';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const state = useStore<{ step: 'SHIPPING' | 'PAYMENT' | 'CONFIRMATION' }>({ step: 'SHIPPING' });
	const steps = [
		{ name: 'Shipping', state: 'SHIPPING' },
		{ name: 'Payment', state: 'PAYMENT' },
		{ name: 'Confirmation', state: 'CONFIRMATION' },
	];

	useClientEffect$(async () => {
		window.scrollTo(0, 0);
		appState.showCart = false;
	});

	return appState.activeOrder?.id ? (
		<div className="bg-gray-50">
			<div
				className={`${
					state.step === 'CONFIRMATION' ? 'lg:max-w-3xl mx-auto' : 'lg:max-w-7xl'
				} max-w-2xl mx-auto pt-8 pb-24 px-4 sm:px-6 lg:px-8`}
			>
				<h2 className="sr-only">Checkout</h2>
				<nav className="hidden sm:block pb-8 mb-8 border-b">
					<ol className="flex space-x-4 justify-center">
						{steps.map((step, index) => (
							<li key={step.name} className="flex items-center">
								<span className={`${step.state === state.step ? 'text-primary-600' : ''}`}>
									{step.name}
								</span>
								{index !== steps.length - 1 ? <ChevronRightIcon /> : null}
							</li>
						))}
					</ol>
				</nav>
				<div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
					<div className={state.step === 'CONFIRMATION' ? 'lg:col-span-2' : ''}>
						{state.step === 'SHIPPING' ? (
							<Shipping
								onForward$={async () => {
									// const data = await execute(setCustomerForOrderdMutation());
									state.step = 'PAYMENT';
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
							<></>
						)}
					</div>

					{state.step !== 'CONFIRMATION' && (
						<div className="mt-10 lg:mt-0">
							<h2 className="text-lg font-medium text-gray-900 mb-4">Order summary</h2>

							<CartContents
								rows={appState.activeOrder?.lines ?? []}
								currencyCode={appState.activeOrder.currencyCode || 'USD'}
								editable={state.step === 'SHIPPING'}
							></CartContents>
							<CartTotals order={appState.activeOrder}></CartTotals>
						</div>
					)}
				</div>
			</div>
		</div>
	) : (
		<></>
	);
});
