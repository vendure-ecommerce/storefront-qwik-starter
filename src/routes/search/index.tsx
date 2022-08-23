import { $, component$, mutable, useClientEffect$, useStore } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import Filters from '~/components/facet-filter-controls/Filters';
import FiltersButton from '~/components/filters-button/FiltersButton';
import ProductCard from '~/components/products/ProductCard';
import { searchQueryWithTerm } from '~/graphql/queries';
import { FacetWithValues, Search } from '~/types';
import { changeUrlParamsWithoutRefresh, enableDisableFacetValues, groupFacetValues } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const state = useStore<{
		showMenu: boolean;
		search: Search;
		facedValues: FacetWithValues[];
		facetValueIds: string[];
	}>({
		showMenu: false,
		search: {} as Search,
		facedValues: [],
		facetValueIds: [],
	});

	const { query } = useLocation();
	const term = query.q;
	const activeFacetValueIds: string[] = query.f ? [query.f] : [];

	const executeQuery = $(
		async (term: string, activeFacetValueIds: string[]) =>
			await execute<{ search: Search }>(searchQueryWithTerm(term, activeFacetValueIds))
	);

	useClientEffect$(async () => {
		window.scrollTo(0, 0);
		const { search } = await executeQuery(term, activeFacetValueIds);
		state.search = search;
		state.facedValues = groupFacetValues(state.search, activeFacetValueIds);
	});

	const onFilterChange = $(async (id: string) => {
		const { facedValues, facetValueIds } = enableDisableFacetValues(
			state.facedValues,
			state.facetValueIds.includes(id)
				? state.facetValueIds.filter((f) => f !== id)
				: [...state.facetValueIds, id]
		);
		state.facedValues = facedValues;
		state.facetValueIds = facetValueIds;
		changeUrlParamsWithoutRefresh(term, facetValueIds);

		const { search } = await await executeQuery(term, state.facetValueIds);
		state.search = search;
	});

	return (
		<div className="max-w-6xl mx-auto px-4 py-10">
			<div className="flex justify-between items-center">
				<h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
					{term ? `Results for "${term}"` : 'All filtered results'}
				</h2>
				{!!state.facedValues.length && (
					<FiltersButton
						onToggleMenu$={async () => {
							state.showMenu = !state.showMenu;
						}}
					/>
				)}
			</div>

			<div className="mt-6 grid sm:grid-cols-5 gap-x-4">
				{!!state.facedValues.length && (
					<Filters
						showMenu={mutable(state.showMenu)}
						facetsWithValues={mutable(state.facedValues)}
						onToggleMenu$={async () => {
							state.showMenu = !state.showMenu;
						}}
						onFilterChange$={onFilterChange}
					/>
				)}
				<div className="sm:col-span-5 lg:col-span-4">
					<div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
						{(state.search.items || []).map((item) => (
							<ProductCard
								key={item.productId}
								productAsset={mutable(item.productAsset)}
								productName={item.productName}
								slug={item.slug}
								priceWithTax={mutable(item.priceWithTax)}
								currencyCode={item.currencyCode}
							></ProductCard>
						))}
					</div>
				</div>
			</div>
		</div>
	);
});
