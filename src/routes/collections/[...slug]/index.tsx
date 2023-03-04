import {
	$,
	component$,
	QwikKeyboardEvent,
	useBrowserVisibleTask$,
	useStore,
} from '@builder.io/qwik';
import { routeLoader$, useLocation } from '@builder.io/qwik-city';
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
import {
	changeUrlParamsWithoutRefresh,
	cleanUpParams,
	enableDisableFacetValues,
	groupFacetValues,
	scrollToTop,
} from '~/utils';
import { execute } from '~/utils/api';

export const useCollectionLoader = routeLoader$(async ({ params }) => {
	const { collection } = await execute<{ collection: Collection }>(getCollectionQuery(params.slug));
	return collection;
});

export const useSearchLoader = routeLoader$(async ({ params: p, url }) => {
	const params = cleanUpParams(p);
	const activeFacetValueIds: string[] = url.searchParams.get('f')?.split('-') || [];
	const { search } = activeFacetValueIds.length
		? await execute<{ search: Search }>(searchQueryWithTerm(params.slug, '', activeFacetValueIds))
		: await execute<{ search: Search }>(searchQueryWithCollectionSlug(params.slug));
	return search;
});

export default component$(() => {
	const { params: p, url } = useLocation();
	const params = cleanUpParams(p);
	const activeFacetValueIds: string[] = url.searchParams.get('f')?.split('-') || [];

	const collectionSignal = useCollectionLoader.use();
	const searchSignal = useSearchLoader();

	const state = useStore<{
		showMenu: boolean;
		search: Search;
		facedValues: FacetWithValues[];
		facetValueIds: string[];
	}>({
		showMenu: false,
		search: searchSignal.value,
		facedValues: groupFacetValues(searchSignal.value, activeFacetValueIds),
		facetValueIds: activeFacetValueIds,
	});

	useBrowserVisibleTask$(async () => {
		scrollToTop();
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
			? await execute<{ search: Search }>(searchQueryWithTerm(params.slug, '', state.facetValueIds))
			: await execute<{ search: Search }>(searchQueryWithCollectionSlug(params.slug));
		state.search = search;
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
					{collectionSignal.value.name}
				</h2>
				<div>
					{!!state.facedValues.length && (
						<FiltersButton
							onToggleMenu$={async () => {
								state.showMenu = !state.showMenu;
							}}
						/>
					)}
				</div>
			</div>
			<div>
				<Breadcrumbs items={collectionSignal.value.breadcrumbs || []}></Breadcrumbs>
				{!!collectionSignal.value.children?.length && (
					<div class="max-w-2xl mx-auto py-16 sm:py-16 lg:max-w-none border-b mb-16">
						<h2 class="text-2xl font-light text-gray-900">Collections</h2>
						<div class="mt-6 grid max-w-xs sm:max-w-none mx-auto sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
							{collectionSignal.value.children.map((child) => (
								<CollectionCard key={child.id} collection={child}></CollectionCard>
							))}
						</div>
					</div>
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
