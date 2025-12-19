import { component$, Slot } from '@builder.io/qwik';

export interface TooltipProps {
	/** Text to show inside the tooltip */
	text?: string;
}

/**
 * Lightweight Tooltip component (using DaisyUI styles).
 *
 * Usage (with text prop):
 * <Tooltip text="Helpful info"> <button>Hover me</button> </Tooltip>
 *
 * Usage (with custom content):
 * <Tooltip>
 *   <span q:slot="tooltip-content">Custom tooltip content</span>
 *   <button>Hover me</button>
 * </Tooltip>
 */
export default component$<TooltipProps>(({ text }: TooltipProps) => {
	return (
		<div class="tooltip" data-tip={text}>
			{!text && (
				<div class="tooltip-content">
					<Slot name="tooltip-content" />
				</div>
			)}
			<Slot />
		</div>
	);
});
