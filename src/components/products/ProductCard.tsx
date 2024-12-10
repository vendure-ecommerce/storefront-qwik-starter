import { component$ } from '@builder.io/qwik';

import { Image } from 'qwik-image';
import Price from './Price';
import { LocalizedLink } from '../locallizedclientlink/LocalizedLink';
export default component$(
	({ productAsset, productName, slug, priceWithTax, currencyCode }: any) => {
		return (
			//@ts-ignore
			<LocalizedLink class="flex flex-col mx-auto" href={`/products/${slug}/`}>
				<Image
					layout="fixed"
					class="rounded-xl flex-grow object-cover aspect-[7/8]"
					width="200"
					height="200"
					src={productAsset?.preview + '?w=300&h=400&format=webp'}
					alt={productName}
				/>
				<div class="h-2" />
				<div class="text-sm text-gray-700">{productName}</div>
				<Price
					priceWithTax={priceWithTax}
					currencyCode={currencyCode}
					forcedClass="text-sm font-medium text-gray-900"
				/>
			</LocalizedLink>
		);
	}
);
