import { $, component$, useContext, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import BuildCustomNameTagV4 from '~/components/custom-option-visualizer/BuildCustomNameTagV4';
import { NameTagBuildParams } from '~/components/custom-option-visualizer/CustomVisualizerV4';

import { useProductLoader } from '../layout';

import Alert from '~/components/alert/Alert';
import HeartIcon from '~/components/icons/HeartIcon';
import Price from '~/components/products/Price';
import StockLevelLabel from '~/components/stock-level-label/StockLevelLabel';
import { Order, ProductVariant } from '~/generated/graphql';

import { useComputed$ } from '@builder.io/qwik';
import ProductVariantSelector from '~/components/products/ProductVariantSelector';
import { APP_STATE } from '~/constants';
import { addItemToOrderMutation } from '~/providers/shop/orders/order';
import { CUSTOMIZABLE_CLASS_DEF_TAG } from '~/routes/constants';
import { useFilamentColor, useFontMenu } from '~/routes/layout';
import { getCustomizableOptionArray } from '~/utils/customizable-order';

function parseBuildJson(productVariant?: ProductVariant) {
	if (productVariant?.customFields?.customBuildJson) {
		return JSON.parse(productVariant.customFields.customBuildJson);
	}
	return null;
}

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
	const buildPlates = useStore<{ top: boolean; bottom: boolean }>({
		top: true,
		bottom: true,
	});

	// Build parameters store
	const buildParams = useStore<NameTagBuildParams>({
		text_top: '',
		text_bottom: '',
		font_id_top: '',
		font_id_bottom: '',
		primary_color_id: '',
		base_color_id: '',
		is_top_additive: true,
	});

	useVisibleTask$(({ track }) => {
		track(() => [selectedVariantIdSignal.value]);
		buildPlates.top = parseBuildJson(selectedVariantSignal.value)?.build_top_plate ?? true;
		buildPlates.bottom = parseBuildJson(selectedVariantSignal.value)?.build_bottom_plate ?? true;
	});

	// ATC eligibility managed by BuildCustomNameTagV4
	const atcEligibility = useSignal<{ allowed: boolean; reason: string }>({
		allowed: false,
		reason: '',
	});

	// Final ATC validation including stock check
	const is_atc_allowed = useComputed$(() => {
		if (selectedVariantSignal.value?.stockLevel === 'OUT_OF_STOCK') {
			addItemToOrderErrorSignal.value = 'The selected variant is out of stock.';
			return false;
		}
		if (!atcEligibility.value.allowed) {
			addItemToOrderErrorSignal.value = atcEligibility.value.reason;
			return false;
		}
		addItemToOrderErrorSignal.value = '';
		return true;
	});

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
		async (inputArr: any, selectedVariantId: string, addItemToOrderErrorSignal: any) => {
			try {
				// Add item to order
				const addItemToOrder = await addItemToOrderMutation(selectedVariantId, 1, {
					customizableOptionJson: JSON.stringify(inputArr),
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
		}
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
						class="btn btn-success"
						disabled={!is_atc_allowed.value}
						onClick$={() => {
							const input = {
								textTop: buildPlates.top ? buildParams.text_top : null,
								textBottom: buildPlates.bottom ? buildParams.text_bottom : null,
								fontMenuIdTop: buildPlates.top ? buildParams.font_id_top : null,
								fontMenuIdBottom: buildPlates.bottom ? buildParams.font_id_bottom : null,
								filamentColorIdPrimary: buildParams.primary_color_id,
								filamentColorIdBase: buildParams.base_color_id,
								isTopAdditive: buildParams.is_top_additive,
							} as Record<string, string | number | boolean | null>;
							const inputArr = getCustomizableOptionArray(input, currentClassDef.optionDefinition);

							// Call the extracted async function
							handleAddToCart(inputArr, selectedVariantIdSignal.value, addItemToOrderErrorSignal);
						}}
					>
						{$localize`Add to cart`}
					</button>
					<button
						type="button"
						class="btn btn-ghost ml-4 py-3 px-3 rounded-md flex items-center justify-center "
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

			<BuildCustomNameTagV4
				filamentColors={FilamentColorSignal.value}
				fontMenus={FontMenuSignal.value}
				onAtcEligibility$={$((allowed: boolean, reason: string) => {
					atcEligibility.value = { allowed, reason };
				})}
				build_plates={buildPlates}
				canvas_width_px={250}
				onChange$={(buildParams: NameTagBuildParams) => {
					buildParams = buildParams;
				}}
			/>
		</>
	);
});
