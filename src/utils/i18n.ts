/**
 * From https://github.com/mhevery/qwik-i18n/blob/main/src/i18n.ts
 */
import { loadTranslations } from '@angular/localize';
import '@angular/localize/init';
import { getLocale, withLocale } from '@builder.io/qwik';
import type { RenderOptions } from '@builder.io/qwik/server';
import { DEFAULT_LOCALE } from '~/constants';
import DE from '../locales/message.de.json';
import EN from '../locales/message.en.json';
import ES from '../locales/message.es.json';
import FR from '../locales/message.fr.json';
import IT from '../locales/message.it.json';
/**
 * This file is left for the developer to customize to get the behavior they want for localization.
 */

// Declare location where extra types will be stored.
const $localizeFn = $localize as any as {
	TRANSLATIONS: Record<string, any>;
	TRANSLATION_BY_LOCALE: Map<string, Record<string, any>>;
};

/**
 * This solution uses the `@angular/localize` package for translations, however out of the box
 * `$localize` works with a single translation only. This code adds support for multiple locales
 * concurrently. It does this by intercepting the `TRANSLATIONS` property read and returning
 * appropriate translation based on the current locale which is store in the `usEnvDate('local')`.
 */
if (!$localizeFn.TRANSLATION_BY_LOCALE) {
	$localizeFn.TRANSLATION_BY_LOCALE = new Map([['', {}]]);
	Object.defineProperty($localize, 'TRANSLATIONS', {
		get: function () {
			const locale = getLocale(DEFAULT_LOCALE);
			let translations = $localizeFn.TRANSLATION_BY_LOCALE.get(locale);
			if (!translations) {
				$localizeFn.TRANSLATION_BY_LOCALE.set(locale, (translations = {}));
			}
			return translations;
		},
	});
}

/**
 * Function used to load all translations variants.
 */
export function initTranslations() {
	console.log('Loading translations...');
	[EN, ES, DE, FR, IT].forEach(({ translations, locale }) => {
		withLocale(locale, () => loadTranslations(translations));
	});
}

/**
 * Function used to examine the request and determine the locale to use.
 *
 * This function is meant to be used with `RenderOptions.locale` property
 *
 * @returns The locale to use which will be stored in the `useEnvData('locale')`.
 */
// export function extractLang(acceptLanguage: string | undefined | null, url: string): string {
// 	let locale = (url && new URL(url).searchParams.get('lang')) || acceptLanguage?.split(',')[0];
// 	if (locale) {
// 		// If we have a locale, make sure it's in the list of supported locales.
// 		if (!$localizeFn.TRANSLATION_BY_LOCALE.has(locale)) {
// 			// If not, try to remove sub-locale. (e.g. `en-US` -> `en`)
// 			locale = locale.split('-')[0];
// 			if (!$localizeFn.TRANSLATION_BY_LOCALE.has(locale)) {
// 				locale = ''; // If not, give up and don't translate.
// 			}
// 		}
// 	}
// 	return locale || '';
// }
// export function extractLang(acceptLanguage: string | undefined | null, url: string): string {
// 	// Attempt to extract the language from the URL path (e.g., "/fr/products/...").
// 	let locale = (url && new URL(url).pathname.split('/')[1]) || acceptLanguage?.split(',')[0];

// 	// Check if the extracted locale is supported.
// 	if (locale && !$localizeFn.TRANSLATION_BY_LOCALE.has(locale)) {
// 	  // If not supported, try to remove sub-locale (e.g., "en-US" -> "en").
// 	  locale = locale.split('-')[0];
// 	  if (!$localizeFn.TRANSLATION_BY_LOCALE.has(locale)) {
// 		locale = 'en';  // Default to English if no supported locale is found.
// 	  }
// 	}

// 	return locale;
//   }

// export function extractLang(acceptLanguage: string | undefined | null, url: string): string {
// 	let locale = (url && new URL(url).pathname.split('/')[1]) || acceptLanguage?.split(',')[0];

// 	if (locale && !$localizeFn.TRANSLATION_BY_LOCALE.has(locale)) {
// 		locale = locale.split('-')[0]; // Fallback to sub-locale
// 		if (!$localizeFn.TRANSLATION_BY_LOCALE.has(locale)) {
// 			locale = 'en'; // Default to English
// 		}
// 	}

// 	return locale || 'en';
// }

export function extractLang(acceptLanguage: string | undefined | null, url: string): string {
	try {
		const urlObj = url ? new URL(url) : null;
		let locale = urlObj?.pathname.split('/')[1] || acceptLanguage?.split(',')[0];

		if (locale && !$localizeFn.TRANSLATION_BY_LOCALE.has(locale)) {
			locale = locale.split('-')[0]; // Fallback to sub-locale
			if (!$localizeFn.TRANSLATION_BY_LOCALE.has(locale)) {
				locale = 'en'; // Default to English
			}
		}

		return locale || 'en';
	} catch (e) {
		return 'en';
	}
}

/**
 * Function used to determine the base URL to use for loading the chunks in the browser.
 *
 * The function returns `/build` in dev mode or `/build/<locale>` in prod mode.
 *
 * This function is meant to be used with `RenderOptions.base` property
 *
 * @returns The base URL to use for loading the chunks in the browser.
 */
export function extractBase({ serverData }: RenderOptions): string {
	if (import.meta.env.DEV) {
		return '/build';
	} else {
		return '/build/' + serverData!.locale;
	}
}

export function useI18n() {
	// Runtime translation is used during development only.
	if (import.meta.env.DEV) {
		return initTranslations;
	}
	// Otherwise, will return a noop
	return () => {};
}

initTranslations();
