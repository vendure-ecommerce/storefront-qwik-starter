import { FacetWithValues, Search } from '~/types';

export const getRandomInt = (max: number) => Math.floor(Math.random() * max);
export function formatPrice(value: number, currency: any) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
	}).format(value / 100);
}

export const groupFacetValues = (search: Search): FacetWithValues[] => {
	const activeFacetValueIds: string[] = [];
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
		const selected = activeFacetValueIds.includes(id);
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
