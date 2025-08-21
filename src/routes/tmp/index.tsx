import { component$, useSignal } from '@qwik.dev/core';
import { routeLoader$ } from '@qwik.dev/router';
import ColorSelector from '~/components/custom-option-visualizer/ColorSelectorV2';
import { BuildPlateVisualizerV3 } from '~/components/custom-option-visualizer/CustomVisualizerV3';
import TextWithFontInput from '~/components/custom-option-visualizer/TextWithFontInput';
import DarkModeIcon from '~/components/icons/DarkModeIcon';
import {
	createOrRetrieveCustomNameTag,
	filamentColorFindSupported,
	fontMenuFindAll,
} from '~/providers/shop/orders/customizable-order';

export const useFilamentColor = routeLoader$(async () => {
	return await filamentColorFindSupported();
});

export const useFontMenu = routeLoader$(async () => {
	return await fontMenuFindAll();
});

const canvas_width_px = 250;
const canvas_top_element_id = 'canvas_top_element_id'; // The ID of the canvas element to render the visualizer

export default component$(() => {
	const FilamentColorSignal = useFilamentColor(); // Load the Filament_Color from db
	const FontMenuSignal = useFontMenu(); // Load the Font_Menu from db

	const defaultPrimaryColorId = FilamentColorSignal.value.find((c) => c.name === 'latte_brown')?.id;
	const defaultBaseColorId = FilamentColorSignal.value.find((c) => c.name === 'ivory_white')?.id;
	if (!defaultPrimaryColorId || !defaultBaseColorId) {
		throw new Error('Default colors not found in FilamentColorSignal!');
	}

	const defaultFontId = FontMenuSignal.value.find((f) => f.name === 'Comic Neue')?.id;
	if (!defaultFontId) {
		throw new Error('Default fonts not found in FontMenuSignal!');
	}

	const text_top = useSignal<string>('Happy');
	const text_bottom = useSignal<string>('Day');
	const font_top_id = useSignal<string>(defaultFontId);
	const font_bottom_id = useSignal<string>(defaultFontId);
	const primary_color_id = useSignal<string>(defaultPrimaryColorId);
	const base_color_id = useSignal<string>(defaultBaseColorId);
	const is_top_additive = useSignal<boolean>(true);
	const custom_name_tag_id = useSignal<string | null>(null);
	const is_top_text_valid = useSignal<boolean>(true);
	const is_bottom_text_valid = useSignal<boolean>(true);

	return (
		<>
			<div>
				<div
					class={`border-2 border-gray-500 bg-gray-200 rounded-lg h-auto p-0 w-fit`}
					// style={{ width: `${canvas_width_px}px` }}
				>
					<div class="flex justify-center">
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
						<button
							title="Change Top Plate style"
							class="mx-2 my-1 select-trigger-button"
							onClick$={() => {
								is_top_additive.value = !is_top_additive.value;
							}}
						>
							<DarkModeIcon />
							{/* <span class="ml-1">
								{is_top_additive.value ? 'Top Additive' : 'Top Subtractive'}
							</span> */}
						</button>
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
							build_top_plate={true}
							build_bottom_plate={true}
							build_canvas_width_px={canvas_width_px}
							show_estimated_board_width={false}
							output_top_canvas_element_id={canvas_top_element_id}
						/>
						<div class="flex flex-col justify-evenly">
							{/* <label> Top Plate Text</label> */}
							<TextWithFontInput
								fieldTitle="Top Plate Text"
								fontMenu={FontMenuSignal.value}
								text={text_top}
								fontId={font_top_id}
								isTextValid={is_top_text_valid}
							/>

							{/* <label> Bottom Plate Text </label> */}
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

			<div class="text-center mt-4">
				<button
					class="bg-blue-500 text-white px-4 py-2 rounded"
					onClick$={() => {
						const canvas = document.getElementById(canvas_top_element_id) as HTMLCanvasElement;
						const link = document.createElement('a');
						link.download = 'rendered_name_tag.jpg';
						link.href = canvas.toDataURL('image/jpeg', 0.5);
						link.click();
					}}
				>
					Save Canvas
				</button>
			</div>

			<div class="text-center mt-4">
				{/* A button to create or retrieve custom name tag */}
				<button
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
						try {
							const result = await createOrRetrieveCustomNameTag(input);

							console.log('Custom Name Tag created or retrieved:', result);
							if ('customNameTagId' in result) {
								custom_name_tag_id.value = result.customNameTagId;
								console.log('saving custom name tag:', result);
							} else if (result.__typename === 'CreateCustomNameTagError') {
								console.error(
									'Error creating custom name tag:',
									result.message,
									'Error code:',
									result.errorCode
								);
							}
						} catch (error) {
							console.error('Error creating or retrieving custom name tag:', error);
						}
					}}
					class="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Create Custom Name Tag
				</button>
				<p> Custom Name Tag ID: {custom_name_tag_id.value}</p>
			</div>
		</>
	);
});
