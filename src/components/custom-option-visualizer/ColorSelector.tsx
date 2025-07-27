import { component$, Signal } from '@builder.io/qwik';
import { Select } from '@qwik-ui/headless';
import { FilamentColorFindSupportedQuery } from '~/generated/graphql-shop';

/**
 FILAMENT_COLOR type should be as follows:
	id: string;
	name: string;
	displayName: string;
	hexCode: string;
	isOutOfStock: boolean;
 */
export type FILAMENT_COLOR = FilamentColorFindSupportedQuery['filamentColorFindSupported'][number];

interface ColorSelectorProps {
	fieldTitle?: string; // The title of the field, e.g. "Filament Color"
	colorOptions: FILAMENT_COLOR[]; // The list of color options to display
	selectedValue: Signal<string>; // The currently selected color value (this should be a filament color name, e.g. 'lemon_yellow')
}

function getContrastColor(hex: string): string {
	// Calculate the contrast color for the given hex color
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	// Calculate the brightness of the color
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;
	// Return black for light colors and white for dark colors
	return brightness > 190 ? '#565656FF' : '#FFFFFF';
}

const colorTag = (color: FILAMENT_COLOR) => {
	return (
		<span
			class="color-tag"
			style={{
				backgroundColor: color.hexCode,
				border: color.hexCode === '#FFFFFF' ? '1px solid #000000' : 'none', // Add a border for white color to make it visible
				color: getContrastColor(color.hexCode), // Ensure text is readable against the background
			}}
		>
			{' '}
			{color.displayName}{' '}
		</span>
	);
};

export default component$(({ fieldTitle, colorOptions, selectedValue }: ColorSelectorProps) => {
	// const FilamentColorSignal = useFilamentColor();

	// throw an error if the selectedValue is not in the FilamentColorSignal.value
	if (!colorOptions.some((c) => c.id === selectedValue.value)) {
		throw new Error(`The default value "${selectedValue.value}" is not a valid filament color id!`);
	}

	return (
		<div>
			<Select.Root bind:value={selectedValue}>
				<Select.Label>{fieldTitle || 'Filament Color'}</Select.Label>
				<Select.Trigger class="select-trigger">
					<Select.DisplayValue placeholder="Select a color" />
				</Select.Trigger>
				<Select.Popover class="select-popover">
					{colorOptions.map((color) => (
						<Select.Item key={color.id} value={color.id} disabled={false}>
							<Select.ItemLabel class="select-item-label">{colorTag(color)}</Select.ItemLabel>
						</Select.Item>
					))}
				</Select.Popover>
			</Select.Root>
		</div>
	);
});
