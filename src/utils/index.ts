export const getRandomInt = (max: number) => Math.floor(Math.random() * max);
export function formatPrice(value: number, currency: any) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
	}).format(value / 100);
}
