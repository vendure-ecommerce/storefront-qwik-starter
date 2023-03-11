import { component$ } from '@builder.io/qwik';

export default component$<{ forcedClass?: string }>(({ forcedClass }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class={forcedClass || 'w-6 h-6'}
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	);
});
