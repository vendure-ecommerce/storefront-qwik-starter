// Qwik select references: https://qwikui.com/docs/headless/select/
import { component$, useVisibleTask$ } from '@builder.io/qwik';

import { Select } from '@qwik-ui/headless';
import { useComputed$, useSignal } from '@qwik.dev/core';
import { FONT_MENU, FontMenuItem } from './data';

export const getGoogleFontLink = (): string => {
	const fontFamilies = FONT_MENU.map((font) => font.fm_name.split(' (')[0].replace(/ /g, '+')).join(
		'&family='
	); // join the font family with &family=
	return `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;
};

function getFontInfoFromID(font_id: string): {
	fontFamily: string;
	fontWeight: string;
	fontStyle: string;
} {
	// font_id is in the format of "Crimson_Text__bold_italic"
	const fontWeight = font_id.split('__')[1]?.split('_')[0] || 'normal';
	const fontStyle = font_id.split('__')[1]?.split('_').length === 2 ? 'italic' : 'normal';
	const fontFamily = font_id.split('__')[0].replace(/_/g, ' '); // e.g. 'Crimson Text'
	return { fontFamily, fontWeight, fontStyle };
}

interface FontOption {
	value: string; // The value of the font that will be submitted in the form
	label: string; // The display name of the font
	fontFamily: string; // e.g. 'Crimson Text'
	fontWeight: string; // e.g. 'bold', 'regular', 'semibold, 'normal', etc.
	fontStyle: string; // currently only 'italic' or 'normal'
	isDisabled?: boolean;
}

function getFontOptions(fontMenuItems: FontMenuItem[], isAdditive: boolean): FontOption[] {
	const font_id_key = isAdditive ? 'additive_font_id' : 'subtractive_font_id';

	return fontMenuItems.map((font) => {
		const font_id = font[font_id_key];

		if (!font_id) {
			console.error(`Font ID is missing for font: ${font.fm_name}`);
			return {
				value: '',
				label: font.fm_name,
				fontFamily: font.fm_name.split(' (')[0],
				fontWeight: 'normal',
				fontStyle: 'normal',
				isDisabled: true,
			};
		}

		return {
			value: font_id, // e.g. "Crimson_Text__bold_italic"
			label: font.fm_name, // e.g. 'Crimson Text (Italic)'
			isDisabled: font.is_disabled ? true : false,
			...getFontInfoFromID(font_id),
		};
	});
}

export const additiveFontOptions: FontOption[] = getFontOptions(FONT_MENU, true);
export const subtractiveFontOptions: FontOption[] = getFontOptions(FONT_MENU, false);

interface FontSelectorProps {
	fontOptions: FontOption[];
}

export default component$(({ fontOptions }: FontSelectorProps) => {
	const selectedValue = useSignal<string>(fontOptions[0].value); // This has to be a string to match the Select component's value type (Select.item.value)
	const selectedFontInfo = useComputed$(() => {
		return getFontInfoFromID(selectedValue.value);
	});
	useVisibleTask$(() => {
		const fontLink = getGoogleFontLink();
		const existingLink = document.querySelector(`link[href="${fontLink}"]`);

		if (!existingLink) {
			const linkElement = document.createElement('link');
			linkElement.rel = 'stylesheet';
			linkElement.href = fontLink;
			document.head.appendChild(linkElement);
		}
	});

	return (
		<Select.Root bind:value={selectedValue}>
			<Select.Label>Select Additive Font </Select.Label>
			<Select.Trigger class="select-trigger">
				<Select.DisplayValue
					placeholder="Select a font"
					style={{
						fontFamily: selectedFontInfo.value.fontFamily,
						fontWeight: selectedFontInfo.value.fontWeight,
						fontStyle: selectedFontInfo.value.fontStyle,
					}}
				/>
			</Select.Trigger>
			<Select.Popover class="select-popover">
				{fontOptions.map((option) => (
					<Select.Item key={option.value} value={option.value} disabled={option.isDisabled}>
						<Select.ItemLabel
							class="select-item-label"
							style={{
								fontFamily: option.fontFamily,
								fontWeight: option.fontWeight,
								fontStyle: option.fontStyle,
							}}
						>
							{option.label}
						</Select.ItemLabel>
					</Select.Item>
				))}
			</Select.Popover>
		</Select.Root>
	);
});
