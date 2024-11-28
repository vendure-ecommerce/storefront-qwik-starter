import { component$, type PropFunction, Slot } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import type { QwikIntrinsicElements } from '@builder.io/qwik';

interface LocalizedLinkProps {
	href: string;
	className?: string;
	onClick$?: PropFunction<() => void>;
	children?: QwikIntrinsicElements['div']['children'];
}
export const LocalizedLink = component$<LocalizedLinkProps>(
	({ href, className, onClick$, children }) => {
		const currentLanguage = 'en'; // Replace with your actual language detection logic

		// Ensure the path always starts with a '/'
		const currentPath = href.startsWith('/')
			? href.replace(/^\/[a-z]{2}(\/|$)/, '/') // Match `/en` or `/en/`
			: `/${href}`;

		// Construct the localized href ensuring the proper format
		const localizedHref = `/${currentLanguage}${currentPath}`.replace(/\/+/g, '/'); // Remove duplicate slashes

		return (
			<Link href={localizedHref} class={className} onClick$={onClick$}>
				{children}
				<Slot />
			</Link>
		);
	}
);
