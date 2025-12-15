import {
	component$,
	QRL,
	useComputed$,
	useSignal,
	useStore,
	useVisibleTask$,
} from '@builder.io/qwik';
import ColorSelector from '~/components/custom-option-visualizer/ColorSelectorV4';
import TextWithFontInput from '~/components/custom-option-visualizer/TextWithFontInputV4';
import DarkModeIcon from '~/components/icons/DarkModeIcon';
import { FilamentColor, FontMenu } from '~/generated/graphql-shop';
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
	// buildParams: NameTagBuildParams;
	onAtcEligibility$: QRL<(allowed: boolean, disabled_reason: string) => void>;
	build_plates: { top: boolean; bottom: boolean }; // Whether to build the top plate
	canvas_width_px?: number; // Width of the canvas in pixels
	onChange$: QRL<(buildParams: NameTagBuildParams) => void>;
}

export default component$(
	({
		filamentColors,
		fontMenus,
		onAtcEligibility$,
		canvas_width_px = 250,
		build_plates,
		onChange$,
	}: BuildCustomNameTagProps) => {
		const top_canvas_id = 'canvas_top';
		const bottom_canvas_id = 'canvas_bottom';

		// const defaultOptionsForNameTag = useContext(DEFAULT_OPTIONS_FOR_NAME_TAG);
		const defaultOptionsForNameTag = {
			primaryColorId: filamentColors[0].id,
			baseColorId: filamentColors[1].id,
			isTopAdditive: true,
			textTop: 'Hello',
			textBottom: 'World',
			fontIdTop: fontMenus[0].id,
			fontIdBottom: fontMenus[0].id,
		};

		const buildParams = useStore<NameTagBuildParams>({
			text_top: defaultOptionsForNameTag.textTop,
			text_bottom: defaultOptionsForNameTag.textBottom,
			font_id_top: defaultOptionsForNameTag.fontIdTop,
			font_id_bottom: defaultOptionsForNameTag.fontIdBottom,
			primary_color_id: defaultOptionsForNameTag.primaryColorId,
			base_color_id: defaultOptionsForNameTag.baseColorId,
			is_top_additive: defaultOptionsForNameTag.isTopAdditive,
		});
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
				build_plates.top,
				build_plates.bottom,
			]);
			if (canvas_top.value && canvas_bottom.value) {
				const buildResult = BuildPlateVisualizerV4({
					font_menu: fontMenus,
					filament_color: filamentColors,
					buildParams: buildParams,
					build_top_plate: build_plates.top,
					build_bottom_plate: build_plates.bottom,
					canvas_top: canvas_top.value,
					canvas_bottom: canvas_bottom.value,
				});
				boardWidth_cm.value = buildResult.boardWidth_cm;
				is_build_valid.value = buildResult.valid;
				onChange$(buildParams);
			}
		});

		// Determine if Add to Cart is allowed - only update on client side
		useVisibleTask$(({ track }) => {
			track(() => [
				is_primary_and_base_color_different.value,
				build_plates.top,
				build_plates.bottom,
				is_top_text_valid.value,
				is_bottom_text_valid.value,
				is_build_valid.value,
			]);

			if (!is_primary_and_base_color_different.value) {
				onAtcEligibility$(false, 'Primary color and base color cannot be the same.');
				return;
			}
			if (
				(build_plates.top && !is_top_text_valid.value) ||
				(build_plates.bottom && !is_bottom_text_valid.value)
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
				<div class="bg-base-100 w-fit">
					<div
						class={`border-2 rounded-lg h-auto p-0 w-fit`}
						// style={{ width: `${canvas_width_px}px` }}
					>
						<div class="flex bg-base-300 p-2 rounded-t-lg">
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
							{build_plates.top && (
								<button
									title="Change Top Plate style"
									class="btn btn-ghost btn-sm ml-2"
									onClick$={() => {
										buildParams.is_top_additive = !buildParams.is_top_additive;
									}}
								>
									<DarkModeIcon />
								</button>
							)}
						</div>
						<div class="rounded-b-lg flex">
							<BuildCanvases
								topCanvasInfo={{
									canvasRef: canvas_top,
									id: top_canvas_id,
									skip: !build_plates.top,
								}}
								bottomCanvasInfo={{
									canvasRef: canvas_bottom,
									id: bottom_canvas_id,
									skip: !build_plates.bottom,
								}}
								canvas_width_px={canvas_width_px}
							>
								<div class="text text-center text-sm">
									Board width (estimated): {boardWidth_cm.value} cm
									{!is_build_valid.value && (
										<div role="alert" class="alert alert-error alert-soft text-sm">
											(Error: build exceeds {CONSTRAINTS.maxPlateWidth} cm)
										</div>
									)}
								</div>
							</BuildCanvases>
							<div class="flex flex-col justify-around p-2">
								<div class={build_plates.top ? 'block' : 'hidden'}>
									<TextWithFontInput
										fontMenu={fontMenus}
										defaultText={defaultOptionsForNameTag.textTop}
										defaultFontId={defaultOptionsForNameTag.fontIdTop}
										onChange$={(newText: string, newFontId: string) => {
											buildParams.text_top = newText;
											buildParams.font_id_top = newFontId;
										}}
										onEligibilityChange$={(allowed: boolean) => {
											is_top_text_valid.value = allowed;
										}}
									/>
								</div>
								<div class={build_plates.bottom ? 'block' : 'hidden'}>
									<TextWithFontInput
										fontMenu={fontMenus}
										defaultText={defaultOptionsForNameTag.textBottom}
										defaultFontId={defaultOptionsForNameTag.fontIdBottom}
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
