import { component$ } from '@builder.io/qwik';
import Price from './Price';

export default component$(
	({ productAsset, productName, slug, priceWithTax, currencyCode }: any) => {
		return (
			<a class="flex flex-col mx-auto" href={`/products/${slug}/`}>
				<picture>
					<source srcSet={productAsset?.preview + '?w=300&h=400&format=avif'} type="image/webp" />
					<source srcSet={productAsset?.preview + '?w=300&h=400&format=webp'} type="image/webp" />
					<img
						class="rounded-xl flex-grow object-cover aspect-[7/8]"
						alt={productName}
						src={productAsset?.preview + '?w=300&h=400'}
						width="300"
						height="400"
						loading="lazy"
						decoding="async"
					/>
				</picture>
				<div class="h-2" />
				<div class="text-sm text-gray-700">{productName}</div>
				<Price
					priceWithTax={priceWithTax}
					currencyCode={currencyCode}
					forcedClass="text-sm font-medium text-gray-900"
				/>
			</a>
		);
	}
);
