import { $, component$, useSignal } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
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
				class="input text-base-content block w-full sm:text-sm p-2 flex-1"
				aria-label="Search products"
				onKeyDown$={(e) => {
					if (e.key === 'Enter') {
						handleSearch();
					}
				}}
			/>
			<button
				onClick$={handleSearch}
				class="btn btn-md p-1 ml-2 w-9 h-9"
				// disabled={!searchValue.value}
				aria-label="Search"
			>
				<LuSearch class="w-5 h-5" />
			</button>
		</div>
	);
});
