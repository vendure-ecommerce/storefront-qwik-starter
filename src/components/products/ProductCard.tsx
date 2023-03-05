import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { Image } from '../image/Image';
import Price from './Price';

export default component$(
	({ productAsset, productName, slug, priceWithTax, currencyCode }: any) => {
		return (
			<Link class="flex flex-col mx-auto" href={`/products/${slug}/`}>
				<Image
					loading="lazy"
					layout="fixed"
					class="rounded-xl flex-grow object-cover aspect-[7/8]"
					width="250"
					height="250"
					src={productAsset?.preview + '?w=300&h=400'}
					alt={productName}
				/>
				<div class="h-2" />
				<div class="text-sm text-gray-700">{productName}</div>
				<Price
					priceWithTax={priceWithTax}
					currencyCode={currencyCode}
					forcedClass="text-sm font-medium text-gray-900"
				/>
			</Link>
		);
	}
);
