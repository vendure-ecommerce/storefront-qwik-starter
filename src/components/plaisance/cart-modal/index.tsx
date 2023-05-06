import { $, PropFunction, Signal, component$ } from '@builder.io/qwik';
import { Link, useNavigate } from '@builder.io/qwik-city';
import { useCSSTransition } from 'qwik-transition';
import { TRANSITION_CONFIGS } from '~/constants';

export interface Product {
	id: number;
	quantity: number;
	image: string;
	name: string;
	price: number;
}

export interface CartStore {
	collections: Product[];
	products: Product[];
}

interface CartModalProps {
	isShowShoppingCart: Signal<boolean>;
	onClickShoppingCart$: PropFunction<() => void>;
	totalItems: number;
	cartStore: CartStore;
}

export default component$(
	({ isShowShoppingCart, onClickShoppingCart$, cartStore, totalItems }: CartModalProps) => {
		const nav = useNavigate();
		const { stage, shouldMount } = useCSSTransition(isShowShoppingCart, TRANSITION_CONFIGS);

		const removeProduct = $((id: number) => {
			const item = cartStore.products.find((i: Product) => i.id === id);
			if (!item) return;
			const itemIndex = cartStore.products.indexOf(item);
			cartStore.products.splice(itemIndex, 1);
			console.log('item removed');
		});

		const removeCollection = $((id: number) => {
			const item = cartStore.collections.find((i: Product) => i.id === id);
			if (!item) return;
			const itemIndex = cartStore.collections.indexOf(item);
			cartStore.collections.splice(itemIndex, 1);
			console.log('item removed');
		});

		const getSubtotal = () => {
			let total = 0;

			cartStore.products.forEach((item: Product) => {
				const itemPrice = item.price * item.quantity;
				total += itemPrice;
			});

			cartStore.collections.forEach((item: Product) => {
				const itemPrice = item.price * item.quantity;
				total += itemPrice;
			});

			return total.toFixed(2);
		};

		if (!shouldMount.value) return null;
		return (
			<>
				<div
					onClick$={onClickShoppingCart$}
					class="fixed inset-0 z-30 bg-black/25 transition-opacity"
				></div>
				<div
					class={`fixed inset-y-0 right-0 z-40 flex h-full w-full max-w-xs flex-col
          bg-white transition duration-200 ease-in-out xs:max-w-md md:max-w-[465px]
          ${
						stage.value === 'enterFrom'
							? 'translate-x-10  opacity-0'
							: stage.value === 'enterTo'
							? 'translate-x-0 opacity-100'
							: stage.value === 'leaveFrom'
							? 'translate-x-0 opacity-100'
							: stage.value === 'leaveTo'
							? 'translate-x-10  opacity-0'
							: ''
					}`}
				>
					<div class="flex items-center justify-between border-b border-gray-200 p-4 lg:p-6">
						<a href="/">
							<img src="/img/logo-black.svg" width="90" loading="lazy" decoding="async" alt="" />
						</a>
						<button onClick$={onClickShoppingCart$} class="inline-block">
							<img
								src="/img/icons/times-gray.png"
								width="11"
								loading="lazy"
								decoding="async"
								alt=""
							/>
						</button>
					</div>
					<div class="relative flex-1 overflow-y-auto">
						{totalItems > 0 ? (
							<div class="flex h-full max-h-full flex-col px-10">
								<div class="flex-1 sm:px-9">
									<ul class="mt-8 space-y-7 pb-7">
										{cartStore.products.map((item: Product) => (
											<template key={item.id}>
												<li class="flex space-x-4">
													<div class="w-14 flex-shrink-0 self-start border border-gray-300 p-1 sm:w-20">
														<img src={`/img/bottles/${item.image}.png`} class="w-full" alt="" />
													</div>
													<div class="mx-2 flex flex-1 flex-col sm:mx-4 sm:px-4">
														<div class="flex-1">
															<h3 class="font-heading text-base text-gray-800">{item.name}</h3>
															<div class="text-sm text-gray-500">
																$ <span x-text="item.price"></span> USD
															</div>
															<div class="text-sm text-black">Option: 0.75 l</div>
														</div>
														<button
															onClick$={() => removeProduct(item.id)}
															class="mt-1 text-sm text-red-400 transition hover:text-red-800"
														>
															remove
														</button>
													</div>
													<div class="w-14">
														<input
															type="number"
															min="0"
															value="item.quantity.toString()"
															x-model="item.quantity"
															class="w-full border-0 bg-gray-100 text-black"
														/>
													</div>
												</li>
											</template>
										))}
										{cartStore.collections.map((item: Product) => (
											<template key={item.id}>
												<li class="flex space-x-4">
													<div class="w-14 flex-shrink-0 self-start border border-gray-300 sm:w-20">
														<img
															src={`/img/collections/${item.image}.jpeg`}
															class="mx-auto w-full"
															alt=""
														/>
													</div>
													<div class="mx-2 flex flex-1 flex-col sm:mx-4 sm:px-4">
														<div class="flex-1">
															<h3 class="font-heading text-base text-gray-800">{item.name}</h3>
															<div class="text-sm text-gray-500">
																$ <span x-text="item.price"></span> USD
															</div>
															<div class="text-sm text-black">Option: 0.75 l</div>
														</div>
														<button
															onClick$={() => removeCollection(item.id)}
															class="mt-1 text-sm text-red-400 transition hover:text-red-800"
														>
															remove
														</button>
													</div>
													<div class="w-14">
														<input
															type="number"
															min="0"
															value="item.quantity.toString()"
															x-model="item.quantity"
															class="w-full border-0 bg-gray-100 text-black"
														/>
													</div>
												</li>
											</template>
										))}
									</ul>
								</div>
								<div class="border-t border-gray-400 py-4 sm:px-9">
									<div class="mb-4 flex items-center justify-between space-x-3 py-2">
										<div class="text-base text-black">Subtotal</div>
										<div class="text-base text-red-700">
											$ <span x-text="$store.cart.getSubtotal()">0.00</span> USD
										</div>
									</div>
									<div>
										<button
											onClick$={() => nav('/checkout')}
											class="btn-outline block w-full text-black hover:text-white disabled:hover:text-black"
											disabled={Number(getSubtotal()) <= 0}
										>
											Checkout
										</button>
									</div>
								</div>
							</div>
						) : (
							<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
								<h4 class="font-heading text-lg uppercase text-gray-700 lg:text-xl">
									No items found
								</h4>
								<Link
									href="/shop"
									class="mt-3 inline-block bg-red-800 px-5 py-2 uppercase text-gray-100 transition-all duration-300 hover:bg-opacity-80"
								>
									Back to shop
								</Link>
							</div>
						)}
					</div>
				</div>
				)
			</>
		);
	}
);
