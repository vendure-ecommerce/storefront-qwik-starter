import {
	component$,
	QRL,
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
import BuildCanvases from './BuildCanvases';
import { CONSTRAINTS } from './constants';
import { BuildPlateVisualizerV4, NameTagBuildParams } from './CustomVisualizerV4';

type PartialFilamentColor = Pick<
	FilamentColor,
	'id' | 'name' | 'displayName' | 'hexCode' | 'isOutOfStock'
>;
type PartialFontMenu = Pick<
	FontMenu,
	'id' | 'name' | 'additiveFontId' | 'subtractiveFontId' | 'isDisabled'
>;

interface BuildCustomNameTagProps {
	filamentColors: PartialFilamentColor[]; // using useFilamentColor() for this (can only be used inside of routes folder)
	fontMenus: PartialFontMenu[]; // using useFontMenu() for this (can only be used inside of routes folder)
	buildParams: NameTagBuildParams;
	onAtcEligibility$: QRL<(allowed: boolean, disabled_reason: string) => void>;
	build_top_plate: boolean; // Whether to build the top plate
	build_bottom_plate: boolean; // Whether to build the bottom plate
	canvas_width_px?: number; // Width of the canvas in pixels
}

export default component$(
	({
		filamentColors,
		fontMenus,
		buildParams,
		onAtcEligibility$,
		canvas_width_px = 250,
		build_top_plate,
		build_bottom_plate,
	}: BuildCustomNameTagProps) => {
		const top_canvas_id = 'canvas_top';
		const bottom_canvas_id = 'canvas_bottom';

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

		useVisibleTask$(() => {
			canvas_top.value = document.getElementById(top_canvas_id) as HTMLCanvasElement;
			canvas_bottom.value = document.getElementById(bottom_canvas_id) as HTMLCanvasElement;
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
				build_top_plate,
				build_bottom_plate,
			]);
			if (canvas_top.value && canvas_bottom.value) {
				const buildResult = BuildPlateVisualizerV4({
					font_menu: fontMenus,
					filament_color: filamentColors,
					buildParams: buildParams,
					build_top_plate: build_top_plate,
					build_bottom_plate: build_bottom_plate,
					canvas_top: canvas_top.value,
					canvas_bottom: canvas_bottom.value,
				});
				boardWidth_cm.value = buildResult.boardWidth_cm;
				is_build_valid.value = buildResult.valid;
			}
		});

		// Determine if Add to Cart is allowed - only update on client side
		useVisibleTask$(({ track }) => {
			track(() => [
				is_primary_and_base_color_different.value,
				build_top_plate,
				build_bottom_plate,
				is_top_text_valid.value,
				is_bottom_text_valid.value,
				is_build_valid.value,
			]);

			if (!is_primary_and_base_color_different.value) {
				onAtcEligibility$(false, 'Primary color and base color cannot be the same.');
				return;
			}
			if (
				(build_top_plate && !is_top_text_valid.value) ||
				(build_bottom_plate && !is_bottom_text_valid.value)
			) {
				onAtcEligibility$(false, 'Text is required');
				return;
			}
			if (!is_build_valid.value) {
				onAtcEligibility$(false, 'The build is invalid.');
				return;
			}

			onAtcEligibility$(true, '');
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
							{build_top_plate && (
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
							<BuildCanvases
								topCanvasInfo={{
									canvasRef: canvas_top,
									id: top_canvas_id,
									hidden: !build_top_plate,
								}}
								bottomCanvasInfo={{
									canvasRef: canvas_bottom,
									id: bottom_canvas_id,
									hidden: !build_bottom_plate,
								}}
								canvas_width_px={canvas_width_px}
							>
								<div class="text-center text-sm text-gray-500">
									Board width (estimated): {boardWidth_cm.value} cm
									{!is_build_valid.value && (
										<span class="text-red-500">
											{' '}
											(Error: build exceeds {CONSTRAINTS.maxPlateWidth} cm)
										</span>
									)}
								</div>
							</BuildCanvases>
							<div class="flex flex-col justify-around p-2">
								<div class={build_top_plate ? 'block' : 'hidden'}>
									<TextWithFontInput
										fontMenu={fontMenus}
										defaultText={defaultOptionsForNameTag.textTop}
										defaultFontId={defaultOptionsForNameTag.fontId}
										onChange$={(newText: string, newFontId: string) => {
											buildParams.text_top = newText;
											buildParams.font_id_top = newFontId;
										}}
										onEligibilityChange$={(allowed: boolean) => {
											is_top_text_valid.value = allowed;
										}}
									/>
								</div>
								<div class={build_bottom_plate ? 'block' : 'hidden'}>
									<TextWithFontInput
										fontMenu={fontMenus}
										defaultText={defaultOptionsForNameTag.textBottom}
										defaultFontId={defaultOptionsForNameTag.fontId}
										onChange$={(newText: string, newFontId: string) => {
											buildParams.text_bottom = newText;
											buildParams.font_id_bottom = newFontId;
										}}
										onEligibilityChange$={(allowed: boolean) => {
											is_bottom_text_valid.value = allowed;
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
