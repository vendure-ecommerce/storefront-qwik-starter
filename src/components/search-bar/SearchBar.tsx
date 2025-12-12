import { $, component$, useSignal } from '@builder.io/qwik';
import { useNavigate } from '@qwik.dev/router';
import { LuSearch } from '@qwikest/icons/lucide';

export default component$(() => {
	const searchValue = useSignal('');
	const nav = useNavigate();

	const handleSearch = $(() => {
		if (searchValue.value) {
			nav(`/search/?q=${encodeURIComponent(searchValue.value)}`);
		}
	});

	return (
		<div class="w-full flex items-center">
			<input
				type="search"
				bind:value={searchValue}
				placeholder={$localize`Search`}
				autoComplete="off"
				class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 flex-1"
				aria-label="Search products"
				onKeyDown$={(e) => {
					if (e.key === 'Enter') {
						handleSearch();
					}
				}}
			/>
			<button
				onClick$={handleSearch}
				class="ml-2 p-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
				disabled={!searchValue.value}
				aria-label="Search"
			>
				<LuSearch class="w-5 h-5" />
			</button>
		</div>
	);
});
