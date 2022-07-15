import { component$ } from '@builder.io/qwik';
import { formatPrice } from '~/utils';

export default component$(({ priceWithTax, currencyCode, className }: any) => {
	if (priceWithTax == null || !currencyCode) {
		return <div></div>;
	}
	if (typeof priceWithTax === 'number') {
		return <div className={className}>{formatPrice(priceWithTax, currencyCode)}</div>;
	}
	if ('value' in priceWithTax) {
		return <div className={className}>{formatPrice(priceWithTax.value, currencyCode)}</div>;
	}
	if (priceWithTax.min === priceWithTax.max) {
		return <div className={className}>{formatPrice(priceWithTax.min, currencyCode)}</div>;
	}
	return (
		<div className={className}>
			{formatPrice(priceWithTax.min, currencyCode)} - {formatPrice(priceWithTax.max, currencyCode)}
		</div>
	);
});
