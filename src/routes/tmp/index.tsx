import { component$, useComputed$, useSignal } from '@qwik.dev/core';
import ColorSelector from '~/components/custom-option-visualizer/ColorSelector';
import FontSelector from '~/components/custom-option-visualizer/FontSelector';
import {
	filamentColorFindSupported,
	fontMenuFindAll,
} from '~/providers/shop/orders/customizable-order';

import { routeLoader$ } from '@qwik.dev/router';

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
	const font_top = useSignal<string>(defaultFontId);
	const font_bottom = useSignal<string>(defaultFontId);
	const primary_color_id = useSignal<string>(defaultPrimaryColorId);
	const base_color_id = useSignal<string>(defaultBaseColorId);

	const primary_color_hex = useComputed$(() => {
		const color = FilamentColorSignal.value.find((c) => c.id === primary_color_id.value);
		return color ? color.hexCode : '#FFFFFFFF';
	});
	const base_color_hex = useComputed$(() => {
		const color = FilamentColorSignal.value.find((c) => c.id === base_color_id.value);
		return color ? color.hexCode : '#884040FF';
	});

	return (
		<>
			<div>
				<div>
					<label> Top Plate Text </label>
					<input
						type="text"
						value={text_top.value}
						onInput$={(e: any) => (text_top.value = e.target.value)}
						placeholder="Top Plate Text"
						class="custom-input-text"
					/>

					<label> Bottom Plate Text </label>
					<input
						type="text"
						value={text_bottom.value}
						onInput$={(e: any) => (text_bottom.value = e.target.value)}
						placeholder="Bottom Plate Text"
						class="custom-input-text"
					/>

					<FontSelector
						fieldTitle="Top Plate font"
						fontMenu={FontMenuSignal.value}
						selectedValue={font_top}
					/>

					<FontSelector
						fieldTitle="Bottom Plate font"
						fontMenu={FontMenuSignal.value}
						selectedValue={font_bottom}
					/>

					<ColorSelector
						fieldTitle="Primary Color"
						colorOptions={FilamentColorSignal.value}
						selectedValue={primary_color_id}
					/>

					<ColorSelector
						fieldTitle="Base Color"
						colorOptions={FilamentColorSignal.value}
						selectedValue={base_color_id}
					/>
				</div>
				{/* <BuildPlateVisualizerV2
						text_top={text_top}
						text_bottom={text_bottom}
						font_top={font_top}
						font_bottom={font_bottom}
						primary_color_hex={
							colorsResource.value?.find((c) => c.name === primary_color_id.value)?.hexCode ?? '#FFFFFFFF'
						}
						base_color_hex={
							colorsResource.value?.find((c) => c.name === base_color_name.value)?.hexCode ?? '#884040FF'
						}
					/> */}
			</div>
			<div>
				<p>Selected Primary Color Hex: {primary_color_hex.value}</p>
				<p>Selected Base Color Hex: {base_color_hex.value}</p>
				<p>Top font Id: {font_top.value}</p>
				<p>Bottom font Id: {font_bottom.value}</p>
			</div>
		</>
	);
});
