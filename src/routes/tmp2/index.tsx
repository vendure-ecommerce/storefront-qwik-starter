import { component$, useContext, useSignal } from '@qwik.dev/core';
import BuildCustomNameTag from '~/components/custom-option-visualizer/BuildCustomNameTag';
import { DEFAULT_OPTIONS_FOR_NAME_TAG, useFilamentColor, useFontMenu } from '../tmp2/layout';

export default component$(() => {
	const FilamentColorSignal = useFilamentColor(); // Load the Filament_Color from db
	const FontMenuSignal = useFontMenu(); // Load the Font_Menu from db

	const defaultOptionsForNameTag = useContext(DEFAULT_OPTIONS_FOR_NAME_TAG);

	const text_top = useSignal<string>('Happy');
	const text_bottom = useSignal<string>('Day');
	const font_top_id = useSignal<string>(defaultOptionsForNameTag.fontId);
	const font_bottom_id = useSignal<string>(defaultOptionsForNameTag.fontId);
	const primary_color_id = useSignal<string>(defaultOptionsForNameTag.primaryColorId);
	const base_color_id = useSignal<string>(defaultOptionsForNameTag.baseColorId);
	const is_top_additive = useSignal<boolean>(true);
	const is_atc_allowed = useSignal<boolean>(true);
	const atc_disabled_reason = useSignal<string>('None');

	return (
		<>
			<BuildCustomNameTag
				FilamentColorSignal={FilamentColorSignal}
				FontMenuSignal={FontMenuSignal}
				primary_color_id={primary_color_id}
				is_atc_allowed={is_atc_allowed}
				atc_disabled_reason={atc_disabled_reason}
				base_color_id={base_color_id}
				canvas_width_px={250}
				text_top={text_top}
				text_bottom={text_bottom}
				font_top_id={font_top_id}
				font_bottom_id={font_bottom_id}
				is_top_additive={is_top_additive}
				build_top_plate={true}
				build_bottom_plate={true}
				show_estimated_board_width={true}
			/>
			<p>{is_atc_allowed.value ? 'Build is valid, ATC allowed' : atc_disabled_reason.value}</p>
		</>
	);
});
