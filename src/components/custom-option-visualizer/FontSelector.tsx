// Qwik select references: https://qwikui.com/docs/headless/select/
import { component$, Signal, useVisibleTask$ } from '@builder.io/qwik';

import { Select } from '@qwik-ui/headless';
import { useComputed$ } from '@qwik.dev/core';
import { FontMenuFindAllQuery } from '~/generated/graphql-shop';

// import { FONT_MENU, FontMenuItem } from './data';
/**
 
 FONT_MENU type should be as follows:
	id: string
	name: string // The name of the font, e.g. 'Comic Neue (Bold)'
	additiveFontId: string // The font ID for additive printing, e.g. 'Comic_Neue__bold'
	subtractiveFontId: string // The font ID for subtractive printing, e.g. 'Comic_Neue__bold'
	isDisabled: boolean
 */
export type FONT_MENU = FontMenuFindAllQuery['fontMenuFindAll'][number];

export const getGoogleFontLink = (fontMenuItems: FONT_MENU[]): string => {
	const fontFamilies = fontMenuItems
		.map((font) => font.name.split(' (')[0].replace(/ /g, '+'))
		.join('&family='); // join the font family with &family=
	return `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;
};

export function getFontInfoFromID(font_id: string): {
	fontFamily: string;
	fontWeight: string;
	fontStyle: string;
} {
	// font_id is in the format of "Crimson_Text__bold_italic"
	const fontWeight = font_id.split('__')[1]?.split('_')[0] || 'normal'; // e.g. 'bold' or 'semibold'
	const fontStyle = font_id.split('__')[1]?.split('_').length === 2 ? 'italic' : 'normal';
	const fontFamily = font_id.split('__')[0].replace(/_/g, ' '); // e.g. 'Crimson Text'
	return { fontFamily, fontWeight, fontStyle };
}

interface FontOption {
	id: string; // e.g. "Crimson_Text__bold_italic"
	name: string; // e.g. 'Crimson Text (Italic)'
	isDisabled: boolean; // e.g. false
	fontFamily: string; // e.g. 'Crimson Text'
	fontWeight: string; // e.g. 'bold'
	fontStyle: string; // e.g. 'italic'
}

function getFontOptions(fontMenuItems: FONT_MENU[]): FontOption[] {
	return fontMenuItems.map((font) => {
		const raw_font_string = font.additiveFontId;

		return {
			id: font.id, // e.g. "Crimson_Text__bold_italic"
			name: font.name, // e.g. 'Crimson Text (Italic)'
			isDisabled: font.isDisabled,
			...getFontInfoFromID(raw_font_string),
		};
	});
}

interface FontSelectorProps {
	fieldTitle?: string; // Optional title for the font selector
	fontMenu: FONT_MENU[];
	selectedValue: Signal<string>; // This is the selected font value, which will be bound to the Select component, e.g. `const selectedFont = useSignal<string>('Comic_Neue__bold');`
}

export default component$(({ fieldTitle, fontMenu, selectedValue }: FontSelectorProps) => {
	// const selectedValue = useSignal<string>(fontOptions[0].value); // This has to be a string to match the Select component's value type (Select.item.value), e.g. 'Crimson_Text__bold_italic'
	const fontOptions = getFontOptions(fontMenu);
	const selectedFontInfo = useComputed$(() => {
		const raw_font_string = fontMenu.find((f) => f.id === selectedValue.value)?.additiveFontId;
		if (!raw_font_string) {
			throw new Error(`Font with id "${selectedValue.value}" not found in fontMenu!`);
		}
		return getFontInfoFromID(raw_font_string);
	});
	useVisibleTask$(() => {
		const fontLink = getGoogleFontLink(fontMenu);
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
			<Select.Label>{fieldTitle || 'Select Font'}</Select.Label>
			<Select.Trigger class="select-trigger">
				<Select.DisplayValue
					placeholder="Select a font"
					style={{
						fontFamily: selectedFontInfo.value.fontFamily,
						fontWeight: 'normal',
						fontStyle: selectedFontInfo.value.fontStyle,
					}}
				/>
			</Select.Trigger>
			<Select.Popover class="select-popover">
				{fontOptions.map((option) => (
					<Select.Item key={option.id} value={option.id} disabled={option.isDisabled}>
						<Select.ItemLabel
							class="select-item-label"
							style={{
								fontFamily: option.fontFamily,
								fontWeight: 'normal',
								fontStyle: option.fontStyle,
							}}
						>
							{option.name}
						</Select.ItemLabel>
					</Select.Item>
				))}
			</Select.Popover>
		</Select.Root>
	);
});
