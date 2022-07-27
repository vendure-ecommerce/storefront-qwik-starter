import { component$, mutable } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import Price from './Price';

export default component$(
	({ productAsset, productName, slug, priceWithTax, currencyCode }: any) => {
		return (
			<Link className="flex flex-col" href={`/products/${slug}`}>
				<img
					className="rounded-xl flex-grow object-cover aspect-[7/8]"
					alt=""
					src={productAsset?.preview + '?w=300&h=400'}
				/>
				<div className="h-2" />
				<div className="text-sm text-gray-700">{productName}</div>
				<Price
					priceWithTax={mutable(priceWithTax)}
					currencyCode={currencyCode}
					forcedClassName="text-sm font-medium text-gray-900"
				/>
			</Link>
		);
	}
);
