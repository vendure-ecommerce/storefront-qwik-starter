import { component$, useContext, useSignal } from '@qwik.dev/core';
import BuildCustomNameTag from '~/components/custom-option-visualizer/BuildCustomNameTag';
import { DEFAULT_OPTIONS_FOR_NAME_TAG, useFilamentColor, useFontMenu } from './layout';

import { useProductLoader } from '../layout';

import Alert from '~/components/alert/Alert';
import HeartIcon from '~/components/icons/HeartIcon';
import Price from '~/components/products/Price';
import StockLevelLabel from '~/components/stock-level-label/StockLevelLabel';
import { Order, ProductVariant } from '~/generated/graphql';
import { addItemToOrderV2Mutation } from '~/providers/shop/orders/order';

import { useComputed$ } from '@qwik.dev/core';
import ProductVariantSelector from '~/components/products/ProductVariantSelector';
import { APP_STATE } from '~/constants';

function parseBuildJson(productVariant?: ProductVariant) {
	if (productVariant?.customFields?.customBuildJson) {
		return JSON.parse(productVariant.customFields.customBuildJson);
	}
	return null;
}

export default component$(() => {
	const appState = useContext(APP_STATE);
	const productSignal = useProductLoader();
	const addItemToOrderErrorSignal = useSignal('');

	const selectedVariantIdSignal = useSignal(productSignal.value.variants[0].id);
	const selectedVariantSignal = useComputed$(() =>
		productSignal.value.variants.find((v) => v.id === selectedVariantIdSignal.value)
	);

	const build_top_plate = useComputed$(() => {
		return parseBuildJson(selectedVariantSignal.value)?.build_top_plate ?? true;
	});

	const build_bottom_plate = useComputed$(() => {
		return parseBuildJson(selectedVariantSignal.value)?.build_bottom_plate ?? true;
	});

	const FilamentColorSignal = useFilamentColor(); // Load the Filament_Color from db
	const FontMenuSignal = useFontMenu(); // Load the Font_Menu from db

	const defaultOptionsForNameTag = useContext(DEFAULT_OPTIONS_FOR_NAME_TAG);

	const text_top = useSignal<string>('Happy');
	const text_bottom = useSignal<string>('Day');
	const font_top_id = useSignal<string>(defaultOptionsForNameTag.fontId);
	const font_bottom_id = useSignal<string>(defaultOptionsForNameTag.fontId);
	const primary_color_id = useSignal<string>(defaultOptionsForNameTag.primaryColorId);
	const base_color_id = useSignal<string>(defaultOptionsForNameTag.baseColorId);
	const is_atc_allowed = useSignal<boolean>(true);
	const atc_disabled_reason = useSignal<string>('None');
	const is_top_additive = useSignal<boolean>(true);

	return (
		<>
			<div class="mt-10 flex flex-col sm:flex-row sm:items-center">
				<Price
					priceWithTax={selectedVariantSignal.value?.priceWithTax}
					currencyCode={selectedVariantSignal.value?.currencyCode}
					variantSig={selectedVariantSignal}
					forcedClass="text-3xl text-gray-900 mr-4"
				></Price>
				<div class="flex sm:flex-col1 align-baseline">
					<button
						class={{
							'max-w-xs flex-1 transition-colors border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500 sm:w-full':
								true,
							'bg-primary-600 hover:bg-primary-700': is_atc_allowed.value,
							'cursor-not-allowed opacity-50': !is_atc_allowed.value,
						}}
						onClick$={async () => {
							const input = {
								textTop: text_top.value,
								textBottom: text_bottom.value,
								fontMenuIdTop: font_top_id.value,
								fontMenuIdBottom: font_bottom_id.value,
								filamentColorIdPrimary: primary_color_id.value,
								filamentColorIdBase: base_color_id.value,
								isTopAdditive: is_top_additive.value,
							};
							const addItemToOrder = await addItemToOrderV2Mutation({
								productVariantId: selectedVariantIdSignal.value,
								quantity: 1,
								customNameTag: input,
							});
							if (addItemToOrder.__typename !== 'Order') {
								addItemToOrderErrorSignal.value = addItemToOrder.errorCode;
							} else {
								appState.activeOrder = addItemToOrder as Order;
							}
						}}
					>
						{$localize`Add to cart`}
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

			{1 < productSignal.value.variants.length && (
				<ProductVariantSelector
					productVariants={productSignal.value.variants}
					selectedVariantIdSignal={selectedVariantIdSignal}
				></ProductVariantSelector>
			)}

			<BuildCustomNameTag
				FilamentColorSignal={FilamentColorSignal}
				FontMenuSignal={FontMenuSignal}
				primary_color_id={primary_color_id}
				is_atc_allowed={is_atc_allowed}
				atc_disabled_reason={atc_disabled_reason}
				base_color_id={base_color_id}
				canvas_width_px={250}
				text_top={text_top}
				text_bottom={text_bottom}
				font_top_id={font_top_id}
				font_bottom_id={font_bottom_id}
				is_top_additive={is_top_additive}
				build_top_plate={build_top_plate}
				build_bottom_plate={build_bottom_plate}
				show_estimated_board_width={true}
			/>
			<p>{is_atc_allowed.value ? 'Build is valid, ATC allowed' : atc_disabled_reason.value}</p>
		</>
	);
});
