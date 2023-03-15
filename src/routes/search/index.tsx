import {
	$,
	component$,
	QwikKeyboardEvent,
	useBrowserVisibleTask$,
	useStore,
} from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import Filters from '~/components/facet-filter-controls/Filters';
import FiltersButton from '~/components/filters-button/FiltersButton';
import ProductCard from '~/components/products/ProductCard';
import { FacetWithValues } from '~/types';
import {
	changeUrlParamsWithoutRefresh,
	enableDisableFacetValues,
	groupFacetValues,
	scrollToTop,
} from '~/utils';
import { searchQueryWithTerm } from '~/providers/products/products';
import { SearchResponse } from '~/generated/graphql';

export default component$(() => {
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

	const { url } = useLocation();
	const term = url.searchParams.get('q') || '';
	const activeFacetValueIds: string[] = url.searchParams.get('f')?.split('-') || [];

	const executeQuery = $(
		async (term: string, activeFacetValueIds: string[]) =>
			await searchQueryWithTerm('', term, activeFacetValueIds)
	);

	useBrowserVisibleTask$(async () => {
		scrollToTop();
		const { search } = await executeQuery(term, activeFacetValueIds);
		state.search = search as SearchResponse;
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

		const { search } = await executeQuery(term, state.facetValueIds);
		state.search = search as SearchResponse;
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
