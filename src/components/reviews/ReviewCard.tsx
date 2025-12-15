import { component$, useSignal } from '@builder.io/qwik';
import ImageGallery from '../image/ImageGallery';
import ReviewVote from './ReviewVote';

interface ReviewAsset {
	id: string;
	preview: string;
}

interface ProductVariant {
	id: string;
	name: string;
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

	return (
		<div class="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8 border-t ">
			<div
				class={`mt-6 flex text-sm 
					lg:mt-0 lg:col-start-1 lg:col-span-3 lg:row-start-1 lg:flex-col lg:items-start 
					xl:col-span-4`}
			>
				<div class="flex m-5">
					{[1, 2, 3, 4, 5].map((rating) => (
						<span key={rating} class={`${rating <= review.rating ? 'text-yellow-400' : ''}`}>
							★
						</span>
					))}
				</div>
				<p class="font-medium ">{review.authorName}</p>
				<time dateTime={review.createdAt} class="ml-4  pl-4 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0">
					{formatDate(review.createdAt)}
				</time>
				{review.authorLocation && (
					<span class="ml-4  pl-4 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0">
						{review.authorLocation}
					</span>
				)}
				{review.productVariant?.name && (
					<span class="mt-2 pl-2 pr-2 border rounded-xl   text-xs">
						{review.productVariant?.name}
					</span>
				)}
			</div>
			<div
				class={`lg:col-start-4 lg:col-span-8 
				xl:col-start-5 xl:items-start`}
			>
				{/* <div class="flex items-center xl:col-span-1">
				</div> */}
				<div class="mt-4 lg:mt-6 xl:mt-0 xl:col-span-2">
					<h3 class="text-sm font-medium ">{review.summary}</h3>
					<div class="mt-3 space-y-2 text-sm ">
						<p>{review.body}</p>
						{review.response && (
							<div class="mt-3 p-3  border  rounded-lg text-xs">
								<h2 class="text-xs font-medium mr-2 mb-2">{$localize`Response`}:</h2>
								{review.response}
								<time dateTime={review.responseCreatedAt || undefined} class="block mt-1 ">
									{$localize`Updated at`} {formatDate(review.responseCreatedAt || undefined)}
								</time>
							</div>
						)}
						{review.assets && review.assets.length > 0 && <ImageGallery assets={review.assets} />}
						<div>
							<ReviewVote reviewId={review.id} upvotes={upvotes} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
