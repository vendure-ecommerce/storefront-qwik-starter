import { component$, Host, useContext } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import CartContents from '~/components/cart-contents/CartContents';
import CartTotals from '~/components/cart-totals/CartTotals';
import ChevronRightIcon from '~/components/icons/ChevronRightIcon';
import { APP_STATE } from '~/constants';

export default component$(() => {
	const { activeOrder } = useContext(APP_STATE);
	const steps = [
		{ name: 'Shipping', state: 'shipping' },
		{ name: 'Payment', state: 'payment' },
		{ name: 'Confirmation', state: 'confirmation' },
	];

	const location = useLocation();
	let state = 'shipping';
	if (location.pathname === '/checkout/payment') {
		state = 'payment';
	} else if (location.pathname.startsWith('/checkout/confirmation')) {
		state = 'confirmation';
	}
	let isConfirmationPage = state === 'confirmation';

	return (
		<Host>
			<div className="bg-gray-50">
				<div
					className={`${
						isConfirmationPage ? 'lg:max-w-3xl mx-auto' : 'lg:max-w-7xl'
					} max-w-2xl mx-auto pt-8 pb-24 px-4 sm:px-6 lg:px-8`}
				>
					<h2 className="sr-only">Checkout</h2>
					<nav aria-label="Progress" className="hidden sm:block pb-8 mb-8 border-b">
						<ol role="list" className="flex space-x-4 justify-center">
							{steps.map((step, stepIdx) => (
								<li key={step.name} className="flex items-center">
									{step.state === state ? (
										<span aria-current="page" className="text-primary-600">
											{step.name}
										</span>
									) : (
										<span>{step.name}</span>
									)}

									{stepIdx !== steps.length - 1 ? <ChevronRightIcon /> : null}
								</li>
							))}
						</ol>
					</nav>
					<div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
						<div className={isConfirmationPage ? 'lg:col-span-2' : ''}>Outlet</div>

						{/* Order summary */}
						{!isConfirmationPage && (
							<div className="mt-10 lg:mt-0">
								<h2 className="text-lg font-medium text-gray-900 mb-4">Order summary</h2>

								<CartContents
									orderLines={activeOrder?.lines ?? []}
									currencyCode={activeOrder?.currencyCode!}
									editable={state === 'shipping'}
									// removeItem={removeItem}
									// adjustOrderLine={adjustOrderLine}
								></CartContents>
								<CartTotals order={activeOrder}></CartTotals>
							</div>
						)}
					</div>
				</div>
			</div>
		</Host>
	);
});
