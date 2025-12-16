import { component$, Signal, Slot } from '@builder.io/qwik';
import { LuX } from '@qwikest/icons/lucide';

interface DialogProps {
	open: Signal<boolean>;
	extraClass?: string;
	id?: string;
}

export const Dialog = component$(({ open, extraClass, id = 'generic-dialog' }: DialogProps) => {
	if (!open.value) {
		return null; // Don't render anything if the dialog is not open
	}
	return (
		<div id={id} class={`fixed inset-0 z-20 flex items-center justify-center`}>
			{/* Backdrop to dim the rest of the page */}
			<div
				class="absolute inset-0 bg-black/75"
				onClick$={() => (open.value = false)}
				aria-hidden="true"
			/>
			{/* Dialog panel (above the backdrop) */}
			<div
				class={`bg-base-200 rounded-lg shadow-lg p-6 min-w-80 relative z-10 ${extraClass ?? ''}`}
				role="dialog"
				aria-modal="true"
			>
				<button
					class="btn btn-lg absolute top-1 right-1 bg-transparent border-transparent"
					onClick$={() => (open.value = false)}
					aria-label="Close"
				>
					<LuX class="w-7 h-7" />
				</button>
				<Slot />
			</div>
		</div>
	);
});
