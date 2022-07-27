import { component$, PropFunction } from '@builder.io/qwik';
import FilterIcon from '../icons/FilterIcon';

export default component$<{ onToggleMenu$: PropFunction<() => void> }>(({ onToggleMenu$ }) => {
	return (
		<button
			type="button"
			className="flex space-x-2 items-center border rounded p-2 ml-4 sm:ml-6 text-gray-400 hover:text-gray-500 lg:hidden"
			onClick$={onToggleMenu$}
		>
			<span>Filters</span>
			<FilterIcon />
		</button>
	);
});
