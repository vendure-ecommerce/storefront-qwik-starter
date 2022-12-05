import { component$ } from '@builder.io/qwik';
import Price from './Price';

export default component$(
	({ productAsset, productName, slug, priceWithTax, currencyCode }: any) => {
		return (
			<a className="flex flex-col" href={`/products/${slug}/`}>
				<img
					className="rounded-xl flex-grow object-cover aspect-[7/8]"
					alt=""
					src={productAsset?.preview + '?w=300&h=400'}
					width="300"
					height="400"
					loading="lazy"
					decoding="async"
				/>
				<div className="h-2" />
				<div className="text-sm text-gray-700">{productName}</div>
				<Price
					priceWithTax={priceWithTax}
					currencyCode={currencyCode}
					forcedClassName="text-sm font-medium text-gray-900"
				/>
			</a>
		);
	}
);
