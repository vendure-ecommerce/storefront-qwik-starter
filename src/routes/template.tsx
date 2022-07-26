import { component$, Host } from '@builder.io/qwik';
import { DocumentHead, Link } from '@builder.io/qwik-city';

export default component$(() => {
	return (
		<Host>
			<h1>Template</h1>
			<Link href="/">Home</Link>
		</Host>
	);
});

export const head: DocumentHead = () => {
	return {
		title: 'Template',
	};
};
