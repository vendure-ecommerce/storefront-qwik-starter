import { component$ } from '@builder.io/qwik';
import { DocumentHead, Link } from '@builder.io/qwik-city';

export default component$(() => {
	return (
		<>
			<h1>Template</h1>
			<Link href="/">Home</Link>
		</>
	);
});

export const head: DocumentHead = () => {
	return {
		title: 'Template',
	};
};
