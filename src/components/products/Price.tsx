import { component$, Signal } from '@qwik.dev/core';
import { CurrencyCode } from '~/types';
import { formatPrice } from '~/utils';

export default component$<{
	priceWithTax: number | undefined;
	currencyCode: CurrencyCode | string | undefined;
	variantSig?: Signal<unknown>;
	forcedClass?: string;
}>(({ priceWithTax, currencyCode, variantSig, forcedClass }: any) => {
	return (
		<div>
			{variantSig?.value && <div class="hidden">{JSON.stringify(variantSig.value)}</div>}
			{!currencyCode ? (
				<div></div>
			) : typeof priceWithTax === 'number' ? (
				<div class={forcedClass}>{formatPrice(priceWithTax, currencyCode)}</div>
			) : 'value' in priceWithTax ? (
				<div class={forcedClass}>{formatPrice(priceWithTax.value, currencyCode)}</div>
			) : priceWithTax.min === priceWithTax.max ? (
				<div class={forcedClass}>{formatPrice(priceWithTax.min, currencyCode)}</div>
			) : (
				<div class={forcedClass}>
					{formatPrice(priceWithTax.min, currencyCode)} -{' '}
					{formatPrice(priceWithTax.max, currencyCode)}
				</div>
			)}
		</div>
	);
});
