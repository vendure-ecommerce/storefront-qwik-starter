import { component$, ReadonlySignal } from '@qwik.dev/core';
import { ProductVariant } from '~/generated/graphql';
import { CurrencyCode } from '~/types';
import { formatPrice } from '~/utils';

interface PriceProps {
	priceWithTax: number | { min: number; max: number } | { value: number };
	currencyCode: CurrencyCode | string | undefined;
	variantSig?: ReadonlySignal<ProductVariant | undefined>;
	forcedClass?: string;
}

export default component$<PriceProps>(
	({ priceWithTax, currencyCode, variantSig, forcedClass, reviewStat }: PriceProps) => {
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
	}
);
