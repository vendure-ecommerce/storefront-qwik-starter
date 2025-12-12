import { $, component$, useContext, useSignal, useStore } from '@builder.io/qwik';
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
	const atcEligibility = useSignal<{ allowed: boolean; reason: string }>({
		allowed: false,
		reason: '',
	});
	const buildPlates = useStore<{ top: boolean; bottom: boolean }>({ top: true, bottom: true });

	return (
		<div class="p-8">
			<h1 class="text-2xl font-bold mb-4">BuildCustomNameTagV4 Demo</h1>

			<div class="mb-4">
				<p class="text-sm text-gray-600 mb-2">
					<strong>Validation Status:</strong>{' '}
					{atcEligibility.value.allowed ? '✅ Valid' : '❌ Invalid'}
				</p>
				<p class="text-sm text-gray-600">
					<strong>Reason:</strong> {atcEligibility.value.reason}
				</p>
			</div>

			<BuildCustomNameTagV4
				filamentColors={FilamentColorSignal.value}
				fontMenus={FontMenuSignal.value}
				buildParams={buildParams}
				onAtcEligibility$={$((allowed: boolean, disabled_reason: string) => {
					atcEligibility.value = { allowed, reason: disabled_reason };
				})}
				build_top_plate={buildPlates.top}
				build_bottom_plate={buildPlates.bottom}
				canvas_width_px={250}
			/>
		</div>
	);
});
