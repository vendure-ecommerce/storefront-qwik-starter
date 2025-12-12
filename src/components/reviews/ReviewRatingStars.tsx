import { component$ } from '@builder.io/qwik';

interface ReviewRatingStarsProps {
	rating?: number;
	reviewCount?: number;
	className?: string;
}

export default component$<ReviewRatingStarsProps>(({ rating, reviewCount, className = '' }) => {
	// Ensure rating is within 0..total
	const r = Math.max(0, Math.min(5, Number(rating) || 0));

	return (
		<span
			class={`inline-flex items-center ${className}`}
			aria-label={`${r.toFixed(1)} out of 5 stars`}
		>
			{Array.from({ length: 5 }, (_, i) => i + 1).map((star) => {
				let fill = Math.max(0, Math.min(1, r - (star - 1)));
				if (reviewCount !== undefined && reviewCount === 0) {
					fill = 0;
				}
				const percent = (fill * 100).toFixed(2) + '%';
				return (
					<span key={star} class="relative inline-block w-4 h-4 text-gray-300 leading-none mr-0.5">
						<span class="text-gray-300">★</span>
						<span
							class="absolute left-0 top-0 overflow-hidden whitespace-nowrap"
							style={{ width: percent }}
						>
							<span class="text-yellow-400">★</span>
						</span>
					</span>
				);
			})}
			{reviewCount !== undefined && reviewCount > 0 && (
				<span class="ml-1 text-sm text-gray-700"> ({reviewCount})</span>
			)}
		</span>
	);
});
