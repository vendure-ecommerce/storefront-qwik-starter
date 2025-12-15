import { component$, Signal } from '@builder.io/qwik';
import { ProductVariant } from '~/generated/graphql';

interface ProductVariantSelectorProps {
	productVariants: Array<ProductVariant>;
	selectedVariantIdSignal: Signal<string>;
}

export default component$(
	({ productVariants, selectedVariantIdSignal }: ProductVariantSelectorProps) => {
		return (
			<fieldset class="fieldset mb-2">
				<legend class="fieldset-legend">Choose a Variant:</legend>
				<select
					class="select"
					value={selectedVariantIdSignal.value}
					onChange$={(_, el) => (selectedVariantIdSignal.value = el.value)}
				>
					{productVariants.map((variant) => (
						<option
							key={variant.id}
							value={variant.id}
							selected={selectedVariantIdSignal.value === variant.id}
						>
							{variant.name}
						</option>
					))}
				</select>
			</fieldset>
		);
	}
);
