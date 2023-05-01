import { component$, useContext } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { APP_STATE } from '~/constants';
import { isCheckoutPage } from '~/utils';
import CartContents from '../cart-contents/CartContents';
import CartPrice from '../cart-totals/CartPrice';
import CloseIcon from '../icons/CloseIcon';

export default component$(() => {
	const location = useLocation();
	const appState = useContext(APP_STATE);
	const isInEditableUrl = !isCheckoutPage(location.url.toString());

	return (
		<div>
			{appState.showCart && (
				<div class="fixed inset-0 overflow-hidden z-20">
					<div class="absolute inset-0 overflow-hidden">
						<div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity opacity-100"></div>
						<div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
							<div class="w-screen max-w-md translate-x-0">
								<div class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
									<div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
										<div class="flex items-start justify-between">
											<h2 class="text-lg font-medium text-gray-900">{$localize`Shopping cart`}</h2>
											<div class="ml-3 h-7 flex items-center">
												<button
													type="button"
													class="-m-2 p-2 text-gray-400 hover:text-gray-500"
													onClick$={() => (appState.showCart = !appState.showCart)}
												>
													<span class="sr-only">Close panel</span>
													<CloseIcon />
												</button>
											</div>
										</div>
										<div class="mt-8">
											{!!appState.activeOrder && appState.activeOrder.totalQuantity ? (
												<CartContents />
											) : (
												<div class="flex items-center justify-center h-48 text-xl text-gray-400">
													{$localize`Your cart is empty`}
												</div>
											)}
										</div>
									</div>
									{appState.activeOrder?.totalQuantity && isInEditableUrl && (
										<div class="border-t border-gray-200 py-6 px-4 sm:px-6">
											<div class="flex justify-between text-base font-medium text-gray-900">
												<p>{$localize`Subtotal`}</p>
												<p>
													<CartPrice field={'subTotalWithTax'} order={appState.activeOrder} />
												</p>
											</div>
											<p class="mt-0.5 text-sm text-gray-500">
												{$localize`Shipping will be calculated at checkout.`}
											</p>
											<div class="mt-6">
												<Link
													href="/checkout/"
													class="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 w-full"
												>
													{$localize`Checkout`}
												</Link>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
});
