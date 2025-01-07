import { component$ } from '@builder.io/qwik';
import { RequestHandler } from '@builder.io/qwik-city';

const SUPPORTED_LANGUAGES = ['en', 'fr', 'de', 'it', 'es'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const getBrowserLanguage = (acceptLanguage: string | null): SupportedLanguage => {
	if (!acceptLanguage) return 'en';

	const languages = acceptLanguage
		.split(',')
		.map((lang) => lang.split(';')[0].trim().toLowerCase())
		.map((lang) => lang.split('-')[0]);

	const matchedLang = languages.find((lang) =>
		SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
	) as SupportedLanguage;

	return matchedLang || 'en';
};

export const onRequest: RequestHandler = ({ request, redirect }) => {
	const browserLang = getBrowserLanguage(request.headers.get('accept-language'));
	throw redirect(301, `/${browserLang}`);
};

// Empty component since this route only handles redirection
export default component$(() => {
	return null;
});
