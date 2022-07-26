import { component$, Host, mutable, useClientEffect$, useStore } from '@builder.io/qwik';
import Filters from '~/components/facet-filter-controls/Filters';
import FiltersButton from '~/components/filters-button/FiltersButton';
import ProductCard from '~/components/products/ProductCard';
import { searchQueryWithTerm } from '~/graphql/queries';
import { Search } from '~/types';
import { groupFacetValues } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const state = useStore<{ loading: boolean; showMenu: boolean; search: Search; term: string }>({
		loading: true,
		showMenu: false,
		search: {} as Search,
		term: '',
	});

	useClientEffect$(async () => {
		const { search } = await execute<{ search: Search }>(searchQueryWithTerm(state.term, []));
		state.search = search;
		state.loading = false;
	});

	return !!state.loading ? (
		<></>
	) : (
		<Host>
			<div className="max-w-6xl mx-auto px-4">
				<div className="flex justify-between items-center">
					<h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
						{state.term ? `Results for "${state.term}"` : 'All results'}
					</h2>

					<FiltersButton
						filterCount={1}
						onToggleMenu$={async () => {
							state.showMenu = !state.showMenu;
						}}
					/>
				</div>

				<div className="mt-6 grid sm:grid-cols-5 gap-x-4">
					<Filters
						showMenu={mutable(state.showMenu)}
						facetsWithValues={mutable(groupFacetValues(state.search))}
						onToggleMenu$={async () => {
							state.showMenu = !state.showMenu;
						}}
					/>
					<div className="sm:col-span-5 lg:col-span-4">
						<div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
							{state.search.items.map((item) => (
								<ProductCard key={item.productId} {...item}></ProductCard>
							))}
						</div>
					</div>
				</div>
			</div>
		</Host>
	);
});
