import { component$, mutable, useServerMount$, useStore } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs';
import CollectionCard from '~/components/collection-card/CollectionCard';
import Filters from '~/components/facet-filter-controls/Filters';
import FiltersButton from '~/components/filters-button/FiltersButton';
import ProductCard from '~/components/products/ProductCard';
import { getCollectionQuery, searchQueryWithCollectionSlug } from '~/graphql/queries';
import { Collection, FacetWithValues, Search } from '~/types';
import { groupFacetValues } from '~/utils';
import { sendQuery } from '~/utils/api';

export default component$(() => {
	const { params } = useLocation();
	const state = useStore<{
		loading: boolean;
		showMenu: boolean;
		search: Search;
		collection?: Collection;
	}>({
		loading: true,
		showMenu: false,
		search: {} as Search,
	});

	useServerMount$(async () => {
		const { search } = await sendQuery<{ search: Search; facetValues: any }>(
			searchQueryWithCollectionSlug(params.slug)
		);
		const { collection } = await sendQuery<{ collection: Collection }>(
			getCollectionQuery(params.slug)
		);
		state.collection = collection;
		state.search = search;
		state.loading = false;
	});

	return !!state.loading ? (
		<></>
	) : (
		<div className="max-w-6xl mx-auto px-4">
			<div className="flex justify-between items-center">
				<h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
					{state.collection?.name}
				</h2>

				<FiltersButton
					filterCount={1}
					onToggleMenu$={async () => {
						state.showMenu = !state.showMenu;
					}}
				/>
			</div>
			<Breadcrumbs items={mutable(state.collection?.breadcrumbs || [])}></Breadcrumbs>
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
	);
});
