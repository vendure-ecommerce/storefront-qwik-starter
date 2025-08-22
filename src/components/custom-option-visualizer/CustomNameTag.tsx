import { component$, Signal, useSignal } from '@qwik.dev/core';
import { routeLoader$ } from '@qwik.dev/router';
import ColorSelector from '~/components/custom-option-visualizer/ColorSelectorV2';
import { BuildPlateVisualizerV3 } from '~/components/custom-option-visualizer/CustomVisualizerV3';
import TextWithFontInput from '~/components/custom-option-visualizer/TextWithFontInput';
import DarkModeIcon from '~/components/icons/DarkModeIcon';
import {
	filamentColorFindSupported,
	fontMenuFindAll,
} from '~/providers/shop/orders/customizable-order';

export const useFilamentColor = routeLoader$(async () => {
	return await filamentColorFindSupported();
});

export const useFontMenu = routeLoader$(async () => {
	return await fontMenuFindAll();
});

interface CustomNameTagProps {
	canvas_width_px?: number; // Width of the canvas in pixels
	text_top?: Signal<string>; // Text for the top plate
	text_bottom?: Signal<string>; // Text for the bottom plate
	font_top_id?: Signal<string>; // Font ID for the top plate
	font_bottom_id?: Signal<string>; // Font ID for the bottom plate
	primary_color_id: Signal<string>; // Primary color ID
	base_color_id: Signal<string>; // Base color ID
	is_top_additive?: Signal<boolean>; // Whether the top plate is additive
	build_top_plate?: boolean; // Whether to build the top plate
	build_bottom_plate?: boolean; // Whether to build the bottom plate
	show_estimated_board_width?: boolean; // Whether to show the estimated board width
	is_atc_allowed: Signal<boolean>; // Whether ATC (Add to Cart) is allowed
}

export default component$(
	({
		canvas_width_px = 250,
		text_top,
		text_bottom,
		font_top_id,
		font_bottom_id,
		primary_color_id,
		base_color_id,
		is_top_additive,
		build_top_plate = true,
		build_bottom_plate = true,
		show_estimated_board_width = true,
		is_atc_allowed,
	}: CustomNameTagProps) => {
		if (build_top_plate) {
			if (!text_top || !font_top_id || !is_top_additive) {
				throw new Error(
					'text_top, font_top_id, and is_top_additive must be provided for the top plate.'
				);
			}
		}
		if (build_bottom_plate) {
			if (!text_bottom || !font_bottom_id) {
				throw new Error('text_bottom and font_bottom_id must be provided for the bottom plate.');
			}
		}

		const FilamentColorSignal = useFilamentColor(); // Load the Filament_Color from db
		const FontMenuSignal = useFontMenu(); // Load the Font_Menu from db

		const is_top_text_valid = useSignal<boolean>(true);
		const is_bottom_text_valid = useSignal<boolean>(true);
		const is_build_valid = useSignal<boolean>(true);

		return (
			<>
				<div>
					<div
						class={`border-2 border-gray-500 bg-gray-200 rounded-lg h-auto p-0 w-fit`}
						// style={{ width: `${canvas_width_px}px` }}
					>
						<div class="flex">
							<ColorSelector
								fieldTitle="Primary Color"
								colorOptions={FilamentColorSignal.value}
								selectedValue={primary_color_id}
								isBackgroundColor={false}
							/>
							<ColorSelector
								fieldTitle="Base Color"
								colorOptions={FilamentColorSignal.value}
								selectedValue={base_color_id}
								isBackgroundColor={true}
							/>
							{build_top_plate && (
								<button
									title="Change Top Plate style"
									class="mx-2 my-1 select-trigger-button"
									onClick$={() => {
										if (!is_top_additive) {
											throw new Error('is_top_additive must be provided for the top plate.');
										}
										is_top_additive.value = !is_top_additive.value;
									}}
								>
									<DarkModeIcon />
								</button>
							)}
						</div>
						<div class="bg-white rounded-b-lg flex">
							<BuildPlateVisualizerV3
								font_menu={FontMenuSignal.value}
								filament_color={FilamentColorSignal.value}
								text_top={text_top}
								text_bottom={text_bottom}
								font_id_top={font_top_id}
								font_id_bottom={font_bottom_id}
								primary_color_id={primary_color_id}
								base_color_id={base_color_id}
								is_top_additive={is_top_additive}
								is_build_valid={is_build_valid}
								build_top_plate={true}
								build_bottom_plate={true}
								build_canvas_width_px={canvas_width_px}
								show_estimated_board_width={true}
								// output_concatenated_canvas_element_id={canvas_stacked_element_id}
							/>
							<div class="flex flex-col justify-around p-2">
								<TextWithFontInput
									fieldTitle="Top Plate Text"
									fontMenu={FontMenuSignal.value}
									text={text_top}
									fontId={font_top_id}
									isTextValid={is_top_text_valid}
								/>
								<TextWithFontInput
									fieldTitle="Bottom Plate Text"
									fontMenu={FontMenuSignal.value}
									text={text_bottom}
									fontId={font_bottom_id}
									isTextValid={is_bottom_text_valid}
								/>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
);
