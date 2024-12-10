import { component$, type PropFunction, Slot, useContext, $ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import type { QwikIntrinsicElements } from '@builder.io/qwik';
import { APP_STATE } from '~/constants';

// Define supported languages
export const SUPPORTED_LANGUAGES = ['en', 'fr', 'de', 'it', 'es'] as const;
export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];

// Props interface with proper typing
interface LocalizedLinkProps {
	href: string;
	class?: string; // Changed from className to class
	onClick$?: PropFunction<() => void>;
	children?: QwikIntrinsicElements['div']['children'];
	preserveQuery?: boolean;
}

export const LocalizedLink = component$<LocalizedLinkProps>(
	({ href, class: classList, onClick$, children, preserveQuery = true }) => {
		const appState = useContext(APP_STATE);
		const location = useLocation();

		const currentLanguage = (appState.language || 'en') as LanguageCode;

		const normalizeHref = (path: string) => {
			const cleanPath = path.replace(/^\/[a-z]{2}(\/|$)/, '/');
			return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
		};

		const buildLocalizedHref = () => {
			const normalizedPath = normalizeHref(href);
			let localizedHref = `/${currentLanguage}${normalizedPath}`;
			localizedHref = localizedHref.replace(/\/+/g, '/');

			if (preserveQuery && location.url.search) {
				localizedHref += location.url.search;
			}

			if (href.includes('#')) {
				const hashPart = href.split('#')[1];
				localizedHref += `#${hashPart}`;
			}

			return localizedHref;
		};

		const handleClick = $(() => {
			onClick$?.();

			const headers = new Headers();
			headers.set('Accept-Language', currentLanguage);
		});

		return (
			<Link
				href={buildLocalizedHref()}
				class={classList} // Using classList to avoid naming conflict
				onClick$={handleClick}
				preventdefault:click={false}
			>
				{children}
				<Slot />
			</Link>
		);
	}
);
