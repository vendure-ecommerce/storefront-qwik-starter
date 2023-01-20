import { getLocale } from '@builder.io/qwik';
import en from './labels/en.json';
import sp from './labels/sp.json';

const labels: Record<string, Record<keyof typeof en, string>> = { en, sp };

export const t = (label: keyof typeof en, params: Record<string, string> = {}): string => {
	const locale = getLocale('en');
	let text =
		!!labels[locale] && !!labels[locale][label] ? labels[locale][label] : locale + ' - ' + label;
	Object.entries(params).forEach(([key, value]) => (text = text.replace(`#${key}`, value)));
	return text;
};
