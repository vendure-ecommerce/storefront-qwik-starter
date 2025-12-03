import { component$, useSignal } from '@qwik.dev/core';
import ReviewVote from './ReviewVote';

interface ReviewAsset {
	id: string;
	preview: string;
}

interface ProductVariant {
	id: string;
}

export interface ReviewItem {
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

interface ReviewCardProps {
	review: ReviewItem;
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

export default component$<ReviewCardProps>(({ review }) => {
	const upvotes = useSignal<number>(review.upvotes);
	const downvotes = useSignal<number>(review.downvotes);

	return (
		<div class="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8">
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
					<ReviewVote reviewId={review.id} upvotes={upvotes} downvotes={downvotes} />
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
	);
});
