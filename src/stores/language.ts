import { createContextId } from '@builder.io/qwik';
import { useContextProvider, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { isBrowser } from '@builder.io/qwik/build';

export interface LanguageStore {
	currentLanguage: string;
}

export const LanguageContext = createContextId<LanguageStore>('language-context');

export const useLanguageProvider = () => {
	const store = useStore<LanguageStore>({
		currentLanguage: 'es', // Default language
	});

	useVisibleTask$(() => {
		if (isBrowser) {
			const storedLang = localStorage.getItem('lang');
			if (storedLang) {
				store.currentLanguage = storedLang;
			} else {
				localStorage.setItem('lang', store.currentLanguage);
			}
		}
	});

	useContextProvider(LanguageContext, store);
	return store;
};
