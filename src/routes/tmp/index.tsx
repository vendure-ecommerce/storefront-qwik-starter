import { component$, useSignal } from '@qwik.dev/core';
import ColorSelector from '~/components/custom-option-visualizer/ColorSelector';
import { FILAMENT_COLORS } from '~/components/custom-option-visualizer/data';
import FontSelector, {
	AdditiveFontOptions,
} from '~/components/custom-option-visualizer/FontSelector';

export default component$(() => {
	const selectedFont = useSignal<string>('Comic_Neue__bold');
	const selectedColor = useSignal<string>('latte_brown');

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
				<FontSelector
					fontOptions={AdditiveFontOptions}
					selectedValue={selectedFont}
					fieldTitle="top side font"
				/>
			</div>

			<div>
				<h1>Selected Font: {selectedFont.value}</h1>
			</div>

			<div>
				<ColorSelector
					fieldTitle="Top Color"
					colorOptions={availableColors}
					selectedValue={selectedColor}
				/>
			</div>
		</div>
	);
});
