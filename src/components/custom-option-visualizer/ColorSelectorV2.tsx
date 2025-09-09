import { component$, Signal } from '@builder.io/qwik';
import { Select } from '@qwik-ui/headless';
import { FILAMENT_COLOR } from '~/routes/constants';
import BackgroundColorIcon from '../icons/BackgroundColorIcon';
import TextColorIcon from '../icons/TextColorIcon';

/**
 FILAMENT_COLOR type should be as follows:
	id: string;
	name: string;
	displayName: string;
	hexCode: string;
	isOutOfStock: boolean;
 */

interface ColorSelectorProps {
	fieldTitle?: string; // The title of the field, e.g. "Filament Color"
	colorOptions: FILAMENT_COLOR[]; // The list of color options to display
	selectedValue: Signal<string>; // The currently selected color value (this should be a filament color name, e.g. 'lemon_yellow')
	isBackgroundColor?: boolean; // Optional: if true, we will use background color icon, if false, we will use text color icon
}

const colorTag = (color: FILAMENT_COLOR) => {
	return (
		<span
			class="rounded-full inline-block h-4 w-4 px-0"
			style={{
				backgroundColor: color.hexCode,
				border: color.hexCode === '#FFFFFF' ? '1px solid #000000' : 'none', // Add a border for white color to make it visible
			}}
		></span>
	);
};

export default component$(
	({ fieldTitle, colorOptions, selectedValue, isBackgroundColor }: ColorSelectorProps) => {
		// const FilamentColorSignal = useFilamentColor();

		// throw an error if the selectedValue is not in the FilamentColorSignal.value
		if (!colorOptions.some((c) => c.id === selectedValue.value)) {
			throw new Error(
				`The default value "${selectedValue.value}" is not a valid filament color id!`
			);
		}

		return (
			<div class="custom-input-container px-2">
				<Select.Root bind:value={selectedValue}>
					<Select.Trigger class="select-trigger-button flex" title={fieldTitle || 'Select Color'}>
						{isBackgroundColor ? <BackgroundColorIcon /> : <TextColorIcon />}
						{colorTag(colorOptions.find((c) => c.id === selectedValue.value)!)}
					</Select.Trigger>
					<Select.Popover class="select-color-popover">
						{colorOptions.map((color) => (
							<Select.Item key={color.id} value={color.id} disabled={false}>
								<Select.ItemLabel class="select-item-label" title={color.displayName}>
									{colorTag(color)}
								</Select.ItemLabel>
							</Select.Item>
						))}
					</Select.Popover>
				</Select.Root>
			</div>
		);
	}
);
