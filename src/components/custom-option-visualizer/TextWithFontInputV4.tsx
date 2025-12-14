// Qwik select references: https://qwikui.com/docs/headless/select/
import { component$, QRL, useComputed$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { LuType } from '@qwikest/icons/lucide';
import { FontMenu } from '~/generated/graphql-shop';
import { FONT_MENU } from '~/routes/constants';
import GoPreviousIcon from '../icons/GoPreviousIcon';
import PencilEditIcon from '../icons/PencilEditIcon';
import { CONSTRAINTS } from './constants';

/**
 
 FONT_MENU type should be as follows:
	id: string
	name: string // The name of the font, e.g. 'Comic Neue (Bold)'
	additiveFontId: string // The font ID for additive printing, e.g. 'Comic_Neue__bold'
	subtractiveFontId: string // The font ID for subtractive printing, e.g. 'Comic_Neue__bold'
	isDisabled: boolean
 */
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
	fontMenu: Pick<FontMenu, 'id' | 'name' | 'additiveFontId' | 'subtractiveFontId' | 'isDisabled'>[];
	defaultText: string;
	defaultFontId: string;
	onChange$: QRL<(text: string, fontId: string) => void>;
	onEligibilityChange$: QRL<(allowed: boolean) => void>;
}

function verifyText(text: string): {
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
	({
		fontMenu,
		defaultText,
		defaultFontId,
		onChange$,
		onEligibilityChange$,
	}: TextWithFontProps) => {
		const fontOptions = getFontOptions(fontMenu);
		const fontId = useSignal<string>(defaultFontId);
		const text = useSignal<string>(defaultText);
		const isTextValid = useSignal<boolean>(true);

		const showInput = useSignal<boolean>(false);
		// const showDropdown = useSignal<boolean>(false);
		const invalidTextMessage = useSignal<string>('');
		const selectedFontInfo = useComputed$(() => {
			const raw_font_string = fontMenu.find((f) => f.id === fontId.value)?.additiveFontId;
			if (!raw_font_string) {
				throw new Error(`Font with id "${fontId.value}" not found in fontMenu!`);
			}
			return getFontInfoFromID(raw_font_string);
		});

		useVisibleTask$(() => {
			// Check if the text is valid on initial load
			({ isValid: isTextValid.value, message: invalidTextMessage.value } = verifyText(text.value));
		});

		return (
			<div>
				<div class="flex items-center gap-2">
					{showInput.value ? (
						<>
							<button
								onClick$={() => (showInput.value = false)}
								class={`btn btn-ghost btn-sm px-1 ${isTextValid.value ? '' : 'opacity-50 pointer-events-none'}`}
								title="Close Text Input"
							>
								<GoPreviousIcon />
							</button>
							<input
								type="text"
								value={text.value}
								onInput$={(e: any) => {
									const verifyResult = verifyText(e.target.value);
									if (verifyResult.isValid) {
										isTextValid.value = true;
										text.value = e.target.value;
										onChange$(e.target.value, fontId.value);
										onEligibilityChange$(true);
									} else {
										onEligibilityChange$(false);
									}
									isTextValid.value = verifyResult.isValid;
									invalidTextMessage.value = verifyResult.message;
								}}
								style={{
									fontFamily: selectedFontInfo.value.fontFamily,
									fontWeight: selectedFontInfo.value.fontWeight,
									fontStyle: selectedFontInfo.value.fontStyle,
								}}
								class="input input-sm w-48"
							/>
						</>
					) : (
						<button
							class="btn btn-ghost btn-sm"
							title="Edit"
							onClick$={() => (showInput.value = true)}
						>
							<PencilEditIcon />
						</button>
					)}
					<div class="dropdown">
						<button
							type="button"
							aria-label="Select font"
							aria-disabled={!isTextValid.value}
							disabled={!isTextValid.value}
							class={`btn btn-ghost btn-sm ${!isTextValid.value ? 'opacity-50 pointer-events-none' : ''}`}
						>
							<LuType class="w-5 h-5 border" />
						</button>
						<ul
							tabIndex={-1}
							class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
						>
							{fontOptions.map((option) => (
								<li
									key={option.id}
									role="option"
									tabIndex={0}
									aria-selected={fontId.value === option.id}
									class={`px-2 py-1 hover:bg-primary/10 cursor-pointer ${fontId.value === option.id ? 'bg-primary/20' : ''}`}
									onClick$={() => {
										fontId.value = option.id;
										onChange$(text.value, option.id);
										(document.activeElement as HTMLElement | null)?.blur();
										// showDropdown.value = false;
									}}
									onKeyDown$={(e: any) => {
										if (e.key === 'Enter' || e.key === ' ') {
											fontId.value = option.id;
											onChange$(text.value, option.id);
											(document.activeElement as HTMLElement | null)?.blur();
											// showDropdown.value = false;
										}
									}}
								>
									<span
										style={{
											fontFamily: option.fontFamily,
											fontStyle: option.fontStyle,
											fontWeight: option.fontWeight,
										}}
									>
										{text.value}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div class={`text-error text-xs px-8 h-1 ${!isTextValid.value ? '' : 'hidden'}`}>
					{invalidTextMessage.value || 'Invalid text input. Please correct it.'}
				</div>
			</div>
		);
	}
);
