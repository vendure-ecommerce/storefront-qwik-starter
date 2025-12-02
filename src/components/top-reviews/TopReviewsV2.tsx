import { $, component$, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { SortOrder } from '~/generated/graphql-shop';
import { getProductReviewsQuery } from '~/providers/shop/orders/review';
import ProductReviewListOptions from './ProductReviewListOptions';

interface ReviewAsset {
	id: string;
	preview: string;
}

interface ProductVariant {
	id: string;
}

interface ReviewItem {
	id: string;
	productVariant?: ProductVariant | null;
	rating: number;
	summary: string;
	body?: string | null;
	authorName: string;
	authorLocation?: string | null;
	createdAt: string;
	upvotes: number;
	downvotes: number;
	assets?: ReviewAsset[] | null;
	response?: string | null;
	responseCreatedAt?: string | null;
	translations?: any[];
}

interface TopReviewsV2Props {
	productId: string;
}

function formatDate(dateStr?: string) {
	if (!dateStr) return '';
	const date = new Date(dateStr);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

export interface SortOptionMap {
	[key: string]: {
		label: string;
		sortBy: { [key: string]: SortOrder };
	};
}

const sortOptionMap: SortOptionMap = {
	recent: {
		label: 'Most Recent',
		sortBy: { createdAt: SortOrder.Desc },
	},
	rating_high: {
		label: 'Highest Rating',
		sortBy: { rating: SortOrder.Desc },
	},
	rating_low: {
		label: 'Lowest Rating',
		sortBy: { rating: SortOrder.Asc },
	},
	most_helpful: {
		label: 'Most Helpful',
		sortBy: { upvotes: SortOrder.Desc },
	},
};

async function fetchReviews(
	productId: string,
	pageSize: string,
	minRating: string,
	sortBy?: string
): Promise<{ items: ReviewItem[]; totalItems: string }> {
	try {
		const result = await getProductReviewsQuery(productId, {
			skip: 0,
			take: parseInt(pageSize, 10),
			filter:
				parseInt(minRating, 10) > 0 ? { rating: { gte: parseInt(minRating, 10) } } : undefined,
			sort: sortOptionMap[sortBy as keyof typeof sortOptionMap]?.sortBy || {
				createdAt: SortOrder.Desc,
			},
		});

		console.log('Fetched product reviews:', JSON.stringify(result, null, 2));

		if (!result?.items) {
			console.error('Error fetching reviews:', result);
			return { items: [], totalItems: '0' };
		}

		return {
			items: result.items || [],
			totalItems: result.totalItems?.toString() || '0',
		};
	} catch (error) {
		console.error('Failed to fetch product reviews:', error);
		return { items: [], totalItems: '0' };
	}
}

export default component$<TopReviewsV2Props>(({ productId }) => {
	const reviews = useSignal<ReviewItem[]>([]);
	const totalItems = useSignal<string>('0');
	const isLoading = useSignal(true);

	const pageSize = useSignal<string>('10');
	const minRating = useSignal<string>('0');
	const sortBy = useSignal<string>('recent');

	useVisibleTask$(async () => {
		isLoading.value = true;
		const { items, totalItems: total } = await fetchReviews(
			productId,
			pageSize.value,
			minRating.value
		);
		reviews.value = items;
		totalItems.value = total;
		isLoading.value = false;
	});

	const handleFilterChange = $(async () => {
		isLoading.value = true;
		const { items, totalItems: total } = await fetchReviews(
			productId,
			pageSize.value,
			minRating.value
		);
		reviews.value = items;
		totalItems.value = total;
		isLoading.value = false;
	});

	return (
		<div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-6xl lg:px-8">
			<h2 class="text-lg font-medium text-gray-900">Customer Reviews</h2>

			<ProductReviewListOptions
				pageSize={pageSize}
				minRating={minRating}
				sortBy={sortBy}
				onFilterChange$={handleFilterChange}
				sortOptionMap={sortOptionMap}
			/>

			{isLoading.value ? (
				<div class="py-8 text-center text-gray-500">Loading reviews...</div>
			) : reviews.value.length === 0 ? (
				<div class="py-8 text-center text-gray-500">No reviews yet.</div>
			) : (
				<div class="mt-6 pb-10 border-t border-gray-200 divide-y divide-gray-200 space-y-10">
					{reviews.value.map((review) => (
						<div key={review.id} class="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8">
							<div class="lg:col-start-5 lg:col-span-8 xl:col-start-4 xl:col-span-9 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:items-start">
								<div class="flex items-center xl:col-span-1">
									<div class="flex items-center">
										{[1, 2, 3, 4, 5].map((rating) => (
											<span
												key={rating}
												class={`${rating <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
											>
												★
											</span>
										))}
									</div>
									<p class="ml-3 text-sm text-gray-700">
										{review.rating}
										<span class="sr-only"> out of 5 stars</span>
									</p>
								</div>
								<div class="mt-4 lg:mt-6 xl:mt-0 xl:col-span-2">
									<h3 class="text-sm font-medium text-gray-900">{review.summary}</h3>
									<div class="mt-3 space-y-2 text-sm text-gray-700">
										<p>{review.body}</p>
										{review.assets && review.assets.length > 0 && (
											<div class="flex space-x-2 mt-2">
												{review.assets.map((asset) => (
													<img
														key={asset.id}
														src={asset.preview}
														alt="Review image"
														class="w-20 h-20 object-cover rounded border"
													/>
												))}
											</div>
										)}
									</div>
								</div>
							</div>
							<div class="mt-6 flex items-center text-sm lg:mt-0 lg:col-start-1 lg:col-span-4 lg:row-start-1 lg:flex-col lg:items-start xl:col-span-3">
								<p class="font-medium text-gray-900">{review.authorName}</p>
								<time
									dateTime={review.createdAt}
									class="ml-4 border-l border-gray-200 pl-4 text-gray-500 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0"
								>
									{formatDate(review.createdAt)}
								</time>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
});
