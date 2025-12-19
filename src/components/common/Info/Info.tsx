import { component$ } from '@builder.io/qwik';
import { LuInfo } from '@qwikest/icons/lucide';
import Tooltip from '../tooltip/Tooltip';

interface InfoProps {
	/** Text shown inside the tooltip */
	text: string;
}

export default component$<InfoProps>(({ text }) => {
	return (
		<Tooltip text={text}>
			<span aria-hidden="true">
				<LuInfo class="w-6 h-6" />
			</span>
		</Tooltip>
	);
});
