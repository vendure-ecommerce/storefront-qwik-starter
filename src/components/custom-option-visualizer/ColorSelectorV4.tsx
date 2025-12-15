import { component$, useSignal } from '@builder.io/qwik';
// import { FILAMENT_COLOR } from '~/routes/constants';
import { QRL } from '@builder.io/qwik';
import { LuBaseline, LuPaintBucket } from '@qwikest/icons/lucide';
import { FilamentColor } from '~/generated/graphql-shop';

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
		const selectedValue = useSignal<string>(defaultColorId || colorOptions[0].id);
		// throw an error if the selectedValue is not in the provided colorOptions
		if (!colorOptions.some((c) => c.id === selectedValue.value)) {
			throw new Error(
				`The default value "${selectedValue.value}" is not a valid filament color id!`
			);
		}

		return (
			<div class="custom-input-container px-2">
				<div class="dropdown">
					<button
						type="button"
						title={fieldTitle || 'Select Color'}
						aria-label={fieldTitle || 'Select Color'}
						class="btn btn-ghost btn-sm flex items-center gap-2"
					>
						{isBackgroundColor ? <LuPaintBucket class="w-5 h-5" /> : <LuBaseline class="w-5 h-5" />}
						{colorTag(colorOptions.find((c) => c.id === selectedValue.value)!.hexCode)}
					</button>
					<ul role="listbox" class="menu dropdown-content bg-base-100 rounded-box shadow-sm">
						{colorOptions.map((color) => (
							<li
								key={color.id}
								role="option"
								tabIndex={0}
								aria-selected={selectedValue.value === color.id}
								class={`
									flex items-center gap-2 px-2 py-1 hover:bg-primary/10 cursor-pointer 
									${selectedValue.value === color.id ? 'bg-primary/20' : ''}`}
								onClick$={() => {
									selectedValue.value = color.id;
									onChange$(color.id);
									(document.activeElement as HTMLElement | null)?.blur();
								}}
								onKeyDown$={(e: any) => {
									if (e.key === 'Enter' || e.key === ' ') {
										selectedValue.value = color.id;
										onChange$(color.id);
										(document.activeElement as HTMLElement | null)?.blur();
									}
								}}
								title={color.displayName}
							>
								{colorTag(color.hexCode)}
								{/* <span class="ml-2">{color.displayName}</span> */}
							</li>
						))}
					</ul>
				</div>
			</div>
		);
	}
);
