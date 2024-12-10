// src/services/languageManager.ts
import { isBrowser } from '@builder.io/qwik/build';
import type { Signal } from '@builder.io/qwik';

export const languages = [
	{ code: 'en', name: 'English', flag: '🇬🇧' },
	{ code: 'fr', name: 'Français', flag: '🇫🇷' },
	{ code: 'de', name: 'Deutsch', flag: '🇩🇪' },
	{ code: 'it', name: 'Italiano', flag: '🇮🇹' },
	{ code: 'es', name: 'Español', flag: '🇪🇸' },
] as const;

export type LanguageCode = (typeof languages)[number]['code'];

export class LanguageService {
	constructor(private appState: Signal<{ language: string }>) {}

	getCurrentLanguage(): LanguageCode {
		if (isBrowser) {
			return (this.appState.value.language || this.detectBrowserLanguage()) as LanguageCode;
		}
		return 'en';
	}

	setLanguage(lang: LanguageCode) {
		if (!this.isValidLanguage(lang)) return;

		this.appState.value = {
			...this.appState.value,
			language: lang,
		};

		if (isBrowser) {
			localStorage.setItem('lang', lang);
			document.documentElement.lang = lang;
		}
	}

	detectBrowserLanguage(): LanguageCode {
		if (!isBrowser) return 'en';

		const browserLangs = navigator.languages || [navigator.language];
		const simpleLangs = browserLangs.map((lang) => lang.split('-')[0]);
		const matchedLang = simpleLangs.find((lang) =>
			languages.some((supportedLang) => supportedLang.code === lang)
		);

		return (matchedLang as LanguageCode) || 'en';
	}

	getInitialLanguage(): LanguageCode {
		if (!isBrowser) return 'en';

		const storedLang = localStorage.getItem('lang');
		const urlLang = window.location.pathname.split('/')[1] as LanguageCode;

		if (storedLang && this.isValidLanguage(storedLang)) {
			return storedLang as LanguageCode;
		}

		if (urlLang && this.isValidLanguage(urlLang)) {
			return urlLang;
		}

		return this.detectBrowserLanguage();
	}

	private isValidLanguage(lang: string): lang is LanguageCode {
		return languages.some((l) => l.code === lang);
	}
}
