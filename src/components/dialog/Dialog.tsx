import { component$, Signal, Slot } from '@qwik.dev/core';
import CloseIcon from '../icons/CloseIcon';

interface DialogProps {
	open: Signal<boolean>;
	extraClass?: string;
}

export const Dialog = component$(({ open, extraClass }: DialogProps) => {
	if (!open.value) {
		return null; // Don't render anything if the dialog is not open
	}
	return (
		<div
			class={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ${extraClass}`}
		>
			<div class="bg-white rounded-lg shadow-lg p-6 min-w-[300px] relative">
				<button
					class="absolute top-2 right-2 text-gray-500"
					onClick$={() => (open.value = false)}
					aria-label="Close"
				>
					<CloseIcon />
				</button>
				<Slot />
			</div>
		</div>
	);
});
