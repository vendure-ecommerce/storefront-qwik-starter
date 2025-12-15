import { $, component$, QRL } from '@builder.io/qwik';
import FilterIcon from '../icons/FilterIcon';

export default component$<{ onToggleMenu$: QRL<() => void> }>(({ onToggleMenu$ }) => {
	return (
		<button
			type="button"
			class="flex space-x-2 items-center border rounded p-2 ml-4 sm:ml-6 lg:hidden"
			onClick$={$(async () => {
				onToggleMenu$();
			})}
		>
			<span class="">Filters</span>
			<FilterIcon />
		</button>
	);
});
