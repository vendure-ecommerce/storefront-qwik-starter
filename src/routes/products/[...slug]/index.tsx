import {
	$,
	component$,
	useBrowserVisibleTask$,
	useContext,
	useStore,
	useTask$,
} from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import Alert from '~/components/alert/Alert';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs';
import CheckIcon from '~/components/icons/CheckIcon';
import HeartIcon from '~/components/icons/HeartIcon';
import { Image } from '~/components/image/Image';
import Price from '~/components/products/Price';
import StockLevelLabel from '~/components/stock-level-label/StockLevelLabel';
import TopReviews from '~/components/top-reviews/TopReviews';
import { APP_STATE, IMAGE_PLACEHOLDER_BACKGROUND } from '~/constants';
import { addItemToOrderMutation } from '~/graphql/mutations';
import { getProductQuery } from '~/graphql/queries';
import { ActiveOrder, Line, Product, Variant } from '~/types';
import { cleanUpParams, isEnvVariableEnabled, scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

export const useProductLoader = routeLoader$(async ({ params }) => {
	const { slug } = cleanUpParams(params);
	const { product } = await execute<{ product: Product }>(getProductQuery({ slug }));
	return product;
});

export default component$(() => {
	const productSignal = useProductLoader();

	const appState = useContext(APP_STATE);
	const state = useStore<{
		product: Product;
		selectedVariantId: string;
		quantity: Record<string, number>;
		addItemToOrderError: string;
	}>({
		product: productSignal.value,
		selectedVariantId: productSignal.value.variants[0].id,
		quantity: {},
		addItemToOrderError: '',
	});

	const calculateQuantities = $((product: Product) => {
		state.quantity = {};
		(product.variants || []).forEach((variant: Variant) => {
			const orderLine = (appState.activeOrder?.lines || []).find(
				(l: Line) =>
					l.productVariant.id === variant.id && l.productVariant.product.id === product.id
			);
			state.quantity[variant.id] = orderLine?.quantity || 0;
		});
	});

	calculateQuantities(state.product);

	useBrowserVisibleTask$(() => {
		scrollToTop();
	});

	useTask$((tracker) => {
		tracker.track(() => appState.activeOrder);
		calculateQuantities(state.product);
	});

	const findVariantById = (id: string) => state.product.variants.find((v) => v.id === id);
	const selectedVariant = () => findVariantById(state.selectedVariantId);

	return (
		<div>
			<div class="max-w-6xl mx-auto px-4 py-10">
				<div>
					<h2 class="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
						{state.product.name}
					</h2>
					<Breadcrumbs
						items={
							state.product.collections[state.product.collections.length - 1]?.breadcrumbs ?? []
						}
					></Breadcrumbs>
					<div class="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start mt-4 md:mt-12">
						<div class="w-full max-w-2xl mx-auto sm:block lg:max-w-none">
							<span class="rounded-md overflow-hidden">
								<div class="h-[400px] w-full md:w-[400px]">
									<Image
										layout="fixed"
										class="object-center object-cover rounded-lg"
										width="400"
										height="400"
										src={state.product.featuredAsset.preview + '?w=400&h=400'}
										alt={state.product.name}
										placeholder={IMAGE_PLACEHOLDER_BACKGROUND}
									/>
								</div>
							</span>
						</div>
						<div class="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
							<div class="">
								<h3 class="sr-only">Description</h3>
								<div
									class="text-base text-gray-700"
									dangerouslySetInnerHTML={state.product.description}
								/>
							</div>
							{1 < state.product.variants.length && (
								<div class="mt-4">
									<label class="block text-sm font-medium text-gray-700">Select option</label>
									<select
										class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
										value={state.selectedVariantId}
										onChange$={(e: any) => (state.selectedVariantId = e.target.value)}
									>
										{state.product.variants.map((variant) => (
											<option
												key={variant.id}
												value={variant.id}
												selected={state.selectedVariantId === variant.id}
											>
												{variant.name}
											</option>
										))}
									</select>
								</div>
							)}
							<div class="mt-10 flex flex-col sm:flex-row sm:items-center">
								<Price
									priceWithTax={selectedVariant()?.priceWithTax}
									currencyCode={selectedVariant()?.currencyCode}
									forcedClass="text-3xl text-gray-900 mr-4"
								></Price>
								<div class="flex sm:flex-col1 align-baseline">
									<button
										class={`max-w-xs flex-1 ${
											state.quantity[state.selectedVariantId] > 7
												? 'bg-gray-600 cursor-not-allowed'
												: state.quantity[state.selectedVariantId] === 0
												? 'bg-primary-600 hover:bg-primary-700'
												: 'bg-green-600 active:bg-green-700 hover:bg-green-700'
										} transition-colors border border-transparent rounded-md py-3 px-8 flex items-center 
									justify-center text-base font-medium text-white focus:outline-none 
									focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500 sm:w-full`}
										onClick$={async () => {
											if (state.quantity[state.selectedVariantId] <= 7) {
												const { addItemToOrder: order } = await execute<{
													addItemToOrder: ActiveOrder;
												}>(addItemToOrderMutation(state.selectedVariantId, 1));
												if (order.errorCode) {
													state.addItemToOrderError = order.errorCode;
												} else {
													appState.activeOrder = order;
												}
											}
										}}
									>
										{state.quantity[state.selectedVariantId] ? (
											<span class="flex items-center">
												<CheckIcon />
												{state.quantity[state.selectedVariantId]} in cart
											</span>
										) : (
											`Add to cart`
										)}
									</button>

									<button
										type="button"
										class="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
									>
										<HeartIcon />
										<span class="sr-only">Add to favorites</span>
									</button>
								</div>
							</div>
							<div class="mt-2 flex items-center space-x-2">
								<span class="text-gray-500">{selectedVariant()?.sku}</span>
								<StockLevelLabel stockLevel={selectedVariant()?.stockLevel} />
							</div>
							{!!state.addItemToOrderError && (
								<div class="mt-4">
									<Alert message={state.addItemToOrderError} />
								</div>
							)}

							<section class="mt-12 pt-12 border-t text-xs">
								<h3 class="text-gray-600 font-bold mb-2">Shipping & Returns</h3>
								<div class="text-gray-500 space-y-1">
									<p>
										Standard shipping: 3 - 5 working days. Express shipping: 1 - 3 working days.
									</p>
									<p>
										Shipping costs depend on delivery address and will be calculated during
										checkout.
									</p>
									<p>
										Returns are subject to terms. Please see the{' '}
										<span class="underline">returns page</span> for further information.
									</p>
								</div>
							</section>
						</div>
					</div>
				</div>
			</div>
			{isEnvVariableEnabled('VITE_SHOW_REVIEWS') && (
				<div class="mt-24">
					<TopReviews />
				</div>
			)}
		</div>
	);
});
