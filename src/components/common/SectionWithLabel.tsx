import { component$, Slot } from '@qwik.dev/core';

interface IProps {
	label?: string;
	description?: string;
	extraClass?: string;
	topBorder?: boolean;
}

export default component$((props: IProps) => {
	return (
		<div
			class={`${props.topBorder ? 'mt-5 border-t pt-3' : ''} border-gray-200 ${props.extraClass}`}
		>
			{props.label && <h2 class="text-lg font-medium text-gray-900">{props.label}</h2>}
			{props.description && <p class="mt-1 text-sm text-gray-500">{props.description}</p>}
			<div class="mt-3">
				<Slot />
			</div>
		</div>
	);
});
