import { $, component$, QRL, Slot } from '@builder.io/qwik';

type Props = {
	extraClass?: string;
	onClick$?: QRL<() => void>;
};

export const HighlightedButton = component$<Props>(({ extraClass = '', onClick$ }) => {
	return (
		<button
			type="button"
			class={`flex items-center justify-around bg-primary-500 border border-transparent rounded-md py-2 px-4 text-base font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-800 ${extraClass}`}
			onClick$={$(async () => {
				onClick$ && onClick$();
			})}
		>
			<Slot />
		</button>
	);
});
