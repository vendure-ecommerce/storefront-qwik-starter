import { component$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { CUSTOMIZABLE_CLASS_DEF_TAG, EXTRA_DATA } from '~/routes/constants';
import { CustomizableClassName } from '~/utils';
import { genHash, getCustomizableOption } from '~/utils/customizable-order';
import BuildCanvases from '../BuildCanvases';
import { CustomVisualizer, NameTagBuildParams } from '../CustomVisualizerV4';

interface CustomNameTagCartDisplayProps {
	customizableOptionJson: string;
	concatenate_canvas_element_id?: string;
}

export default component$(
	({ customizableOptionJson, concatenate_canvas_element_id }: CustomNameTagCartDisplayProps) => {
		const { filamentColors, fontMenus } = useContext(EXTRA_DATA);

		const customizableClassDef = useContext(CUSTOMIZABLE_CLASS_DEF_TAG);
		const classDef =
			customizableClassDef.find((def) => def.name === CustomizableClassName.CustomNameTag)
				?.optionDefinition ?? [];

		const customNameTag = getCustomizableOption(
			JSON.parse(customizableOptionJson),
			classDef
		) as NameTagBuildParams;

		const uniqueId = concatenate_canvas_element_id || genHash(customizableOptionJson);
		const top_canvas_id = `top-${uniqueId}`;
		const bottom_canvas_id = `btm-${uniqueId}`;

		const errorMessage = useSignal<string>('');
		const is_build_valid = useSignal<boolean>(true);

		const canvas_top = useSignal<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);
		const canvas_bottom = useSignal<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);
		const canvas_concatenated = useSignal<HTMLCanvasElement>(null as unknown as HTMLCanvasElement);

		// Parse customizable options

		const build_top_plate = !!customNameTag.textTop;
		const build_bottom_plate = !!customNameTag.textBottom;

		// Get canvas elements
		useVisibleTask$(() => {
			canvas_top.value = document.getElementById(top_canvas_id) as HTMLCanvasElement;
			canvas_bottom.value = document.getElementById(bottom_canvas_id) as HTMLCanvasElement;

			const buildResult = CustomVisualizer({
				fontMenus: fontMenus,
				filamentColors: filamentColors,
				buildParams: customNameTag,
				build_top_plate: build_top_plate,
				build_bottom_plate: build_bottom_plate,
				canvas_top: canvas_top.value,
				canvas_bottom: canvas_bottom.value,
				canvas_stacked: canvas_concatenated.value,
			});
			is_build_valid.value = buildResult.valid;
			errorMessage.value = is_build_valid.value ? '' : 'The build is invalid.';
		});

		return (
			<>
				<BuildCanvases
					topCanvasInfo={{
						canvasRef: canvas_top,
						id: top_canvas_id,
						skip: !build_top_plate,
					}}
					bottomCanvasInfo={{
						canvasRef: canvas_bottom,
						id: bottom_canvas_id,
						skip: !build_bottom_plate,
					}}
					concatenate_canvas_element_id={uniqueId}
					canvas_width_px={100}
				/>
				{errorMessage.value && <p class="mt-2 text-sm text-error">{errorMessage.value}</p>}
			</>
		);
	}
);
