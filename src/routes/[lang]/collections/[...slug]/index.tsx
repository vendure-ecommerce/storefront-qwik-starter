import { $, QwikKeyboardEvent, component$, useContext, useStore, useTask$ } from '@builder.io/qwik';
import { DocumentHead, routeLoader$, useLocation } from '@builder.io/qwik-city';
import { APP_STATE } from '~/constants';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs';
import CollectionCard from '~/components/collection-card/CollectionCard';
import Filters from '~/components/facet-filter-controls/Filters';
import FiltersButton from '~/components/filters-button/FiltersButton';
import ProductCard from '~/components/products/ProductCard';
import { getCollectionBySlug } from '~/providers/shop/collections/collections';
import {
	searchQueryWithCollectionSlug,
	searchQueryWithTerm,
} from '~/providers/shop/products/products';
import {
	changeUrlParamsWithoutRefresh,
	cleanUpParams,
	enableDisableFacetValues,
	generateDocumentHead,
	groupFacetValues,
} from '~/utils';
import { Collection } from '~/generated/graphql';

export const useCollectionLoader = routeLoader$(async ({ params, request }) => {
	// Get language from URL first segment
	const urlLang = request.url.split('/')[3] || 'en';
	// Fallback to Accept-Language header if no URL language
	const acceptLang = request.headers.get('Accept-Language')?.split(',')[0].split('-')[0];
	const locale = urlLang || acceptLang || 'en';

	const collection = await getCollectionBySlug(params.slug, locale);
	return { collection, locale };
});

export const useSearchLoader = routeLoader$(async ({ params: p, url, request }) => {
	const urlLang = request.url.split('/')[3] || 'en';
	const acceptLang = request.headers.get('Accept-Language')?.split(',')[0].split('-')[0];
	const locale = urlLang || acceptLang || 'en';

	const params = cleanUpParams(p);
	const activeFacetValueIds: string[] = url.searchParams.get('f')?.split('-') || [];

	const searchResult = activeFacetValueIds.length
		? await searchQueryWithTerm(params.slug, '', activeFacetValueIds, locale)
		: await searchQueryWithCollectionSlug(params.slug, locale);

	return { search: searchResult, locale };
});

export default component$(() => {
	const { params: p, url } = useLocation();
	const appState = useContext(APP_STATE);
	const params = cleanUpParams(p);
	const activeFacetValueIds: string[] = url.searchParams.get('f')?.split('-') || [];

	const collectionSignal = useCollectionLoader();
	const searchSignal = useSearchLoader();

	const state = useStore({
		showMenu: false,
		search: searchSignal.value.search,
		facedValues: groupFacetValues(searchSignal.value.search, activeFacetValueIds),
		facetValueIds: activeFacetValueIds,
		locale: appState.language || searchSignal.value.locale,
	});

	useTask$(async ({ track }) => {
		track(() => collectionSignal.value.collection.slug);
		track(() => appState.language); // Track language changes

		params.slug = cleanUpParams(p).slug;
		state.facetValueIds = url.searchParams.get('f')?.split('-') || [];

		// Use appState language for API calls
		const currentLocale = appState.language || state.locale;

		state.search = state.facetValueIds.length
			? await searchQueryWithTerm(params.slug, '', state.facetValueIds, currentLocale)
			: await searchQueryWithCollectionSlug(params.slug, currentLocale);

		state.facedValues = groupFacetValues(state.search, state.facetValueIds);
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

		// Use appState language for API calls
		const currentLocale = appState.language || state.locale;

		state.search = facetValueIds.length
			? await searchQueryWithTerm(params.slug, '', state.facetValueIds, currentLocale)
			: await searchQueryWithCollectionSlug(params.slug, currentLocale);
	});

	const onOpenCloseFilter = $((id: strinyg) => {
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
					{collectionSignal.value.collection.name}
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
				<Breadcrumbs items={collectionSignal.value.collection.breadcrumbs || []} />
				{!!collectionSignal.value.collection.children?.length && (
					<div class="max-w-2xl mx-auto py-16 sm:py-16 lg:max-w-none border-b mb-16">
						<h2 class="text-2xl font-light text-gray-900">Collections</h2>
						<div class="mt-6 grid max-w-xs sm:max-w-none mx-auto sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
							{collectionSignal.value.collection.children.map((child: Collection) => (
								<CollectionCard key={child.id} collection={child} />
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
						onOpenCloseFilter$={onOpenCloseFilter}
					/>
				)}
				<div class="sm:col-span-5 lg:col-span-4">
					<div class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
						{state.search.items.map(
							(item: {
								productId: string | number | null | undefined;
								productAsset: unknown;
								productName: unknown;
								slug: unknown;
								priceWithTax: unknown;
								currencyCode: unknown;
							}) => (
								<ProductCard
									key={item.productId}
									productAsset={item.productAsset}
									productName={item.productName}
									slug={item.slug}
									priceWithTax={item.priceWithTax}
									currencyCode={item.currencyCode}
								/>
							)
						)}
					</div>
				</div>
			</div>
		</div>
	);
});

export const head: DocumentHead = ({ resolveValue, url }) => {
	const { collection } = resolveValue(useCollectionLoader);
	let image = collection.children?.[0]?.featuredAsset?.preview || undefined;
	if (!image) {
		const { search } = resolveValue(useSearchLoader);
		image = search.items?.[0]?.productAsset?.preview || undefined;
	}
	return generateDocumentHead(url.href, collection.name, undefined, image);
};
