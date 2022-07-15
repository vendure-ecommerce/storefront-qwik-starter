import { component$ } from '@builder.io/qwik';

export default component$(({ priceWithTax, currencyCode }: any) => {
	// if (priceWithTax == null || !currencyCode) {
	//   return <></>;
	// }
	// if (typeof priceWithTax === 'number') {
	//   return <>{formatPrice(priceWithTax, currencyCode)}</>;
	// }
	// if ('value' in priceWithTax) {
	//   return <>{formatPrice(priceWithTax.value, currencyCode)}</>;
	// }
	// if (priceWithTax.min === priceWithTax.max) {
	//   return <>{formatPrice(priceWithTax.min, currencyCode)}</>;
	// }
	// return (
	//   <>
	//     {formatPrice(priceWithTax.min, currencyCode)} - {formatPrice(priceWithTax.max, currencyCode)}
	//   </>
	// );

	return <p className="text-3xl text-gray-900 mr-4">{formatPrice(priceWithTax, currencyCode)}</p>;
});

export function formatPrice(value: number, currency: any) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
	}).format(value / 100);
}
