import { component$, useContext } from '@builder.io/qwik';

import { useProductLoader } from '../layout';

import Alert from '~/components/alert/Alert';
import CheckIcon from '~/components/icons/CheckIcon';
import HeartIcon from '~/components/icons/HeartIcon';
import Price from '~/components/products/Price';
import StockLevelLabel from '~/components/stock-level-label/StockLevelLabel';
import { Order } from '~/generated/graphql';
import { addItemToOrderMutation } from '~/providers/shop/orders/order';

import { useComputed$, useSignal } from '@builder.io/qwik';
import ProductVariantSelector from '~/components/products/ProductVariantSelector';
import { APP_STATE } from '~/constants';
import { OrderLine } from '~/generated/graphql';
import { Variant } from '~/types';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const productSignal = useProductLoader();
	const addItemToOrderErrorSignal = useSignal('');
	const quantitySignal = useComputed$<Record<string, number>>(() => {
		const result: Record<string, number> = {};
		(productSignal.value.variants || []).forEach((variant: Variant) => {
			const orderLine = (appState.activeOrder?.lines || []).find(
				(l: OrderLine) =>
					l.productVariant.id === variant.id &&
					l.productVariant.product.id === productSignal.value.id
			);
			result[variant.id] = orderLine?.quantity || 0;
		});
		return result;
	});

	const selectedVariantIdSignal = useSignal(productSignal.value.variants[0].id);
	const selectedVariantSignal = useComputed$(() =>
		productSignal.value.variants.find((v) => v.id === selectedVariantIdSignal.value)
	);

	return (
		<>
			<div class="mt-10 flex flex-col sm:flex-row sm:items-center">
				<Price
					priceWithTax={selectedVariantSignal.value?.priceWithTax}
					currencyCode={selectedVariantSignal.value?.currencyCode}
					variantSig={selectedVariantSignal}
					forcedClass="text-3xl mr-4"
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
									addItemToOrderErrorSignal.value = '';
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
						class="ml-4 py-3 px-3 rounded-md flex items-center justify-center  "
					>
						<HeartIcon />
						<span class="sr-only">{$localize`Add to favorites`}</span>
					</button>
				</div>
			</div>
			<div class="mt-2 flex items-center space-x-2">
				<span class="">{selectedVariantSignal.value?.sku}</span>
				<StockLevelLabel stockLevel={selectedVariantSignal.value?.stockLevel} />
			</div>
			{!!addItemToOrderErrorSignal.value && (
				<div class="mt-4">
					<Alert message={addItemToOrderErrorSignal.value} />
				</div>
			)}
			{1 < productSignal.value.variants.length && (
				<ProductVariantSelector
					productVariants={productSignal.value.variants}
					selectedVariantIdSignal={selectedVariantIdSignal}
				></ProductVariantSelector>
			)}
		</>
	);
});
