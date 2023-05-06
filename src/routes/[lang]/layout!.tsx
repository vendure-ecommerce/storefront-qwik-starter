import { component$, Slot } from '@builder.io/qwik';

export default component$(() => {
	return (
		<>
			<h1 class="text-white">LAYOUT</h1>
			<Slot />
		</>
	);
});
