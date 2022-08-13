import {
	$,
	component$,
	Resource,
	useClientEffect$,
	useResource$,
	useStore,
} from '@builder.io/qwik';
import { RequestHandler, useEndpoint, useLocation } from '@builder.io/qwik-city';
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

export interface SearchData {
	search: Search;
	facedValues: FacetWithValues[];
}

export default component$(() => {
	const { params, query } = useLocation();
	const activeFacetValueIds: string[] = query.f ? [query.f] : [];
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

	const collection = useEndpoint<typeof onGet>();
	const searchData = useResource$<SearchData>(async ({ previous }) => {
		const { search } = activeFacetValueIds.length
			? await execute<{ search: Search }>(searchQueryWithTerm('', activeFacetValueIds))
			: await execute<{ search: Search }>(searchQueryWithCollectionSlug(params.slug));
		let facedValues = previous?.facedValues || [];
		if (facedValues.length) {
			facedValues = groupFacetValues(search, activeFacetValueIds);
		}
		return { search, facedValues };
	});
	// useMount$(async () => {
	// 	const { search } = activeFacetValueIds.length
	// 		? await execute<{ search: Search }>(searchQueryWithTerm('', activeFacetValueIds))
	// 		: await execute<{ search: Search }>(searchQueryWithCollectionSlug(params.slug));
	// 	state.search = search;
	// 	if (!state.facedValues.length) {
	// 		state.facedValues = groupFacetValues(state.search, activeFacetValueIds);
	// 	}
	// 	state.loading = false;
	// });

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

	return (
		<div className="max-w-6xl mx-auto px-4 py-10">
			<div className="flex justify-between items-center">
				<h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
					<Resource
						resource={collection}
						onPending={() => <>Loading...</>}
						onResolved={(collection) => <>{collection ? collection.name : 'All'}</>}
					/>
				</h2>
				<Resource
					resource={searchData}
					onPending={() => <p>Loading...</p>}
					onResolved={(data) => (
						<>
							{!!data.facedValues.length && (
								<FiltersButton
									onToggleMenu$={async () => {
										state.showMenu = !state.showMenu;
									}}
								/>
							)}
						</>
					)}
				/>
			</div>

			<Resource
				resource={collection}
				onPending={() => <Breadcrumbs items={[]} />}
				onResolved={(collection) => <Breadcrumbs items={collection?.breadcrumbs || []} />}
			/>

			<Resource
				resource={collection}
				onPending={() => <div>Loading...</div>}
				onResolved={(collection) => (
					<div className="max-w-2xl mx-auto py-16 sm:py-16 lg:max-w-none border-b mb-16">
						<h2 className="text-2xl font-light text-gray-900">Collections</h2>
						<div className="mt-6 grid max-w-xs sm:max-w-none mx-auto sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
							{collection?.children.map((child) => (
								<CollectionCard key={child.id} collection={child}></CollectionCard>
							))}
						</div>
					</div>
				)}
			/>
			<div className="mt-6 grid sm:grid-cols-5 gap-x-4">
				<Resource
					resource={searchData}
					onPending={() => <p>Loading...</p>}
					onResolved={(data) =>
						!!data.facedValues.length ? (
							<Filters
								showMenu={state.showMenu}
								facetsWithValues={data.facedValues}
								onToggleMenu$={async () => {
									state.showMenu = !state.showMenu;
								}}
								onFilterChange$={onFilterChange}
							/>
						) : (
							<></>
						)
					}
				/>
				<div className="sm:col-span-5 lg:col-span-4">
					<div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
						<Resource
							resource={searchData}
							onPending={() => <p>Loading...</p>}
							onResolved={(data) => (
								<>
									{data.search.items?.map((item) => (
										<ProductCard
											key={item.productId}
											productAsset={item.productAsset}
											productName={item.productName}
											slug={item.slug}
											priceWithTax={item.priceWithTax}
											currencyCode={item.currencyCode}
										></ProductCard>
									))}
								</>
							)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
});

export const onGet: RequestHandler<Collection | null | undefined> = async ({ params }) => {
	const { collection } = await execute<{ collection: Collection }>(getCollectionQuery(params.slug));
	return collection;
};
