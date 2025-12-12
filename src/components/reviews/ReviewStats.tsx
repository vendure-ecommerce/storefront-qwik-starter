import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { ProductReviewHistogramItem } from '~/generated/graphql-shop';
import { getReviewHistogramQuery } from '~/providers/shop/orders/review';
import ReviewRatingStars from './ReviewRatingStars';

interface ReviewStatsProps {
	productId: string;
	reviewCount: number;
	averageRating: number;
}

export default component$<ReviewStatsProps>(({ productId, reviewCount, averageRating }) => {
	const ratingHistogramSignal = useSignal<ProductReviewHistogramItem[] | null>(null);

	if (reviewCount === 0) {
		return <div></div>;
	}

	useVisibleTask$(async () => {
		if (reviewCount === 0) return;
		ratingHistogramSignal.value = (await getReviewHistogramQuery(productId)) || null;
	});

	return (
		<div class="border-gray-200">
			<h3 class="text-lg font-medium text-gray-900 mb-4">{$localize`Product Rating`}</h3>
			{/* Summary Stats */}
			<div class="flex flex-col items-center gap-8 mb-8">
				{/* Average Rating */}
				<div class="flex flex-col items-center">
					<div class="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
					<div class="flex items-center gap-1 mt-1">
						<ReviewRatingStars rating={averageRating} />
					</div>
					<div class="text-sm text-gray-500 mt-1">
						{reviewCount} {$localize`reviews`}
					</div>
				</div>

				{/* Rating Breakdown Histogram */}
				{ratingHistogramSignal.value && (
					<div class="w-full">
						{[5, 4, 3, 2, 1].map((rating) => {
							const histogramItem = ratingHistogramSignal.value
								? ratingHistogramSignal.value.find((item) => item.bin === rating)
								: undefined;
							const frequency = histogramItem?.frequency || 0;
							const percentage = reviewCount > 0 ? (frequency / reviewCount) * 100 : 0;
							return (
								<div key={rating} class="flex items-center gap-2 mb-3">
									{/* Rating Label */}
									<div class="w-12 text-sm text-gray-600 text-right">
										{rating} <span class="text-xs">★</span>
									</div>

									{/* Progress Bar with Tooltip */}
									<div class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden relative group">
										<div
											class="bg-yellow-400 h-full rounded-full transition-all duration-300"
											style={{ width: `${percentage}%` }}
										/>
									</div>

									{/* Frequency Count */}
									<div class="w-12 text-sm text-gray-600 text-right">{percentage.toFixed(0)}%</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
});
