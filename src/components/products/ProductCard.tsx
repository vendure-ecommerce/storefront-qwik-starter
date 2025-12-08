import { component$ } from '@qwik.dev/core';
import { Link } from '@qwik.dev/router';
import { Image } from 'qwik-image';
import { PriceRange, SinglePrice } from '~/generated/graphql-shop';
import { slugToRoute } from '~/utils';
import ReviewRatingStars from '../reviews/ReviewRatingStars';
import Price from './Price';

interface ProductCardProps {
	productAsset?: {
		preview: string;
	} | null;
	productName: string;
	slug: string;
	priceWithTax: PriceRange | SinglePrice;
	currencyCode: string;
	reviewStat?: {
		rating: number;
		reviewCount?: number;
	};
}

export default component$(
	({
		productAsset,
		productName,
		slug,
		priceWithTax,
		currencyCode,
		reviewStat,
	}: ProductCardProps) => {
		return (
			<Link class="flex flex-col mx-auto" href={slugToRoute(slug)}>
				<Image
					layout="fixed"
					class="rounded-xl flex-grow object-cover aspect-[7/8]"
					width="200"
					height="200"
					src={productAsset?.preview + '?w=300&h=400&format=webp'}
					alt={`Image of: ${productName}`}
				/>
				<div class="h-2" />
				<div class="text-sm text-gray-700">{productName}</div>
				<Price
					priceWithTax={priceWithTax}
					currencyCode={currencyCode}
					forcedClass="text-sm font-medium text-gray-900"
				/>
				{reviewStat && (
					<ReviewRatingStars rating={reviewStat.rating} reviewCount={reviewStat.reviewCount} />
				)}
			</Link>
		);
	}
);
