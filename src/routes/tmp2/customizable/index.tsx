import { component$, useContext, useSignal, useStore } from '@qwik.dev/core';
import BuildCustomNameTagV4 from '~/components/custom-option-visualizer/BuildCustomNameTagV4';
import { NameTagBuildParams } from '~/components/custom-option-visualizer/CustomVisualizerV4';
import { DEFAULT_OPTIONS_FOR_NAME_TAG } from '~/routes/constants';
import { useFilamentColor, useFontMenu } from '~/routes/layout';

export default component$(() => {
	const FilamentColorSignal = useFilamentColor();
	const FontMenuSignal = useFontMenu();
	const defaultOptionsForNameTag = useContext(DEFAULT_OPTIONS_FOR_NAME_TAG);

	// User input signals
	const buildParams = useStore<NameTagBuildParams>({
		text_top: defaultOptionsForNameTag.textTop,
		text_bottom: defaultOptionsForNameTag.textBottom,
		font_id_top: defaultOptionsForNameTag.fontId,
		font_id_bottom: defaultOptionsForNameTag.fontId,
		primary_color_id: defaultOptionsForNameTag.primaryColorId,
		base_color_id: defaultOptionsForNameTag.baseColorId,
		is_top_additive: true,
	});

	// Validation signals (managed by BuildCustomNameTagV4)
	const is_atc_allowed = useSignal<boolean>(false);
	const atc_disabled_reason = useSignal<string>('None');

	return (
		<div class="p-8">
			<h1 class="text-2xl font-bold mb-4">BuildCustomNameTagV4 Demo</h1>

			<div class="mb-4">
				<p class="text-sm text-gray-600 mb-2">
					<strong>Validation Status:</strong> {is_atc_allowed.value ? '✅ Valid' : '❌ Invalid'}
				</p>
				<p class="text-sm text-gray-600">
					<strong>Reason:</strong> {atc_disabled_reason.value}
				</p>
			</div>

			<BuildCustomNameTagV4
				filamentColors={FilamentColorSignal.value}
				fontMenus={FontMenuSignal.value}
				buildParams={buildParams}
				is_atc_allowed={is_atc_allowed}
				atc_disabled_reason={atc_disabled_reason}
				build_top_plate={{ value: true }}
				build_bottom_plate={{ value: true }}
				canvas_width_px={250}
				show_estimated_board_width={true}
			/>
		</div>
	);
});
