import { component$, ReadonlySignal, Signal, useComputed$, useSignal } from '@qwik.dev/core';
import ColorSelector from '~/components/custom-option-visualizer/ColorSelectorV2';
import { BuildPlateVisualizerV3 } from '~/components/custom-option-visualizer/CustomVisualizerV3';
import TextWithFontInput from '~/components/custom-option-visualizer/TextWithFontInput';
import DarkModeIcon from '~/components/icons/DarkModeIcon';

interface BuildCustomNameTagProps {
	FilamentColorSignal: ReadonlySignal<any>;
	FontMenuSignal: ReadonlySignal<any>;
	primary_color_id: Signal<string>; // Primary color ID
	base_color_id: Signal<string>; // Base color ID
	is_atc_allowed: Signal<boolean>; // Whether ATC (Add to Cart) is allowed
	atc_disabled_reason: Signal<string>; // Reason why ATC is disabled
	canvas_width_px?: number; // Width of the canvas in pixels
	text_top?: Signal<string>; // Text for the top plate
	text_bottom?: Signal<string>; // Text for the bottom plate
	font_top_id?: Signal<string>; // Font ID for the top plate
	font_bottom_id?: Signal<string>; // Font ID for the bottom plate
	is_top_additive?: Signal<boolean>; // Whether the top plate is additive
	build_top_plate: Signal<boolean>; // Whether to build the top plate
	build_bottom_plate: Signal<boolean>; // Whether to build the bottom plate
	show_estimated_board_width?: boolean; // Whether to show the estimated board width
}

export default component$(
	({
		FilamentColorSignal,
		FontMenuSignal,
		primary_color_id,
		base_color_id,
		is_atc_allowed,
		atc_disabled_reason,
		canvas_width_px = 250,
		text_top,
		text_bottom,
		font_top_id,
		font_bottom_id,
		is_top_additive,
		build_top_plate,
		build_bottom_plate,
		show_estimated_board_width,
	}: BuildCustomNameTagProps) => {
		// const FilamentColorSignal = useFilamentColor(); // Load the Filament_Color from db
		// const FontMenuSignal = useFontMenu(); // Load the Font_Menu from db

		const is_top_text_valid = useSignal<boolean>(true);
		const is_bottom_text_valid = useSignal<boolean>(true);
		const is_build_valid = useSignal<boolean>(true);
		const is_primary_and_base_color_different = useComputed$(() => {
			return primary_color_id.value !== base_color_id.value;
		});

		// Determine if Add to Cart is allowed
		const checkAtcAllowed = () => {
			if (!is_primary_and_base_color_different.value) {
				atc_disabled_reason.value = 'Primary color and base color cannot be the same.';
				return false;
			}
			if (!build_top_plate.value) {
				atc_disabled_reason.value = 'The build is invalid.';
				return is_bottom_text_valid.value && is_build_valid.value;
			}
			if (!build_bottom_plate.value) {
				atc_disabled_reason.value = 'The build is invalid.';
				return is_top_text_valid.value && is_build_valid.value;
			}
			atc_disabled_reason.value = 'The build is invalid.';
			return is_top_text_valid.value && is_bottom_text_valid.value && is_build_valid.value;
		};
		is_atc_allowed.value = checkAtcAllowed();

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
							{build_top_plate.value && (
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
								build_top_plate={build_top_plate}
								build_bottom_plate={build_bottom_plate}
								build_canvas_width_px={canvas_width_px}
								show_estimated_board_width={show_estimated_board_width}
							/>
							<div class="flex flex-col justify-around p-2">
								{build_top_plate.value && text_top && font_top_id && (
									<TextWithFontInput
										fieldTitle="Top Plate Text"
										fontMenu={FontMenuSignal.value}
										text={text_top}
										fontId={font_top_id}
										isTextValid={is_top_text_valid}
									/>
								)}
								{build_bottom_plate.value && text_bottom && font_bottom_id && (
									<TextWithFontInput
										fieldTitle="Bottom Plate Text"
										fontMenu={FontMenuSignal.value}
										text={text_bottom}
										fontId={font_bottom_id}
										isTextValid={is_bottom_text_valid}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
);
