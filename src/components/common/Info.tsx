import { component$ } from '@builder.io/qwik';
import Tooltip from '~/components/tooltip/Tooltip';

interface InfoProps {
	/** Text shown inside the tooltip */
	text: string;
	/** Tooltip placement classes (default: top) */
	placement?: string;
	/** Extra classes for the icon container */
	className?: string;
}

export default component$<InfoProps>(({ text, placement = '-top-8 left-0', className = '' }) => {
	return (
		<Tooltip text={text} bubbleClass={placement} containerClass={`inline-block ${className}`}>
			<span
				class="flex items-center justify-center h-5 w-5 rounded-full bg-base-200 text-neutral text-xs font-semibold border border-base-200"
				aria-hidden="true"
			>
				i
			</span>
		</Tooltip>
	);
});
