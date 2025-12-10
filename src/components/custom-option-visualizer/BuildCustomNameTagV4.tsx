import {
	component$,
	Signal,
	useComputed$,
	useContext,
	useSignal,
	useVisibleTask$,
} from '@qwik.dev/core';
import ColorSelector from '~/components/custom-option-visualizer/ColorSelectorV4';
import TextWithFontInput from '~/components/custom-option-visualizer/TextWithFontInputV4';
import DarkModeIcon from '~/components/icons/DarkModeIcon';
import { FilamentColor, FontMenu } from '~/generated/graphql-shop';
import { DEFAULT_OPTIONS_FOR_NAME_TAG } from '~/routes/tmp2/layout';
import { CONSTRAINTS } from './constants';
import { BuildPlateVisualizerV4, NameTagBuildParams } from './CustomVisualizerV4';

interface BuildCustomNameTagProps {
	filamentColors: Pick<FilamentColor, 'id' | 'name' | 'displayName' | 'hexCode' | 'isOutOfStock'>[];
	fontMenus: Pick<
		FontMenu,
		'id' | 'name' | 'additiveFontId' | 'subtractiveFontId' | 'isDisabled'
	>[];
	buildParams: NameTagBuildParams;
	is_atc_allowed: Signal<boolean>; // Whether ATC (Add to Cart) is allowed
	atc_disabled_reason: Signal<string>; // Reason why ATC is disabled
	canvas_width_px?: number; // Width of the canvas in pixels
	build_top_plate: Signal<boolean>; // Whether to build the top plate
	build_bottom_plate: Signal<boolean>; // Whether to build the bottom plate
	show_estimated_board_width?: boolean; // Whether to show the estimated board width
	output_concatenated_canvas_element_id?: string; // ID for the concatenated canvas element
}

