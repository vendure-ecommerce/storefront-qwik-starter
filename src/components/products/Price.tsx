import { component$ } from '@builder.io/qwik';
import { CurrencyCode } from '~/types';
import { formatPrice } from '~/utils';

export default component$<{
	priceWithTax: number | undefined;
	currencyCode: CurrencyCode | string | undefined;
	forcedClassName?: string;
}>(({ priceWithTax, currencyCode, forcedClassName }: any) => {
	return (
		<div>
			{!currencyCode ? (
				<div></div>
			) : typeof priceWithTax === 'number' ? (
				<div className={forcedClassName}>{formatPrice(priceWithTax, currencyCode)}</div>
			) : 'value' in priceWithTax ? (
				<div className={forcedClassName}>{formatPrice(priceWithTax.value, currencyCode)}</div>
			) : priceWithTax.min === priceWithTax.max ? (
				<div className={forcedClassName}>{formatPrice(priceWithTax.min, currencyCode)}</div>
			) : (
				<div className={forcedClassName}>
					{formatPrice(priceWithTax.min, currencyCode)} -{' '}
					{formatPrice(priceWithTax.max, currencyCode)}
				</div>
			)}
		</div>
	);
});
