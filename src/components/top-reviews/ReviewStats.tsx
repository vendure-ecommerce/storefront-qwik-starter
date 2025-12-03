import { component$, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { ProductReviewHistogramItem } from '~/generated/graphql-shop';
import { getReviewHistogramQuery } from '~/providers/shop/orders/review';

interface ReviewStatsProps {
	productId: string;
	reviewCount: number;
	averageRating: number;
}

export default component$<ReviewStatsProps>(({ productId, reviewCount, averageRating }) => {
	const ratingHistogramSignal = useSignal<ProductReviewHistogramItem[] | null>(null);
	const hoveredRating = useSignal<number | null>(null);

	useVisibleTask$(async () => {
		ratingHistogramSignal.value = (await getReviewHistogramQuery(productId)) || null;
	});

	return (
		<div class="border-gray-200">
			<h3 class="text-lg font-medium text-gray-900 mb-4">Product Rating</h3>

			{/* Summary Stats */}
			<div class="flex flex-col items-center gap-8 mb-8">
				{/* Average Rating */}
				<div class="flex flex-col items-center">
					<div class="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
					<div class="flex items-center gap-1 mt-1">
						{[1, 2, 3, 4, 5].map((star) => (
							<span
								key={star}
								class={`${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
							>
								★
							</span>
						))}
					</div>
					<div class="text-sm text-gray-500 mt-1">{reviewCount} reviews</div>
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
							const isHovered = hoveredRating.value === rating;

							return (
								<div key={rating} class="flex items-center gap-2 mb-3">
									{/* Rating Label */}
									<div class="w-12 text-sm text-gray-600 text-right">
										{rating} <span class="text-xs">★</span>
									</div>

									{/* Progress Bar with Tooltip */}
									<div
										class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden relative group cursor-pointer"
										onMouseEnter$={() => (hoveredRating.value = rating)}
										onMouseLeave$={() => (hoveredRating.value = null)}
									>
										<div
											class="bg-yellow-400 h-full rounded-full transition-all duration-300"
											style={{ width: `${percentage}%` }}
										/>
										s
									</div>

									{/* Tooltip */}
									<div class="w-12 text-sm text-gray-600 text-right block">
										{isHovered && (
											// <div class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
											//   {percentage.toFixed(1)}%
											//   <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
											// </div>
											<div> {percentage.toFixed(1)}% </div>
										)}
									</div>

									{/* Frequency Count */}
									{/* <div class="w-12 text-sm text-gray-600 text-right">{frequency}</div> */}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
});
