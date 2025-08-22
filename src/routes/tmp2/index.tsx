import { component$, useSignal } from '@qwik.dev/core';
import { routeLoader$ } from '@qwik.dev/router';
import BuildCustomNameTag from '~/components/custom-option-visualizer/BuildCustomNameTag';
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
	const is_atc_allowed = useSignal<boolean>(true);

	return (
		<>
			<BuildCustomNameTag
				FilamentColorSignal={FilamentColorSignal}
				FontMenuSignal={FontMenuSignal}
				primary_color_id={primary_color_id}
				is_atc_allowed={is_atc_allowed}
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
		</>
	);
});
