import { $, component$, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import type { ProductReviewRating, SearchResult } from '~/generated/graphql-shop';
import { getReviewRatingsForProductsQuery } from '~/providers/shop/orders/review';
import ProductCard from './ProductCard';

interface ProductsDisplayProps {
	items: SearchResult[];
	/** optional container classes */
	className?: string;
}

interface ProductRatingsMap {
	[key: string]: {
		rating: number;
		reviewCount: number;
	};
}

const runGetReviewRatingsForProductsQuery = $(
	async (productIds: string[]): Promise<ProductRatingsMap | {}> => {
		const res = await getReviewRatingsForProductsQuery(productIds);
		if (res.__typename === 'ProductReviewRatingList') {
			const ratingsList: ProductReviewRating[] = res.items;
			//
			const ratingsMap: ProductRatingsMap = {};
			ratingsList.forEach((item) => {
				ratingsMap[item.productId] = {
					rating: item.reviewRating,
					reviewCount: item.reviewCount,
				};
			});

			return ratingsMap;
		} else {
			console.error(
				'Error fetching review ratings for products:',
				res.__typename === 'GetReviewRatingsForProductsError' ? res.message : 'Unknown error'
			);
			return {};
		}
	}
);

export default component$<ProductsDisplayProps>(({ items = [], className = '' }) => {
	const productRatingsMap = useStore<Record<string, { rating: number; reviewCount: number }>>({});
	const inFlightIds = useSignal<Set<string>>(new Set());

	useVisibleTask$(async (task) => {
		task.track(() => items);
		if (!items || items.length === 0) return;

		const productIds = items.map((i) => i.productId);
		const idsToFetch = productIds.filter(
			(id) => !(id in productRatingsMap) && !inFlightIds.value.has(id)
		);
		if (idsToFetch.length === 0) return;

		idsToFetch.forEach((id) => inFlightIds.value.add(id));
		try {
			const ratingsMap = await runGetReviewRatingsForProductsQuery(idsToFetch);
			for (const [id, val] of Object.entries(ratingsMap as Record<string, any>)) {
				if (!(id in productRatingsMap)) {
					(productRatingsMap as any)[id] = val;
				}
			}
		} catch (err) {
			console.error('ProductsDisplay: failed to fetch ratings', err);
		} finally {
			idsToFetch.forEach((id) => inFlightIds.value.delete(id));
		}
	});

	return (
		<div
			class={`grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 ${className}`}
		>
			{items.map((item) => {
				const review = (productRatingsMap as any)[item.productId];
				return (
					<ProductCard
						key={item.productId}
						productAsset={item.productAsset}
						productName={item.productName}
						slug={item.slug}
						priceWithTax={item.priceWithTax}
						currencyCode={item.currencyCode}
						reviewStat={review || undefined}
					/>
				);
			})}
		</div>
	);
});
