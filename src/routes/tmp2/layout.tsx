import {
	component$,
	createContextId,
	Slot,
	useContextProvider,
	useStore,
	useVisibleTask$,
} from '@qwik.dev/core';
import { routeLoader$ } from '@qwik.dev/router';

import {
	filamentColorFindSupported,
	fontMenuFindAll,
} from '~/providers/shop/orders/customizable-order';

const DEFAULT_PRIMARY_COLOR_NAME = 'latte_brown';
const DEFAULT_BASE_COLOR_NAME = 'ivory_white';
const DEFAULT_FONT_NAME = 'Comic Neue';

const getGoogleFontLink = (fontMenuItems: FONT_MENU[]): string => {
	const fontFamilies = fontMenuItems
		.map((font) => font.name.split(' (')[0].replace(/ /g, '+'))
		.join('&family='); // join the font family with &family=
	return `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;
};

export const useFilamentColor = routeLoader$(async () => {
	return await filamentColorFindSupported();
});

export const useFontMenu = routeLoader$(async () => {
	return await fontMenuFindAll();
});

interface DefaultOptionsForNameTag {
	primaryColorId: string;
	baseColorId: string;
	fontId: string;
	textTop: string;
	textBottom: string;
}

// Create a context to hold the default options for the name tag, that can be accessed in child components
export const DEFAULT_OPTIONS_FOR_NAME_TAG = createContextId<DefaultOptionsForNameTag>(
	'default_options_for_name_tag' // A unique string to identify the context
);

export default component$(() => {
	const FilamentColorSignal = useFilamentColor(); // Load the Filament_Color from db

	const FontMenuSignal = useFontMenu(); // Load the Font_Menu from db

	const defaultPrimaryColorId = FilamentColorSignal.value.find(
		(c) => c.name === DEFAULT_PRIMARY_COLOR_NAME
	)?.id;
	const defaultBaseColorId = FilamentColorSignal.value.find(
		(c) => c.name === DEFAULT_BASE_COLOR_NAME
	)?.id;
	if (!defaultPrimaryColorId || !defaultBaseColorId) {
		throw new Error('Default colors not found in FilamentColorSignal!');
	}
	const defaultFontId = FontMenuSignal.value.find((f) => f.name === DEFAULT_FONT_NAME)?.id;
	if (!defaultFontId) {
		throw new Error('Default fonts not found in FontMenuSignal!');
	}

	const defaultOptionsForNameTag = useStore<DefaultOptionsForNameTag>({
		primaryColorId: defaultPrimaryColorId,
		baseColorId: defaultBaseColorId,
		fontId: defaultFontId,
		textTop: 'Happy',
		textBottom: 'Day',
	});

	useContextProvider(DEFAULT_OPTIONS_FOR_NAME_TAG, defaultOptionsForNameTag);

	useVisibleTask$(() => {
		const fontLink = getGoogleFontLink(FontMenuSignal.value);
		const existingLink = document.querySelector(`link[href="${fontLink}"]`);

		if (!existingLink) {
			const linkElement = document.createElement('link');
			linkElement.rel = 'stylesheet';
			linkElement.href = fontLink;
			document.head.appendChild(linkElement);
		}
	});
	return (
		<>
			<Slot />
		</>
	);
});
