import { component$, Signal } from '@qwik.dev/core';
import { ProductVariant } from '~/generated/graphql';

interface ProductVariantSelectorProps {
	productVariants: Array<ProductVariant>;
	selectedVariantIdSignal: Signal<string>;
}

export default component$(
	({ productVariants, selectedVariantIdSignal }: ProductVariantSelectorProps) => {
		return (
			<div class="mt-4 mb-4">
				<label class="block text-sm font-medium text-gray-700">Select option</label>
				<select
					class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
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
			</div>
		);
	}
);
