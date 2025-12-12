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
				class="flex items-center justify-center h-5 w-5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-300"
				aria-hidden="true"
			>
				i
			</span>
		</Tooltip>
	);
});
