import { $, component$, PropFunction, Slot } from '@builder.io/qwik';
export default component$<{ onClick$: PropFunction<() => void> }>(({ onClick$ }) => {
	return (
		<button
			type="button"
			class="w-28 flex items-center justify-around bg-gray-100 border rounded-md py-2 px-4 text-base font-medium text-black hover:text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-800"
			onClick$={$(async () => {
				onClick$();
			})}
		>
			<Slot />
		</button>
	);
});
