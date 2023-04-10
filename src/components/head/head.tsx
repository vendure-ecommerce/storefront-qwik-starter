import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';

export const Head = component$(() => {
	const head = useDocumentHead();
	const loc = useLocation();

	return (
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="theme-color" content="#1D4ED8" />
			<title>Vendure Qwik Storefront</title>
			<meta name="title" content="Vendure Qwik Storefront" />
			<meta
				name="description"
				content="A headless commerce storefront starter kit built with Vendure & Qwik"
			/>

			<link rel="manifest" href="/manifest.json" />
			<link rel="apple-touch-icon" href="/logo-192-192.png" />
			<link rel="preconnect" href="https://demo.vendure.io" />
			<link rel="canonical" href={loc.url.toString()} />

			{head.meta.map((m) => (
				<meta {...m} />
			))}

			{head.links.map((l) => (
				<link {...l} />
			))}

			{head.styles.map((s) => (
				<style {...s.props} dangerouslySetInnerHTML={s.style} />
			))}
		</head>
	);
});
