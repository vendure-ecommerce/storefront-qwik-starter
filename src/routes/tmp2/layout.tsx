import { component$, Slot, useVisibleTask$ } from '@qwik.dev/core';
import { routeLoader$ } from '@qwik.dev/router';
import { getGoogleFontLink } from '~/components/custom-option-visualizer/TextWithFontInput';
import {
	filamentColorFindSupported,
	fontMenuFindAll,
} from '~/providers/shop/orders/customizable-order';

export const useFilamentColor = routeLoader$(async () => {
	return await filamentColorFindSupported();
});

export const useFontMenu = routeLoader$(async () => {
	return await fontMenuFindAll();
});

export default component$(() => {
	const FontMenuSignal = useFontMenu(); // Load the Font_Menu from db

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
