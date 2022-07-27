import { FacetWithValues, Search } from '~/types';

export const getRandomInt = (max: number) => Math.floor(Math.random() * max);
export function formatPrice(value: number, currency: any) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
	}).format(value / 100);
}

export const groupFacetValues = (
	search: Search,
	activeFacetValueIds: string[]
): FacetWithValues[] => {
	if (!search) {
		return [];
	}
	const facetMap = new Map<string, FacetWithValues>();
	for (const {
		facetValue: { id, name, facet },
		count,
	} of search.facetValues) {
		if (count === search.totalItems) {
			continue;
		}
		const facetFromMap = facetMap.get(facet.id);
		const selected = (activeFacetValueIds || []).includes(id);
		if (facetFromMap) {
			facetFromMap.values.push({ id, name, selected });
		} else {
			facetMap.set(facet.id, {
				id: facet.id,
				name: facet.name,
				open: true,
				values: [{ id, name, selected }],
			});
		}
	}
	return Array.from(facetMap.values());
};

export const enableDisableFacetValues = (_facedValues: FacetWithValues[], ids: string[]) => {
	const facetValueIds: string[] = [];
	const facedValues = _facedValues.map((facet) => {
		facet.values = facet.values.map((value) => {
			if (ids.includes(value.id)) {
				facetValueIds.push(value.id);
				value.selected = true;
			} else {
				value.selected = false;
			}
			return value;
		});
		return facet;
	});
	return { facedValues, facetValueIds };
};

export const changeUrlParamsWithoutRefresh = (term: string, facetValueIds: string[]) =>
	window.history.pushState(
		'',
		'',
		`${window.location.origin}${window.location.pathname}?q=${term}&f=${facetValueIds.join('-')}`
	);

export const isClientSide = () => typeof window !== 'undefined';

export const scrollToTop = () => {
	if (isClientSide()) {
		window.scrollTo(0, 0);
	}
};