export default component$(
	({
		filamentColors,
		fontMenus,
		buildParams,
		is_atc_allowed,
		atc_disabled_reason,
		canvas_width_px = 250,
		build_top_plate,
		build_bottom_plate,
		show_estimated_board_width,
		output_concatenated_canvas_element_id,
	}: BuildCustomNameTagProps) => {
		const top_canvas_id = 'canvas_top';
		const bottom_canvas_id = 'canvas_bottom';
		const canvas_concatenate_id = 'canvas_concatenate';

		const defaultOptionsForNameTag = useContext(DEFAULT_OPTIONS_FOR_NAME_TAG);
		const is_top_text_valid = useSignal<boolean>(true);
		const is_bottom_text_valid = useSignal<boolean>(true);
		const is_build_valid = useSignal<boolean>(true);
		const is_primary_and_base_color_different = useComputed$(() => {
			return buildParams.primary_color_id !== buildParams.base_color_id;
		});
		const boardWidth_cm = useSignal<number>(0);
		const canvas_top = useSignal<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);
		const canvas_bottom = useSignal<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);
		// const canvas_concatenate = useSignal<HTMLCanvasElement>();

		useVisibleTask$(() => {
			canvas_top.value = document.getElementById(top_canvas_id) as HTMLCanvasElement;
			canvas_bottom.value = document.getElementById(bottom_canvas_id) as HTMLCanvasElement;
			// canvas_concatenate.value = document.getElementById(canvas_concatenate_id) as HTMLCanvasElement;
		});

		useVisibleTask$(({ track }) => {
			track(() => [
				buildParams.base_color_id,
				buildParams.primary_color_id,
				buildParams.is_top_additive,
				buildParams.text_top,
				buildParams.text_bottom,
				buildParams.font_id_top,
				buildParams.font_id_bottom,
				build_top_plate.value,
				build_bottom_plate.value,
			]);
			if (canvas_top.value && canvas_bottom.value) {
				const buildResult = BuildPlateVisualizerV4({
					font_menu: fontMenus,
					filament_color: filamentColors,
					buildParams: buildParams,
					build_top_plate: build_top_plate.value,
					build_bottom_plate: build_bottom_plate.value,
					canvas_top: canvas_top.value,
					canvas_bottom: canvas_bottom.value,
					// canvas_concatenate: canvas_concatenate,
				});
				boardWidth_cm.value = buildResult.boardWidth_cm;
				is_build_valid.value = buildResult.valid;
			}
		});

		// Determine if Add to Cart is allowed - only update on client side
		useVisibleTask$(({ track }) => {
			track(() => [
				is_primary_and_base_color_different.value,
				build_top_plate.value,
				build_bottom_plate.value,
				is_top_text_valid.value,
				is_bottom_text_valid.value,
				is_build_valid.value,
			]);

			if (!is_primary_and_base_color_different.value) {
				atc_disabled_reason.value = 'Primary color and base color cannot be the same.';
				is_atc_allowed.value = false;
				return;
			}
			if (!build_top_plate.value) {
				atc_disabled_reason.value = 'The build is invalid.';
				is_atc_allowed.value = is_bottom_text_valid.value && is_build_valid.value;
				return;
			}
			if (!build_bottom_plate.value) {
				atc_disabled_reason.value = 'The build is invalid.';
				is_atc_allowed.value = is_top_text_valid.value && is_build_valid.value;
				return;
			}
			atc_disabled_reason.value =
				is_top_text_valid.value && is_bottom_text_valid.value && is_build_valid.value
					? ''
					: 'The build is invalid.';
			is_atc_allowed.value =
				is_top_text_valid.value && is_bottom_text_valid.value && is_build_valid.value;
		});

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
								colorOptions={filamentColors}
								defaultColorId={defaultOptionsForNameTag.primaryColorId}
								isBackgroundColor={false}
								onChange$={(newColorId: string) => {
									buildParams.primary_color_id = newColorId;
								}}
							/>
							<ColorSelector
								fieldTitle="Base Color"
								colorOptions={filamentColors}
								defaultColorId={defaultOptionsForNameTag.baseColorId}
								isBackgroundColor={true}
								onChange$={(newColorId: string) => {
									buildParams.base_color_id = newColorId;
								}}
							/>
							{build_top_plate.value && (
								<button
									title="Change Top Plate style"
									class="mx-2 my-1 select-trigger-button"
									onClick$={() => {
										buildParams.is_top_additive = !buildParams.is_top_additive;
									}}
								>
									<DarkModeIcon />
								</button>
							)}
						</div>
						<div class="bg-white rounded-b-lg flex">
							<div class="bg-transparent h-fit" style={{ width: `${canvas_width_px}px` }}>
								<div title="Plate Visualizer">
									<canvas
										ref={canvas_top}
										id={top_canvas_id}
										class={`${build_top_plate ? 'block' : 'hidden'}`}
										style={{
											width: `${canvas_width_px}px`,
											height: '100%',
										}}
									/>
									<canvas
										ref={canvas_bottom}
										id={bottom_canvas_id}
										class={`${build_bottom_plate ? 'block' : 'hidden'}`}
										style={{
											width: `${canvas_width_px}px`,
											height: '100%',
										}}
									/>
									{show_estimated_board_width && (
										<div class="text-center text-sm text-gray-500">
											Board width (estimated): {boardWidth_cm.value} cm
											{!is_build_valid.value && (
												<span class="text-red-500">
													{' '}
													(Error: build exceeds {CONSTRAINTS.maxPlateWidth} cm)
												</span>
											)}
										</div>
									)}
									{/* {output_concatenated_canvas_element_id && (
										<div class="mt-2 hidden">
											<canvas
												id={output_concatenated_canvas_element_id}
												style={{
													width: `${canvas_width_px}px`,
													height: '100%',
												}}
											/>
										</div>
									)} */}
								</div>
							</div>
							<div class="flex flex-col justify-around p-2">
								<div class={build_top_plate.value ? 'block' : 'hidden'}>
									<TextWithFontInput
										fontMenu={fontMenus}
										defaultText={defaultOptionsForNameTag.textTop}
										defaultFontId={defaultOptionsForNameTag.fontId}
										onChange$={(newText: string, newFontId: string, isValid: boolean) => {
											buildParams.text_top = newText;
											buildParams.font_id_top = newFontId;
											is_top_text_valid.value = isValid;
										}}
									/>
								</div>
								<div class={build_bottom_plate.value ? 'block' : 'hidden'}>
									<TextWithFontInput
										fontMenu={fontMenus}
										defaultText={defaultOptionsForNameTag.textBottom}
										defaultFontId={defaultOptionsForNameTag.fontId}
										onChange$={(newText: string, newFontId: string, isValid: boolean) => {
											buildParams.text_bottom = newText;
											buildParams.font_id_bottom = newFontId;
											is_bottom_text_valid.value = isValid;
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
);
