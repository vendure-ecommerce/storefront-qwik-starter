import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import GeneralListOptions from '~/components/common/GeneralListOptions';
import { SortOrder } from '~/generated/graphql-shop';
import { getProductReviewsQuery } from '~/providers/shop/orders/review';
import { GeneralSelectOption } from '../common/GeneralSelector';
import { SpinnerWaitingAnimation } from '../icons/SpinnerWaitingAnimation';
import ReviewCard, { ReviewItem } from './ReviewCard';

interface TopReviewsV2Props {
	productId: string;
}

// function formatDate(dateStr?: string) {
// 	if (!dateStr) return '';
// 	const date = new Date(dateStr);
// 	return date.toLocaleDateString('en-US', {
// 		year: 'numeric',
// 		month: 'short',
// 		day: 'numeric',
// 	});
// }

const sortOptionMap: GeneralSelectOption = {
	recent: {
		label: 'Most Recent',
		sort: { createdAt: SortOrder.Desc },
	},
	rating_high: {
		label: 'Highest Rating',
		sort: { rating: SortOrder.Desc },
	},
	rating_low: {
		label: 'Lowest Rating',
		sort: { rating: SortOrder.Asc },
	},
	most_helpful: {
		label: 'Most Helpful',
		sort: { upvotes: SortOrder.Desc },
	},
};

const ratingOptionMap: GeneralSelectOption = {
	'0': {
		label: 'All Ratings',
		filter: { rating: { gte: 0 } },
	},
	'5': {
		label: '⭐⭐⭐⭐⭐ 5',
		filter: { rating: { eq: 5 } },
	},
	'4': {
		label: '⭐⭐⭐⭐ 4',
		filter: { rating: { eq: 4 } },
	},
	'3': {
		label: '⭐⭐⭐ 3',
		filter: { rating: { eq: 3 } },
	},
	'2': {
		label: '⭐⭐ 2',
		filter: { rating: { eq: 2 } },
	},
	'1': {
		label: '⭐ 1',
		filter: { rating: { eq: 1 } },
	},
};

async function fetchReviews(
	productId: string,
	take: number,
	skip: number,
	rating: string,
	sortBy?: string
): Promise<{ items: ReviewItem[]; totalItems: number }> {
	try {
		const result = await getProductReviewsQuery(productId, {
			skip,
			take,
			filter: ratingOptionMap[rating as keyof typeof ratingOptionMap]?.filter || {
				rating: { gte: 0 },
			},
			sort: sortOptionMap[sortBy as keyof typeof sortOptionMap]?.sort || {
				createdAt: SortOrder.Desc,
			},
		});

		if (!result?.items) {
			console.error('Error fetching reviews:', result);
			return { items: [], totalItems: 0 };
		}

		return {
			items: result.items || [],
			totalItems: result.totalItems ?? 0,
		};
	} catch (error) {
		console.error('Failed to fetch product reviews:', error);
		return { items: [], totalItems: 0 };
	}
}

export default component$<TopReviewsV2Props>(({ productId }) => {
	const reviews = useSignal<ReviewItem[]>([]);
	const totalItems = useSignal<number | null>(null);
	const isLoading = useSignal(true);

	const page = useSignal<number>(1);
	const pageSize = 10; // fixed page size
	const rating = useSignal<string>('0');
	const sortBy = useSignal<string>('recent');

	const fetchAndSet = $(async () => {
		isLoading.value = true;
		const take = pageSize;
		const skip = Math.max(0, (page.value - 1) * take);
		const { items, totalItems: total } = await fetchReviews(
			productId,
			take,
			skip,
			rating.value,
			sortBy.value
		);
		reviews.value = items;
		totalItems.value = total;
		isLoading.value = false;
	});

	useVisibleTask$(async ({ track }) => {
		track(() => [page.value, rating.value, sortBy.value]);
		if (rating.value && sortBy.value) {
			await fetchAndSet();
		}
	});

	const handleFilterChange = $(async () => {
		page.value = 1;
		await fetchAndSet();
	});

	const listOptions = [
		{
			label: 'Rating',
			selections: ratingOptionMap,
			selectedValue: rating,
			onChange$: handleFilterChange,
		},
		{
			label: 'Sort by',
			selections: sortOptionMap,
			selectedValue: sortBy,
			onChange$: handleFilterChange,
		},
	];

	return (
		<div class="max-w-2xl mx-auto px-4 lg:max-w-6xl lg:px-8">
			<h2 class="text-lg font-medium ">{$localize`Customer Reviews`}</h2>

			<GeneralListOptions
				ListOptions={listOptions}
				page={page}
				totalItems={totalItems}
				pageSize={pageSize}
			>
				{isLoading.value ? (
					<SpinnerWaitingAnimation />
				) : reviews.value.length === 0 ? (
					<div class="py-8 text-center ">{$localize`No reviews yet.`}</div>
				) : (
					<div class="mt-6 pb-10 border-gray-200 divide-y divide-gray-200 space-y-10">
						{reviews.value.map((review) => (
							<ReviewCard key={review.id} review={review} />
						))}
					</div>
				)}
			</GeneralListOptions>
		</div>
	);
});
