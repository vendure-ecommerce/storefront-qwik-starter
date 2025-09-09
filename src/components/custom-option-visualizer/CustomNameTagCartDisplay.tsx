import { component$, ReadonlySignal, useContext, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { getCustomBuildOption } from '~/providers/shop/orders/customizable-order';
import { DEFAULT_OPTIONS_FOR_NAME_TAG } from '~/routes/constants';
import { BuildPlateVisualizerV3 } from './CustomVisualizerV3';

interface CustomNameTagCartDisplayProps {
	filamentColorSignal: ReadonlySignal<any>;
	fontMenuSignal: ReadonlySignal<any>;
	customVariantId: string;
}

export default component$(
	({ filamentColorSignal, fontMenuSignal, customVariantId }: CustomNameTagCartDisplayProps) => {
		const defaultOptionsForNameTag = useContext(DEFAULT_OPTIONS_FOR_NAME_TAG);
		const errorMessage = useSignal<string>('');

		const text_top = useSignal<string>('GG'); // Changed from undefined to empty string
		const text_bottom = useSignal<string>('AA'); // Changed from undefined to empty string
		const font_id_top = useSignal<string>(defaultOptionsForNameTag.fontId);
		const font_id_bottom = useSignal<string>(defaultOptionsForNameTag.fontId);
		const primary_color_id = useSignal<string>(defaultOptionsForNameTag.primaryColorId);
		const base_color_id = useSignal<string>(defaultOptionsForNameTag.baseColorId);
		const is_top_additive = useSignal<boolean>(true);
		const build_top_plate = useSignal<boolean>(true);
		const build_bottom_plate = useSignal<boolean>(true);

		const is_build_valid = useSignal<boolean>(true);

		useVisibleTask$(async () => {
			const customNameTag = await getCustomBuildOption(customVariantId);
			if (customNameTag?.__typename === 'CustomNameTag') {
				text_top.value = customNameTag.textTop ?? '';
				text_bottom.value = customNameTag.textBottom ?? '';
				font_id_top.value = customNameTag.fontTop?.id ?? '';
				font_id_bottom.value = customNameTag.fontBottom?.id ?? '';
				primary_color_id.value =
					customNameTag.primaryColor?.id ?? defaultOptionsForNameTag.primaryColorId;
				base_color_id.value = customNameTag.baseColor?.id ?? defaultOptionsForNameTag.baseColorId;
				is_top_additive.value = customNameTag.isTopAdditive ?? true;
				build_top_plate.value = !!text_top.value;
				build_bottom_plate.value = !!text_bottom.value;
				errorMessage.value = is_build_valid.value ? '' : 'The build is invalid.';
				console.log('CustomNameTag loaded:', customNameTag);
			} else {
				errorMessage.value = 'Failed to load custom name tag.';
				is_build_valid.value = false;
			}
		});

		return (
			<>
				<BuildPlateVisualizerV3
					font_menu={fontMenuSignal.value}
					filament_color={filamentColorSignal.value}
					text_top={text_top}
					text_bottom={text_bottom}
					font_id_top={font_id_top}
					font_id_bottom={font_id_bottom}
					primary_color_id={primary_color_id}
					base_color_id={base_color_id}
					is_top_additive={is_top_additive}
					build_canvas_width_px={100}
					is_build_valid={is_build_valid}
					build_top_plate={build_top_plate}
					build_bottom_plate={build_bottom_plate}
					output_top_canvas_element_id={`top-name-tag-cart-display-${customVariantId}`}
					output_bottom_canvas_element_id={`bottom-name-tag-cart-display-${customVariantId}`}
					output_concatenated_canvas_element_id={`concatenated-name-tag-cart-display-${customVariantId}`}
				/>
				{errorMessage.value && (
					<p class="mt-2 text-sm text-red-600" id="email-error">
						{errorMessage.value}
					</p>
				)}
			</>
		);
	}
);
