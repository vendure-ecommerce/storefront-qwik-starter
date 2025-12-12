import { $, component$, QRL } from '@builder.io/qwik';
import FilterIcon from '../icons/FilterIcon';

export default component$<{ onToggleMenu$: QRL<() => void> }>(({ onToggleMenu$ }) => {
	return (
		<button
			type="button"
			class="flex space-x-2 items-center border rounded p-2 ml-4 sm:ml-6 text-gray-400 hover:text-gray-500 lg:hidden"
			onClick$={$(async () => {
				onToggleMenu$();
			})}
		>
			<span class="text-gray-600 hover:text-gray-700">Filters</span>
			<FilterIcon />
		</button>
	);
});
