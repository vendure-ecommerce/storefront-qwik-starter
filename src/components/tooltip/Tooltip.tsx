import { component$, Slot } from '@qwik.dev/core';

interface TooltipProps {
	/** Text to show inside the tooltip */
	text: string;
	/** Additional classes to apply to the tooltip container */
	containerClass?: string;
	/** CSS classes for the tooltip bubble positioning (defaults to top) */
	bubbleClass?: string;
}

/**
 * Lightweight Tooltip component.
 * Usage:
 * <Tooltip text="Helpful info"> <button>Hover me</button> </Tooltip>
 */
export default component$<TooltipProps>(
	({ text, containerClass = '', bubbleClass = '-top-8 left-0' }) => {
		return (
			<div class={`relative inline-flex group ${containerClass}`}>
				<Slot />
				<span
					class={`invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute ${bubbleClass} bg-gray-800 text-white text-xs rounded px-2 py-1 z-50 whitespace-nowrap`}
					role="status"
					aria-live="polite"
				>
					{text}
				</span>
			</div>
		);
	}
);
