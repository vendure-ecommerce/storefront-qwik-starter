import { component$, PropFunction } from '@builder.io/qwik';

export default component$<{ showCart: boolean; onToggleCart$: PropFunction<() => void> }>(
	({ showCart = false, onToggleCart$ }) => {
		return !!showCart ? (
			<div
				class="fixed inset-0 overflow-hidden z-20"
				id="headlessui-dialog-8"
				role="dialog"
				aria-modal="true"
				aria-labelledby="headlessui-dialog-title-12"
			>
				<div class="absolute inset-0 overflow-hidden">
					<div
						class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity opacity-100"
						id="headlessui-dialog-overlay-10"
						aria-hidden="true"
					></div>
					<div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
						<div class="w-screen max-w-md translate-x-0">
							<div class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
								<div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
									<div class="flex items-start justify-between">
										<h2 class="text-lg font-medium text-gray-900" id="headlessui-dialog-title-12">
											Shopping cart
										</h2>
										<div class="ml-3 h-7 flex items-center">
											<button
												type="button"
												class="-m-2 p-2 text-gray-400 hover:text-gray-500"
												onClick$={onToggleCart$}
											>
												<span class="sr-only">Close panel</span>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="2"
													stroke="currentColor"
													aria-hidden="true"
													class="h-6 w-6"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M6 18L18 6M6 6l12 12"
													></path>
												</svg>
											</button>
										</div>
									</div>
									<div class="mt-8">
										<div class="flow-root">
											<ul role="list" class="-my-6 divide-y divide-gray-200">
												<li class="py-6 flex">
													<div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
														<img
															src="https://readonlydemo.vendure.io/assets/preview/71/derick-david-409858-unsplash__preview.jpg?preset=thumb"
															alt="Laptop 13 inch 8GB"
															class="w-full h-full object-center object-cover"
														/>
													</div>
													<div class="ml-4 flex-1 flex flex-col">
														<div>
															<div class="flex justify-between text-base font-medium text-gray-900">
																<h3>
																	<a href="/products/laptop">Laptop 13 inch 8GB</a>
																</h3>
																<p class="ml-4">$3,117.60</p>
															</div>
														</div>
														<div class="flex-1 flex items-center text-sm">
															<form method="get" action="/">
																<label class="mr-2">Quantity</label>
																<select
																	id="quantity-11"
																	name="quantity-11"
																	class="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
																>
																	<option value="1">1</option>
																	<option value="2">2</option>
																	<option value="3">3</option>
																	<option value="4">4</option>
																	<option value="5">5</option>
																	<option value="6">6</option>
																	<option value="7">7</option>
																	<option value="8">8</option>
																</select>
															</form>
															<div class="flex-1"></div>
															<div class="flex">
																<button
																	type="submit"
																	name="removeItem"
																	value="11"
																	class="font-medium text-primary-600 hover:text-primary-500"
																>
																	Remove
																</button>
															</div>
														</div>
													</div>
												</li>
												<li class="py-6 flex">
													<div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
														<img
															src="https://readonlydemo.vendure.io/assets/preview/71/derick-david-409858-unsplash__preview.jpg?preset=thumb"
															alt="Laptop 15 inch 8GB"
															class="w-full h-full object-center object-cover"
														/>
													</div>
													<div class="ml-4 flex-1 flex flex-col">
														<div>
															<div class="flex justify-between text-base font-medium text-gray-900">
																<h3>
																	<a href="/products/laptop">Laptop 15 inch 8GB</a>
																</h3>
																<p class="ml-4">$1,678.80</p>
															</div>
														</div>
														<div class="flex-1 flex items-center text-sm">
															<form method="get" action="/">
																<label class="mr-2">Quantity</label>
																<select
																	id="quantity-12"
																	name="quantity-12"
																	class="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
																>
																	<option value="1">1</option>
																	<option value="2">2</option>
																	<option value="3">3</option>
																	<option value="4">4</option>
																	<option value="5">5</option>
																	<option value="6">6</option>
																	<option value="7">7</option>
																	<option value="8">8</option>
																</select>
															</form>
															<div class="flex-1"></div>
															<div class="flex">
																<button
																	type="submit"
																	name="removeItem"
																	value="12"
																	class="font-medium text-primary-600 hover:text-primary-500"
																>
																	Remove
																</button>
															</div>
														</div>
													</div>
												</li>
												<li class="py-6 flex">
													<div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
														<img
															src="https://readonlydemo.vendure.io/assets/preview/b8/kelly-sikkema-685291-unsplash__preview.jpg?preset=thumb"
															alt="Tablet 32GB"
															class="w-full h-full object-center object-cover"
														/>
													</div>
													<div class="ml-4 flex-1 flex flex-col">
														<div>
															<div class="flex justify-between text-base font-medium text-gray-900">
																<h3>
																	<a href="/products/tablet">Tablet 32GB</a>
																</h3>
																<p class="ml-4">$394.80</p>
															</div>
														</div>
														<div class="flex-1 flex items-center text-sm">
															<form method="get" action="/">
																<label class="mr-2">Quantity</label>
																<select
																	id="quantity-14"
																	name="quantity-14"
																	class="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
																>
																	<option value="1">1</option>
																	<option value="2">2</option>
																	<option value="3">3</option>
																	<option value="4">4</option>
																	<option value="5">5</option>
																	<option value="6">6</option>
																	<option value="7">7</option>
																	<option value="8">8</option>
																</select>
															</form>
															<div class="flex-1"></div>
															<div class="flex">
																<button
																	type="submit"
																	name="removeItem"
																	value="14"
																	class="font-medium text-primary-600 hover:text-primary-500"
																>
																	Remove
																</button>
															</div>
														</div>
													</div>
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="border-t border-gray-200 py-6 px-4 sm:px-6">
									<div class="flex justify-between text-base font-medium text-gray-900">
										<p>Subtotal</p>
										<p>$5,191.20</p>
									</div>
									<p class="mt-0.5 text-sm text-gray-500">
										Shipping will be calculated at checkout.
									</p>
									<div class="mt-6">
										<a
											class="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
											href="/checkout"
										>
											Checkout
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		) : (
			<></>
		);
	}
);
