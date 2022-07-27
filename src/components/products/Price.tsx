import { component$ } from '@builder.io/qwik';
import { CurrencyCode } from '~/types';
import { formatPrice } from '~/utils';

export default component$<{
	priceWithTax: number | undefined;
	currencyCode: CurrencyCode | string | undefined;
	forcedClassName?: string;
}>(({ priceWithTax, currencyCode, forcedClassName }: any) => {
	if (priceWithTax == null || !currencyCode) {
		return <div></div>;
	}
	if (typeof priceWithTax === 'number') {
		return <div className={forcedClassName}>{formatPrice(priceWithTax, currencyCode)}</div>;
	}
	if ('value' in priceWithTax) {
		return <div className={forcedClassName}>{formatPrice(priceWithTax.value, currencyCode)}</div>;
	}
	if (priceWithTax.min === priceWithTax.max) {
		return <div className={forcedClassName}>{formatPrice(priceWithTax.min, currencyCode)}</div>;
	}
	return (
		<div className={forcedClassName}>
			{formatPrice(priceWithTax.min, currencyCode)} - {formatPrice(priceWithTax.max, currencyCode)}
		</div>
	);
});
