import { $, component$, PropFunction, Slot } from '@builder.io/qwik';
export const HighlightedButton = component$<{ onClick$: PropFunction<() => void> }>(
	({ onClick$ }) => {
		return (
			<button
				type="button"
				class="w-24 flex items-center justify-around bg-primary-500 border border-transparent rounded-md py-2 px-4 text-base font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-800"
				onClick$={$(async () => {
					onClick$();
				})}
			>
				<Slot />
			</button>
		);
	}
);
