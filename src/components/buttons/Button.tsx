import { $, component$, QRL, Slot } from '@builder.io/qwik';

type Props = {
	extraClass?: string;
	onClick$?: QRL<() => void>;
	type?: 'button' | 'submit' | 'reset';
};

export const Button = component$<Props>(({ extraClass = '', onClick$, type = 'button' }) => {
	return (
		<button
			type={type}
			class={`flex items-center justify-around bg-base-200 border rounded-md py-2 px-4 text-base font-medium text-base-content hover:bg-base-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary ${extraClass}`}
			onClick$={$(async () => {
				onClick$ && onClick$();
			})}
		>
			<Slot />
		</button>
	);
});
