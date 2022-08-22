import {
	$,
	component$,
	useClientEffect$,
	useContext,
	useMount$,
	useStore,
	useWatch$,
} from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import Alert from '~/components/alert/Alert';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs';
import CheckIcon from '~/components/icons/CheckIcon';
import HeartIcon from '~/components/icons/HeartIcon';
import Price from '~/components/products/Price';
import StockLevelLabel from '~/components/stock-level-label/StockLevelLabel';
import TopReviews from '~/components/top-reviews/TopReviews';
import { APP_STATE } from '~/constants';
import { addItemToOrderMutation } from '~/graphql/mutations';
import { getProductQuery } from '~/graphql/queries';
import { ActiveOrder, Line, Product, Variant } from '~/types';
import { execute } from '~/utils/api';

export default component$(() => {
	const location = useLocation();
	const state = useStore<{
		product: Product;
		selectedVariantId: string;
		quantity: Record<string, number>;
		loading: boolean;
		addItemToOrderError: string;
	}>({
		product: {} as Product,
		selectedVariantId: '',
		quantity: {},
		loading: true,
		addItemToOrderError: '',
	});
	const appState = useContext(APP_STATE);

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

	useMount$(async () => {
		const { product } = await execute<{ product: Product }>(
			getProductQuery({
				slug: location.params.slug,
			})
		);
		state.product = product;
		state.selectedVariantId = product.variants[0].id;
		calculateQuantities(state.product);
		state.loading = false;
	});

	useClientEffect$(async () => {
		window.scrollTo(0, 0);
	});

	useWatch$((tracker) => {
		tracker.track(appState, 'activeOrder');
		calculateQuantities(state.product);
	});

	const findVariantById = (id: string) => state.product.variants.find((v) => v.id === id);
	const selectedVariant = () => findVariantById(state.selectedVariantId);

	return state.loading ? (
		<>Loading...</>
	) : (
		<div>
			<div className="max-w-6xl mx-auto px-4 py-10">
				<h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
					{state.product.name}
				</h2>
				<Breadcrumbs
					items={state.product.collections[state.product.collections.length - 1]?.breadcrumbs ?? []}
				></Breadcrumbs>
				<div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start mt-4 md:mt-12">
					<div className="w-full max-w-2xl mx-auto sm:block lg:max-w-none">
						<span className="rounded-md overflow-hidden">
							<div className="w-full h-full object-center object-cover rounded-lg">
								<img
									src={state.product.featuredAsset.preview + '?w=800'}
									alt={state.product.name}
									className="w-full h-full object-center object-cover rounded-lg"
									width="800"
								/>
							</div>
						</span>
					</div>
					<div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
						<div className="">
							<h3 className="sr-only">Description</h3>
							<div
								className="text-base text-gray-700"
								dangerouslySetInnerHTML={state.product.description}
							/>
						</div>
						{1 < state.product.variants.length ? (
							<div className="mt-4">
								<label className="block text-sm font-medium text-gray-700">Select option</label>
								<select
									className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
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
						) : (
							<input type="hidden" value={state.selectedVariantId}></input>
						)}
						<div className="mt-10 flex flex-col sm:flex-row sm:items-center">
							<Price
								priceWithTax={selectedVariant()?.priceWithTax}
								currencyCode={selectedVariant()?.currencyCode}
								forcedClassName="text-3xl text-gray-900 mr-4"
							></Price>
							<div className="flex sm:flex-col1 align-baseline">
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
										<span className="flex items-center">
											<CheckIcon />
											{state.quantity[state.selectedVariantId]} in cart
										</span>
									) : (
										`Add to cart`
									)}
								</button>

								<button
									type="button"
									className="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
								>
									<HeartIcon />
									<span className="sr-only">Add to favorites</span>
								</button>
							</div>
						</div>
						<div className="mt-2 flex items-center space-x-2">
							<span className="text-gray-500">{selectedVariant()?.sku}</span>
							<StockLevelLabel stockLevel={selectedVariant()?.stockLevel} />
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
