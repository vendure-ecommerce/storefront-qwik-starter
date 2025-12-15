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
				class={`btn btn-primary flex items-center justify-around
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
