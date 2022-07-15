import { component$, mutable, useServerMount$, useStore, useWatch$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import Alert from '~/components/alert/Alert';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs';
import Price from '~/components/products/Price';
import StockLevelLabel from '~/components/stock-level-label/StockLevelLabel';
import TopReviews from '~/components/top-reviews/TopReviews';
import { addItemToOrderMutation } from '~/graphql/mutations';
import { getProductQuery } from '~/graphql/queries';
import { ActiveOrder, Product } from '~/types';
import { sendQuery } from '~/utils/api';

export default component$(() => {
	const location = useLocation();
	const state = useStore<{
		product: Product;
		selectedVariantId: string;
		quantity: number;
		loading: boolean;
		addItemToOrderError: string;
	}>({
		product: {} as Product,
		selectedVariantId: '',
		quantity: 0,
		loading: true,
		addItemToOrderError: '',
	});

	useServerMount$(async () => {
		const { product } = await sendQuery<{ product: Product }>(
			getProductQuery(location.params.slug)
		);
		state.product = product;
		state.selectedVariantId = product.variants[0].id;
		state.loading = false;
	});

	useWatch$(async (track) => {
		track(state, 'quantity');
		if (state.quantity !== 0) {
			const { addItemToOrder: order } = await sendQuery<{
				addItemToOrder: ActiveOrder;
			}>(addItemToOrderMutation(state.product.id, state.quantity));
			if (!!order.errorCode) {
				state.addItemToOrderError = order.errorCode;
			}
		}
	});

	const findVariantById = (id: string) => state.product.variants.find((v) => v.id === id);
	const selectedVariant = () => findVariantById(state.selectedVariantId);
	const featuredAsset = () => findVariantById(state.product.variants[0].id)?.featuredAsset;
	return !!state.loading ? (
		<></>
	) : (
		<div>
			<div className="max-w-6xl mx-auto px-4">
				<h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
					{state.product.name}
				</h2>
				<Breadcrumbs
					items={state.product.collections[state.product.collections.length - 1]?.breadcrumbs ?? []}
				></Breadcrumbs>
				<div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start mt-4 md:mt-12">
					{/* Image gallery */}
					<div className="w-full max-w-2xl mx-auto sm:block lg:max-w-none">
						<span className="rounded-md overflow-hidden">
							<div className="w-full h-full object-center object-cover rounded-lg">
								<img
									src={featuredAsset()?.preview || state.product.featuredAsset?.preview + '?w=800'}
									alt={state.product.name}
									className="w-full h-full object-center object-cover rounded-lg"
								/>
							</div>
						</span>

						{
							state.product.assets.length > 1 &&
								// <ScrollableContainer>
								state.product.assets.map((asset) => (
									<div
										className={`basis-1/3 md:basis-1/4 flex-shrink-0 select-none touch-pan-x rounded-lg ${
											featuredAsset()?.id == asset.id
										} ? 'outline outline-2 outline-primary outline-offset-[-2px]': ''`}
										onClick$={() => {
											// setFeaturedAsset(asset);
										}}
									>
										<img
											draggable="false"
											className="rounded-lg select-none h-24 w-full object-cover"
											src={
												asset.preview +
												'?preset=full' /* not ideal, but technically prevents loading 2 seperate images */
											}
										/>
									</div>
								))
							// </ScrollableContainer>
						}
					</div>

					{/* Product info */}
					<div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
						<div className="">
							<h3 className="sr-only">Description</h3>

							<div className="text-base text-gray-700" innerHTML={state.product.description} />
						</div>
						<input type="hidden" name="action" value="addItemToOrder" />
						{1 < state.product.variants.length ? (
							<div className="mt-4">
								<label htmlFor="option" className="block text-sm font-medium text-gray-700">
									Select option
								</label>
								<select
									className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
									id="productVariant"
									value={state.selectedVariantId}
									name="variantId"
									onChange$={(e: any) => (state.selectedVariantId = e.target.value)}
								>
									{state.product.variants.map((variant) => (
										<option key={variant.id} value={variant.id}>
											{variant.name}
										</option>
									))}
								</select>
							</div>
						) : (
							<input type="hidden" name="variantId" value={state.selectedVariantId}></input>
						)}

						<div className="mt-10 flex flex-col sm:flex-row sm:items-center">
							<Price
								priceWithTax={mutable(selectedVariant()?.priceWithTax)}
								currencyCode={mutable(selectedVariant()?.currencyCode)}
								className={'text-3xl text-gray-900 mr-4'}
							></Price>
							<div className="flex sm:flex-col1 align-baseline">
								<button
									class={`max-w-xs flex-1 ${
										state.quantity === 0
											? 'bg-primary-600 hover:bg-primary-700'
											: 'bg-green-600 active:bg-green-700 hover:bg-green-700'
									}
														 transition-colors border border-transparent rounded-md py-3 px-8 flex items-center
															justify-center text-base font-medium text-white focus:outline-none
															focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500 sm:w-full`}
									onClick$={() => (state.quantity += 1)}
								>
									{state.quantity ? (
										<span className="flex items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="w-5 h-5 mr-1"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												stroke-width="2"
											>
												<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
											</svg>
											{state.quantity} in cart
										</span>
									) : (
										`Add to cart`
									)}
								</button>

								<button
									type="button"
									className="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
										className="h-6 w-6 flex-shrink-0"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										/>
									</svg>
									<span className="sr-only">Add to favorites</span>
								</button>
							</div>
						</div>
						<div className="mt-2 flex items-center space-x-2">
							<span className="text-gray-500">{selectedVariant()?.sku}</span>
							<StockLevelLabel stockLevel={mutable(selectedVariant()?.stockLevel)} />
						</div>
						{!!state.addItemToOrderError && (
							<div className="mt-4">
								<Alert message={state.addItemToOrderError} />
							</div>
						)}

						<section className="mt-12 pt-12 border-t text-xs">
							<h3 className="text-gray-600 font-bold mb-2">Shipping & Returns</h3>
							<div className="text-gray-500 space-y-1">
								<p>Standard shipping: 3 - 5 working days. Express shipping: 1 - 3 working days.</p>
								<p>
									Shipping costs depend on delivery address and will be calculated during checkout.
								</p>
								<p>
									Returns are subject to terms. Please see the{' '}
									<span className="underline">returns page</span> for further information.
								</p>
							</div>
						</section>
					</div>
				</div>
			</div>
			<div className="mt-24">
				<TopReviews />
			</div>
		</div>
	);
});
