// Qwik select references: https://qwikui.com/docs/headless/select/
import { component$, Signal, useVisibleTask$ } from '@builder.io/qwik';

import { Select } from '@qwik-ui/headless';
import { useComputed$, useSignal } from '@qwik.dev/core';
import { FontMenuFindAllQuery } from '~/generated/graphql-shop';
import FontIcon from '../icons/FontIcon';
import GoPreviousIcon from '../icons/GoPreviousIcon';
import PencilEditIcon from '../icons/PencilEditIcon';
import { CONSTRAINTS } from './constants';
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

export function getFontInfoFromID(fontId: string): {
	fontFamily: string;
	fontWeight: string;
	fontStyle: string;
} {
	// fontId is in the format of "Crimson_Text__bold_italic"
	const fontWeight = fontId.split('__')[1]?.split('_')[0] || 'normal'; // e.g. 'bold' or 'semibold'
	const fontStyle = fontId.split('__')[1]?.split('_').length === 2 ? 'italic' : 'normal';
	const fontFamily = fontId.split('__')[0].replace(/_/g, ' '); // e.g. 'Crimson Text'
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

interface TextWithFontProps {
	fieldTitle?: string; // Optional title for the font selector
	fontMenu: FONT_MENU[];
	text: Signal<string>; // This is the text input value, e.g. `const textInput = useSignal<string>('Hello World');`
	fontId: Signal<string>; // This is the selected font value, which will be bound to the Select component, e.g. `const selectedFont = useSignal<string>('Comic_Neue__bold');`
	isTextValid: Signal<boolean>; // This is a signal to indicate if the text input is valid, e.g. `const isTextValid = useSignal<boolean>(true);`
}

function isValidText(text: string): {
	isValid: boolean;
	message: string;
} {
	// Add your validation logic here, e.g. check length, characters, etc.
	// not allowing trailing and leading spaces
	if (text.trim() !== text) {
		return { isValid: false, message: 'Text cannot have leading or trailing spaces.' };
	}
	if (text.length === 0) {
		return { isValid: false, message: 'Text is required.' };
	}
	if (text.length > CONSTRAINTS.maxTextLength) {
		return {
			isValid: false,
			message: `Text must be ${CONSTRAINTS.maxTextLength} characters or less.`,
		};
	}
	//test if characters are in CONSTRAINTS.validSpecialChars
	const regex = new RegExp(`^[${CONSTRAINTS.validSpecialChars}]+$`);
	if (!regex.test(text)) {
		return {
			isValid: false,
			message: 'Contains invalid characters.',
		};
	}

	return { isValid: true, message: '' };
}

export default component$(
	({ fieldTitle, fontMenu, text, fontId, isTextValid }: TextWithFontProps) => {
		// const fontId = useSignal<string>(fontOptions[0].value); // This has to be a string to match the Select component's value type (Select.item.value), e.g. 'Crimson_Text__bold_italic'
		const fontOptions = getFontOptions(fontMenu);
		const showInput = useSignal<boolean>(false);
		const invalidTextMessage = useSignal<string>('');
		const selectedFontInfo = useComputed$(() => {
			const raw_font_string = fontMenu.find((f) => f.id === fontId.value)?.additiveFontId;
			if (!raw_font_string) {
				throw new Error(`Font with id "${fontId.value}" not found in fontMenu!`);
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
			// Check if the text is valid on initial load
			({ isValid: isTextValid.value, message: invalidTextMessage.value } = isValidText(text.value));
		});

		return (
			<div>
				<div class="custom-input-container">
					{showInput.value ? (
						<>
							<button
								onClick$={() => (showInput.value = false)}
								class={`px-1 ${isTextValid.value ? '' : 'opacity-50 pointer-events-none'}`}
								title="Close Text Input"
							>
								<GoPreviousIcon />
							</button>
							<input
								type="text"
								value={text.value}
								onInput$={(e: any) => {
									if (isValidText(e.target.value).isValid) {
										isTextValid.value = true;
										text.value = e.target.value;
									} else {
										isTextValid.value = false;
										invalidTextMessage.value = isValidText(e.target.value).message;
									}
								}}
								style={{
									fontFamily: selectedFontInfo.value.fontFamily,
									fontWeight: selectedFontInfo.value.fontWeight,
									fontStyle: selectedFontInfo.value.fontStyle,
								}}
								class="custom-input-text"
							/>
						</>
					) : (
						<button title="Edit" onClick$={() => (showInput.value = true)}>
							<PencilEditIcon />
						</button>
					)}
					<div
						class={`px-1 flex item-center ${isTextValid.value ? '' : 'opacity-50 pointer-events-none'}`}
					>
						<Select.Root bind:value={fontId}>
							<Select.Trigger class="select-trigger-button" title="Select Font">
								<FontIcon />
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
											title={option.name} // Show full name on hover
										>
											{text.value}
										</Select.ItemLabel>
									</Select.Item>
								))}
							</Select.Popover>
						</Select.Root>
					</div>
				</div>
				{/* {!isTextValid.value && ( */}
				<div class={`text-red-500 text-xs px-8 h-1 ${!isTextValid.value ? '' : 'w-0 opacity-0'}`}>
					{invalidTextMessage.value || 'Invalid text input. Please correct it.'}
				</div>
				{/* )} */}
			</div>
		);
	}
);
