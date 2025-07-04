import { component$, useSignal } from '@qwik.dev/core';
import ColorSelector from '~/components/custom-option-visualizer/ColorSelector';
import { BuildPlateVisualizer } from '~/components/custom-option-visualizer/CustomVisualizer';
import { FILAMENT_COLORS } from '~/components/custom-option-visualizer/data';
import FontSelector, {
	AdditiveFontOptions,
	SubtractiveFontOptions,
} from '~/components/custom-option-visualizer/FontSelector';

export default component$(() => {
	const text_top = useSignal<string>('Happy');
	const text_bottom = useSignal<string>('Day');
	const font_top = useSignal<string>('Comic_Neue__bold');
	const font_bottom = useSignal<string>('Comic_Neue__bold');
	const primary_color = useSignal<string>('latte_brown');
	const base_color = useSignal<string>('charcoal');

	// filter colors to only those that are supported and not disabled
	const availableColors = FILAMENT_COLORS.filter(
		(color) => color.is_supported && !color.is_disabled
	).map((color) => ({
		name: color.name,
		display_name: color.display_name,
		hex_code: color.hex_code,
	}));

	return (
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
					fontOptions={AdditiveFontOptions}
					selectedValue={font_top}
				/>

				<FontSelector
					fieldTitle="Bottom Plate font"
					fontOptions={SubtractiveFontOptions}
					selectedValue={font_bottom}
				/>

				<ColorSelector
					fieldTitle="Primary Color"
					colorOptions={availableColors}
					selectedValue={primary_color}
				/>

				<ColorSelector
					fieldTitle="Base Color"
					colorOptions={availableColors}
					selectedValue={base_color}
				/>
			</div>
			<BuildPlateVisualizer
				text_top={text_top}
				text_bottom={text_bottom}
				font_top={font_top}
				font_bottom={font_bottom}
				primary_color={primary_color}
				base_color={base_color}
			/>
		</div>
	);
});
