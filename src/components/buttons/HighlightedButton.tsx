import { $, component$, QRL, Slot } from '@builder.io/qwik';
import AnimatedSpinnerIcon from '../icons/AnimatedSpinnerIcon';

type Props = {
	extraClass?: string;
	onClick$?: QRL<() => void>;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	loading?: boolean;
};

export const HighlightedButton = component$<Props>(
	({ extraClass = '', onClick$, type = 'button', disabled, loading }) => {
		return (
			<button
				type={type}
				disabled={disabled || loading}
				class={`flex items-center justify-around bg-primary-500 border border-transparent 
					rounded-md py-2 px-4 text-base font-medium text-white hover:bg-primary-600 
					focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-800 
					disabled:bg-slate-300 disabled:cursor-not-allowed disabled:hover:bg-slate-300
					${extraClass}`}
				onClick$={$(async () => {
					onClick$ && onClick$();
				})}
			>
				<Slot />
				{loading && <AnimatedSpinnerIcon forcedClass="ml-2" />}
			</button>
		);
	}
);
