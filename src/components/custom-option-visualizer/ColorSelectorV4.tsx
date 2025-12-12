import { component$, useSignal } from '@builder.io/qwik';
import { Select } from '@qwik-ui/headless';
// import { FILAMENT_COLOR } from '~/routes/constants';
import { QRL } from '@builder.io/qwik';
import { FilamentColor } from '~/generated/graphql-shop';
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
	colorOptions: Pick<FilamentColor, 'id' | 'name' | 'displayName' | 'hexCode' | 'isOutOfStock'>[]; // The list of color options to display
	defaultColorId?: string; // The default selected color value (this should be a filament color id, e.g. 'lemon_yellow')
	isBackgroundColor?: boolean; // Optional: if true, we will use background color icon, if false, we will use text color icon
	onChange$: QRL<(newColorId: string) => void>; // Callback when the selected color changes
}

const colorTag = (hexCode: string) => {
	return (
		<span
			class="rounded-full inline-block h-4 w-4 px-0"
			style={{
				backgroundColor: hexCode,
				border: hexCode === '#FFFFFF' ? '1px solid #000000' : 'none', // Add a border for white color to make it visible
			}}
		></span>
	);
};

export default component$(
	({
		fieldTitle,
		colorOptions,
		defaultColorId,
		isBackgroundColor,
		onChange$,
	}: ColorSelectorProps) => {
		// const FilamentColorSignal = useFilamentColor();
		const selectedValue = useSignal<string>(defaultColorId || colorOptions[0].id);
		// throw an error if the selectedValue is not in the FilamentColorSignal.value
		if (!colorOptions.some((c) => c.id === selectedValue.value)) {
			throw new Error(
				`The default value "${selectedValue.value}" is not a valid filament color id!`
			);
		}

		return (
			<div class="custom-input-container px-2">
				<Select.Root
					bind:value={selectedValue}
					onChange$={(newColorId: string) => {
						onChange$(newColorId);
					}}
				>
					<Select.Trigger class="select-trigger-button flex" title={fieldTitle || 'Select Color'}>
						{isBackgroundColor ? <BackgroundColorIcon /> : <TextColorIcon />}
						{colorTag(colorOptions.find((c) => c.id === selectedValue.value)!.hexCode)}
					</Select.Trigger>
					<Select.Popover class="select-color-popover">
						{colorOptions.map((color) => (
							<Select.Item key={color.id} value={color.id} disabled={false}>
								<Select.ItemLabel class="select-item-label" title={color.displayName}>
									{colorTag(color.hexCode)}
								</Select.ItemLabel>
							</Select.Item>
						))}
					</Select.Popover>
				</Select.Root>
			</div>
		);
	}
);
