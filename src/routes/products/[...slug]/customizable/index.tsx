import { $, component$, useContext, useSignal } from '@qwik.dev/core';
import BuildCustomNameTag from '~/components/custom-option-visualizer/BuildCustomNameTag';

import { useProductLoader } from '../layout';

import Alert from '~/components/alert/Alert';
import HeartIcon from '~/components/icons/HeartIcon';
import Price from '~/components/products/Price';
import StockLevelLabel from '~/components/stock-level-label/StockLevelLabel';
import { Order, ProductVariant } from '~/generated/graphql';

import { useComputed$ } from '@qwik.dev/core';
import ProductVariantSelector from '~/components/products/ProductVariantSelector';
import { APP_STATE } from '~/constants';
import { batchAddCustomizedImagesToOrderMutation } from '~/providers/shop/orders/customizable-order';
import { addItemToOrderMutation } from '~/providers/shop/orders/order';
import { CUSTOMIZABLE_CLASS_DEF_TAG, DEFAULT_OPTIONS_FOR_NAME_TAG } from '~/routes/constants';
import { useFilamentColor, useFontMenu } from '~/routes/layout';
import { getCustomizableOptionArray } from '~/utils/customizable-order';

function parseBuildJson(productVariant?: ProductVariant) {
	if (productVariant?.customFields?.customBuildJson) {
		return JSON.parse(productVariant.customFields.customBuildJson);
	}
	return null;
}

const CONCATENATE_CANVAS_ELEMENT_ID = 'custom-name-tag-preview-canvas';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const productSignal = useProductLoader();
	const FilamentColorSignal = useFilamentColor(); // Load the Filament_Color from db
	const FontMenuSignal = useFontMenu(); // Load the Font_Menu from db

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

	const defaultOptionsForNameTag = useContext(DEFAULT_OPTIONS_FOR_NAME_TAG);

	const text_top = useSignal<string>('Happy');
	const text_bottom = useSignal<string>('Day');
	const font_id_top = useSignal<string>(defaultOptionsForNameTag.fontId);
	const font_id_bottom = useSignal<string>(defaultOptionsForNameTag.fontId);
	const primary_color_id = useSignal<string>(defaultOptionsForNameTag.primaryColorId);
	const base_color_id = useSignal<string>(defaultOptionsForNameTag.baseColorId);
	const is_build_valid = useSignal<boolean>(true);
	const atc_disabled_reason = useSignal<string>('None');
	const is_top_additive = useSignal<boolean>(true);

	const is_atc_allowed = useComputed$(() => {
		if (selectedVariantSignal.value?.stockLevel !== 'IN_STOCK') {
			addItemToOrderErrorSignal.value = 'The selected variant is out of stock.';
			return false;
		}
		if (!is_build_valid.value) {
			return false;
		}
		addItemToOrderErrorSignal.value = '';
		return true;
	});

	const customizedImageFilename = `custom-name-tag-${Date.now()}.jpg`;

	const customizableClassDef = useContext(CUSTOMIZABLE_CLASS_DEF_TAG);
	const currentClassDef = customizableClassDef.find(
		(def) => def.name === productSignal.value.customFields?.customizableClass
	);
	// raise error if currentClassDef is not found
	if (!currentClassDef) {
		throw new Error(
			`Customizable class definition not found for class name: ${productSignal.value.customFields?.customizableClass}`
		);
	}

	const handleAddToCart = $(
		async (
			filename: string,
			inputArr: any,
			selectedVariantId: string,
			addItemToOrderErrorSignal: any
		) => {
			try {
				// Add item to order
				const addItemToOrder = await addItemToOrderMutation(selectedVariantId, 1, {
					customizableOptionJson: JSON.stringify(inputArr),
					// customizedImageAssetId: canvasAssetId || undefined,
				});

				if (addItemToOrder.__typename !== 'Order') {
					addItemToOrderErrorSignal.value = addItemToOrder.errorCode;
				} else {
					addItemToOrderErrorSignal.value = '';
					appState.activeOrder = addItemToOrder as Order;
				}
			} catch (error) {
				console.error('Error adding to cart:', error);
				addItemToOrderErrorSignal.value = 'Failed to add item to cart';
			}

			console.log(JSON.stringify(appState.activeOrder.lines, null, 2));

			const orderLineId = appState.activeOrder?.lines.find(
				(line) =>
					line.productVariant.id === selectedVariantId &&
					line.customFields?.customizableOptionJson === JSON.stringify(inputArr)
			)?.id;
			if (!orderLineId) {
				console.error('Order line not found for the added item');
				return;
			}

			const canvas = document.getElementById(CONCATENATE_CANVAS_ELEMENT_ID) as HTMLCanvasElement;
			if (!canvas) {
				throw new Error(`Canvas with id ${CONCATENATE_CANVAS_ELEMENT_ID} not found`);
			}
			canvas.toBlob(
				(blob) => {
					if (!blob) {
						console.error('Failed to create blob from canvas');
						return;
					}
					const file = new File([blob], filename, { type: 'image/jpeg' });
					try {
						batchAddCustomizedImagesToOrderMutation([file], [orderLineId]);
					} catch (error) {
						console.error('Error adding customized image to order:', error);
					}
				},
				'image/jpeg',
				0.5
			);
		}
	);

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
							'cursor-not-allowed opacity-50 bg-primary-400': !is_atc_allowed.value,
						}}
						onClick$={() => {
							const input = {
								textTop: build_top_plate.value ? text_top.value : null,
								textBottom: build_bottom_plate.value ? text_bottom.value : null,
								fontMenuIdTop: build_top_plate.value ? font_id_top.value : null,
								fontMenuIdBottom: build_bottom_plate.value ? font_id_bottom.value : null,
								filamentColorIdPrimary: primary_color_id.value,
								filamentColorIdBase: base_color_id.value,
								isTopAdditive: is_top_additive.value,
							};
							const inputArr = getCustomizableOptionArray(input, currentClassDef.optionDefinition);

							// Call the extracted async function
							handleAddToCart(
								customizedImageFilename,
								inputArr,
								selectedVariantIdSignal.value,
								addItemToOrderErrorSignal
							);
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

			{1 < productSignal.value.variants.length && (
				<ProductVariantSelector
					productVariants={productSignal.value.variants}
					selectedVariantIdSignal={selectedVariantIdSignal}
				></ProductVariantSelector>
			)}

			{!!addItemToOrderErrorSignal.value && (
				<div class="mt-4">
					<Alert message={addItemToOrderErrorSignal.value} />
				</div>
			)}

			<BuildCustomNameTag
				FilamentColorSignal={FilamentColorSignal}
				FontMenuSignal={FontMenuSignal}
				primary_color_id={primary_color_id}
				is_atc_allowed={is_build_valid}
				atc_disabled_reason={atc_disabled_reason}
				base_color_id={base_color_id}
				canvas_width_px={250}
				text_top={text_top}
				text_bottom={text_bottom}
				font_id_top={font_id_top}
				font_id_bottom={font_id_bottom}
				is_top_additive={is_top_additive}
				build_top_plate={build_top_plate}
				build_bottom_plate={build_bottom_plate}
				show_estimated_board_width={true}
				output_concatenated_canvas_element_id={CONCATENATE_CANVAS_ELEMENT_ID}
			/>
		</>
	);
});
