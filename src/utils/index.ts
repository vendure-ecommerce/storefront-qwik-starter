import { Item } from '~/types';

export const getRandomInt = (max: number) => Math.floor(Math.random() * max);
export function formatPrice(value: number, currency: any) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
	}).format(value / 100);
}

export const withUniqueId = (list: Item[]): Item[] => {
	const result: Item[] = [];
	const ids = new Set(list.map((el) => el.productId));
	ids.forEach((id: string) => result.push(list.find((el) => el.productId === id)!));
	return result;
};
