import { $, component$, QRL, Slot } from '@builder.io/qwik';

type Props = {
	extraClass?: string;
	onClick$?: QRL<() => void>;
};

export const Button = component$<Props>(({ extraClass = '', onClick$ }) => {
	return (
		<button
			type="button"
			class={`flex items-center justify-around bg-gray-100 border rounded-md py-2 px-4 text-base font-medium text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-800 ${extraClass}`}
			onClick$={$(async () => {
				onClick$ && onClick$();
			})}
		>
			<Slot />
		</button>
	);
});
