import { $, component$, useClientEffect$, useMount$, useStore } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs';
import CollectionCard from '~/components/collection-card/CollectionCard';
import Filters from '~/components/facet-filter-controls/Filters';
import FiltersButton from '~/components/filters-button/FiltersButton';
import ProductCard from '~/components/products/ProductCard';
import {
	getCollectionQuery,
	searchQueryWithCollectionSlug,
	searchQueryWithTerm,
} from '~/graphql/queries';
import { Collection, FacetWithValues, Search } from '~/types';
import { changeUrlParamsWithoutRefresh, enableDisableFacetValues, groupFacetValues } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const { params, query } = useLocation();
	const activeFacetValueIds: string[] = query.f ? [query.f] : [];
	const state = useStore<{
		loading: boolean;
		showMenu: boolean;
		search: Search;
		collection?: Collection;
		facedValues: FacetWithValues[];
		facetValueIds: string[];
	}>({
		loading: true,
		showMenu: false,
		search: {} as Search,
		facedValues: [],
		facetValueIds: [],
	});

	useMount$(async () => {
		const { search } = activeFacetValueIds.length
			? await execute<{ search: Search }>(searchQueryWithTerm('', activeFacetValueIds))
			: await execute<{ search: Search }>(searchQueryWithCollectionSlug(params.slug));
		const { collection } = await execute<{ collection: Collection }>(
			getCollectionQuery(params.slug)
		);
		state.collection = collection;
		state.search = search;
		if (!state.facedValues.length) {
			state.facedValues = groupFacetValues(state.search, activeFacetValueIds);
		}
		state.loading = false;
	});

	useClientEffect$(async () => {
		window.scrollTo(0, 0);
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
		changeUrlParamsWithoutRefresh('', facetValueIds);

		const { search } = facetValueIds.length
			? await execute<{ search: Search }>(searchQueryWithTerm('', state.facetValueIds))
			: await execute<{ search: Search }>(searchQueryWithCollectionSlug(params.slug));
		state.search = search;
	});

	return state.loading ? (
		<>Loading...</>
	) : (
		<div className="max-w-6xl mx-auto px-4 py-10">
			<div className="flex justify-between items-center">
				<h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
					{state.collection?.name}
				</h2>
				{!!state.facedValues.length && (
					<FiltersButton
						onToggleMenu$={async () => {
							state.showMenu = !state.showMenu;
						}}
					/>
				)}
			</div>
			<Breadcrumbs items={state.collection?.breadcrumbs || []}></Breadcrumbs>
			{state.collection?.children?.length ? (
				<div className="max-w-2xl mx-auto py-16 sm:py-16 lg:max-w-none border-b mb-16">
					<h2 className="text-2xl font-light text-gray-900">Collections</h2>
					<div className="mt-6 grid max-w-xs sm:max-w-none mx-auto sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
						{state.collection?.children.map((child) => (
							<CollectionCard key={child.id} collection={child}></CollectionCard>
						))}
					</div>
				</div>
			) : (
				''
			)}
			<div className="mt-6 grid sm:grid-cols-5 gap-x-4">
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
				<div className="sm:col-span-5 lg:col-span-4">
					<div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
						{state.search.items.map((item) => (
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
