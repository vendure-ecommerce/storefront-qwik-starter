import { $, QwikKeyboardEvent, component$, useStore, useTask$ } from '@builder.io/qwik';
import { routeLoader$, useLocation } from '@builder.io/qwik-city';
import Filters from '~/components/facet-filter-controls/Filters';
import FiltersButton from '~/components/filters-button/FiltersButton';
import ProductCard from '~/components/products/ProductCard';
import { SearchResponse } from '~/generated/graphql';
import { searchQueryWithTerm } from '~/providers/shop/products/products';
import { FacetWithValues } from '~/types';
import { changeUrlParamsWithoutRefresh, enableDisableFacetValues, groupFacetValues } from '~/utils';

export const executeQuery = $(
	async (term: string, activeFacetValueIds: string[]) =>
		await searchQueryWithTerm('', term, activeFacetValueIds)
);

export const useSearchLoader = routeLoader$(async ({ query }) => {
	const term = query.get('q') || '';
	const activeFacetValueIds: string[] = query.get('f')?.split('-') || [];
	const search = await executeQuery(term, activeFacetValueIds);
	return { search, query };
});

export default component$(() => {
	const { url } = useLocation();
	const searchLoader = useSearchLoader();

	const term = url.searchParams.get('q') || '';

	const state = useStore<{
		showMenu: boolean;
		search: SearchResponse;
		facedValues: FacetWithValues[];
		facetValueIds: string[];
	}>({
		showMenu: false,
		search: {} as SearchResponse,
		facedValues: [],
		facetValueIds: [],
	});

	useTask$(async ({ track }) => {
		track(() => searchLoader.value.query);

		const term = searchLoader.value.query.get('q') || '';
		const activeFacetValueIds: string[] = searchLoader.value.query.get('f')?.split('-') || [];

		state.search = await executeQuery(term, activeFacetValueIds);
		state.facedValues = groupFacetValues(state.search, activeFacetValueIds);
		state.facetValueIds = activeFacetValueIds;
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

		state.search = await executeQuery(term, state.facetValueIds);
	});

	const onOpenCloseFilter = $((id: string) => {
		state.facedValues = state.facedValues.map((f) => {
			if (f.id === id) {
				f.open = !f.open;
			}
			return f;
		});
	});

	return (
		<div
			class="max-w-6xl mx-auto px-4 py-10"
			onKeyDown$={(event: QwikKeyboardEvent) => {
				if (event.key === 'Escape') {
					state.showMenu = false;
				}
			}}
		>
			<div class="flex justify-between items-center">
				<h2 class="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
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

			<div class="mt-6 grid sm:grid-cols-5 gap-x-4">
				{!!state.facedValues.length && (
					<Filters
						showMenu={state.showMenu}
						facetsWithValues={state.facedValues}
						onToggleMenu$={async () => {
							state.showMenu = !state.showMenu;
						}}
						onFilterChange$={onFilterChange}
						onOpenCloseFilter$={onOpenCloseFilter}
					/>
				)}
				<div class="sm:col-span-5 lg:col-span-4">
					<div class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
						{(state.search.items || []).map((item) => (
							<ProductCard
								key={item.productId}
								productAsset={item.productAsset}
								productName={item.productName}
								slug={item.slug}
								priceWithTax={item.priceWithTax}
								currencyCode={item.currencyCode}
							></ProductCard>
						))}
					</div>
				</div>
			</div>
		</div>
	);
});
