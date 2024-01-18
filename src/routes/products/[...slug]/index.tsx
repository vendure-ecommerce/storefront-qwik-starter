import { $, component$, useComputed$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { Image } from 'qwik-image';
import Alert from '~/components/alert/Alert';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs';
import CheckIcon from '~/components/icons/CheckIcon';
import HeartIcon from '~/components/icons/HeartIcon';
import Price from '~/components/products/Price';
import StockLevelLabel from '~/components/stock-level-label/StockLevelLabel';
import TopReviews from '~/components/top-reviews/TopReviews';
import { APP_STATE } from '~/constants';
import { Order, OrderLine, Product } from '~/generated/graphql';
import { addItemToOrderMutation } from '~/providers/shop/orders/order';
import { getProductBySlug } from '~/providers/shop/products/products';
import { Variant } from '~/types';
import { cleanUpParams, generateDocumentHead, isEnvVariableEnabled } from '~/utils';

export const useProductLoader = routeLoader$(async ({ params }) => {
	const { slug } = cleanUpParams(params);
	const product = await getProductBySlug(slug);
	if (product.assets.length === 1) {
		product.assets.push({
			id: 'placeholder_2',
			name: 'placeholder',
			preview: '/asset_placeholder.webp',
		});
	}
	return product;
});

export default component$(() => {
	const appState = useContext(APP_STATE);

	const calculateQuantities = $((product: Product) => {
		const result: Record<string, number> = {};
		(product.variants || []).forEach((variant: Variant) => {
			const orderLine = (appState.activeOrder?.lines || []).find(
				(l: OrderLine) =>
					l.productVariant.id === variant.id && l.productVariant.product.id === product.id
			);
			result[variant.id] = orderLine?.quantity || 0;
		});
		return result;
	});

	const productSignal = useProductLoader();
	const currentImageSig = useSignal(productSignal.value.assets[0]);
	const selectedVariantIdSignal = useSignal(productSignal.value.variants[0].id);
	const selectedVariantSignal = useComputed$(() =>
		productSignal.value.variants.find((v) => v.id === selectedVariantIdSignal.value)
	);
	const addItemToOrderErrorSignal = useSignal('');
	const quantitySignal = useSignal<Record<string, number>>({});

	useTask$(async (tracker) => {
		tracker.track(() => appState.activeOrder);
		quantitySignal.value = await calculateQuantities(productSignal.value);
	});

	return (
		<div>
			<div class="max-w-6xl mx-auto px-4 py-10">
				<div>
					<h2 class="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
						{productSignal.value.name}
					</h2>
					<Breadcrumbs
						items={
							productSignal.value.collections[productSignal.value.collections.length - 1]
								?.breadcrumbs ?? []
						}
					></Breadcrumbs>
					<div class="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start mt-4 md:mt-12">
						<div class="w-full max-w-2xl mx-auto sm:block lg:max-w-none">
							<span class="rounded-md overflow-hidden">
								<div class="h-[400px] w-full md:w-[400px]">
									<Image
										layout="fixed"
										class="object-center object-cover rounded-lg mx-auto"
										width="400"
										height="400"
										src={currentImageSig.value.preview + '?w=400&h=400&format=webp'}
										alt={currentImageSig.value.name}
									/>
								</div>
								{productSignal.value.assets.length > 1 && (
									<div class="w-full md:w-[400px] my-2 flex flex-wrap gap-3 justify-center">
										{productSignal.value.assets.map((asset, key) => (
											<Image
												key={key}
												layout="fixed"
												class={{
													'object-center object-cover rounded-lg': true,
													'border-b-8 border-primary-600': currentImageSig.value.id === asset.id,
												}}
												width="80"
												height="80"
												src={asset.preview + '?w=400&h=400&format=webp'}
												alt={asset.name}
												onClick$={() => {
													currentImageSig.value = asset;
												}}
											/>
										))}
									</div>
								)}
							</span>
						</div>
						<div class="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
							<div class="">
								<h3 class="sr-only">Description</h3>
								<div
									class="text-base text-gray-700"
									dangerouslySetInnerHTML={productSignal.value.description}
								/>
							</div>
							{1 < productSignal.value.variants.length && (
								<div class="mt-4">
									<label class="block text-sm font-medium text-gray-700">Select option</label>
									<select
										class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
										value={selectedVariantIdSignal.value}
										onChange$={(_, el) => (selectedVariantIdSignal.value = el.value)}
									>
										{productSignal.value.variants.map((variant) => (
											<option
												key={variant.id}
												value={variant.id}
												selected={selectedVariantIdSignal.value === variant.id}
											>
												{variant.name}
											</option>
										))}
									</select>
								</div>
							)}
							<div class="mt-10 flex flex-col sm:flex-row sm:items-center">
								<Price
									priceWithTax={selectedVariantSignal.value?.priceWithTax}
									currencyCode={selectedVariantSignal.value?.currencyCode}
									forcedClass="text-3xl text-gray-900 mr-4"
								></Price>
								<div class="flex sm:flex-col1 align-baseline">
									<button
										class={{
											'max-w-xs flex-1 transition-colors border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500 sm:w-full':
												true,
											'bg-primary-600 hover:bg-primary-700':
												quantitySignal.value[selectedVariantIdSignal.value] === 0,
											'bg-green-600 active:bg-green-700 hover:bg-green-700':
												quantitySignal.value[selectedVariantIdSignal.value] >= 1 &&
												quantitySignal.value[selectedVariantIdSignal.value] <= 7,
											'bg-gray-600 cursor-not-allowed':
												quantitySignal.value[selectedVariantIdSignal.value] > 7,
										}}
										onClick$={async () => {
											if (quantitySignal.value[selectedVariantIdSignal.value] <= 7) {
												const addItemToOrder = await addItemToOrderMutation(
													selectedVariantIdSignal.value,
													1
												);
												if (addItemToOrder.__typename !== 'Order') {
													addItemToOrderErrorSignal.value = addItemToOrder.errorCode;
												} else {
													appState.activeOrder = addItemToOrder as Order;
												}
											}
										}}
									>
										{quantitySignal.value[selectedVariantIdSignal.value] ? (
											<span class="flex items-center">
												<CheckIcon />
												{$localize`${quantitySignal.value[selectedVariantIdSignal.value]} in cart`}
											</span>
										) : (
											$localize`Add to cart`
										)}
									</button>
									<button
										type="button"
										class="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
									>
										<HeartIcon />
										<span class="sr-only">{$localize`Add to favorites`}</span>
									</button>
								</div>
							</div>
							<div class="mt-2 flex items-center space-x-2">
								<span class="text-gray-500">{selectedVariantSignal.value?.sku}</span>
								<StockLevelLabel stockLevel={selectedVariantSignal.value?.stockLevel} />
							</div>
							{!!addItemToOrderErrorSignal.value && (
								<div class="mt-4">
									<Alert message={addItemToOrderErrorSignal.value} />
								</div>
							)}

							<section class="mt-12 pt-12 border-t text-xs">
								<h3 class="text-gray-600 font-bold mb-2">{$localize`Shipping & Returns`}</h3>
								<div class="text-gray-500 space-y-1">
									<p>
										{$localize`Standard shipping: 3 - 5 working days. Express shipping: 1 - 3 working days.`}
									</p>
									<p>
										{$localize`Shipping costs depend on delivery address and will be calculated during checkout.`}
									</p>
									<p>
										{$localize`Returns are subject to terms. Please see the`}{' '}
										<span class="underline">{$localize`returns page`}</span>{' '}
										{$localize`for further information`}.
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

export const head: DocumentHead = ({ resolveValue, url }) => {
	const product = resolveValue(useProductLoader);
	return generateDocumentHead(
		url.href,
		product.name,
		product.description,
		product.featuredAsset?.preview
	);
};
