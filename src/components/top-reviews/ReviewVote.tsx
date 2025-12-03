import { $, component$, QRL, Signal, useContext, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { LuThumbsDown, LuThumbsUp } from '@qwikest/icons/lucide';
import { APP_STATE } from '~/constants';
import { voteOnReviewMutation } from '~/providers/shop/orders/review';

interface ReviewVoteProps {
	reviewId: string;
	upvotes: Signal<number>;
	downvotes: Signal<number>;
	onSuccess?: QRL<(vote: boolean) => void>;
}

export default component$<ReviewVoteProps>(({ reviewId, upvotes, downvotes, onSuccess }) => {
	const appState = useContext(APP_STATE);
	const currentVerdict = useSignal<boolean | null>(null); // true for upvote, false for downvote, null for no vote
	const isLoading = useSignal(false);
	const errMessage = useSignal<string | null>(null);

	useVisibleTask$(() => {
		const userVotedUp = appState.customer.upvoteReviewIds.includes(reviewId.toString()) || false;
		const userVotedDown =
			appState.customer.downvoteReviewIds.includes(reviewId.toString()) || false;
		currentVerdict.value = userVotedUp ? true : userVotedDown ? false : null;
	});

	const handleVote = $(async (vote: boolean) => {
		isLoading.value = true;
		try {
			const result = await voteOnReviewMutation(reviewId, vote);
			if (result?.__typename === 'Success') {
				if (currentVerdict.value !== null) {
					if (currentVerdict && currentVerdict.value !== vote) {
						// User is changing their vote (as if nothing happened)
						currentVerdict.value = null;
						if (vote) {
							downvotes.value--;
							appState.customer.downvoteReviewIds.splice(
								appState.customer.downvoteReviewIds.indexOf(reviewId),
								1
							);
						} else {
							upvotes.value--;
							appState.customer.upvoteReviewIds.splice(
								appState.customer.upvoteReviewIds.indexOf(reviewId),
								1
							);
						}
					}
				} else {
					currentVerdict.value = vote;
					if (vote) {
						upvotes.value++;
						appState.customer.upvoteReviewIds.push(reviewId);
					} else {
						downvotes.value++;
						appState.customer.downvoteReviewIds.push(reviewId);
					}
				}
				if (onSuccess) {
					await onSuccess(vote);
				}
			} else {
				console.error('Error voting on review:', JSON.stringify(result, null, 2));
				errMessage.value = result.message || 'An error occurred while voting on the review.';
			}
		} catch (error) {
			console.error('Failed to vote on review:', error);
		} finally {
			console.log('currentVerdict after vote:', currentVerdict.value);
			isLoading.value = false;
		}
	});

	return (
		<div class="flex flex-col items-start gap-2 mt-4 text-sm">
			<div class="flex items-center gap-4">
				<p>{$localize`Was this review helpful?`}</p>
				<VoteButton
					mode="up"
					count={upvotes}
					currentVerdict={currentVerdict}
					isLoading={isLoading.value}
					onClick$={async () => await handleVote(true)}
				/>
				<VoteButton
					mode="down"
					count={downvotes}
					currentVerdict={currentVerdict}
					isLoading={isLoading.value}
					onClick$={async () => await handleVote(false)}
				/>
			</div>
			{errMessage.value && (
				<div
					class="text-red-600 text-xs border rounded-sm cursor-pointer"
					onClick$={$(() => {
						errMessage.value = null;
					})}
				>
					{errMessage.value}
				</div>
			)}
		</div>
	);
});

interface VoteButtonProps {
	mode: 'up' | 'down';
	count: Signal<number>;
	currentVerdict: Signal<boolean | null>;
	isLoading: boolean;
	onClick$: QRL<() => void>;
}

export const VoteButton = component$<VoteButtonProps>(
	({ mode, count, currentVerdict, isLoading, onClick$ }) => {
		const isUp = mode === 'up';
		const Icon = isUp ? LuThumbsUp : LuThumbsDown;
		const bgColor = isUp ? 'bg-blue-100' : 'bg-red-100';
		const textColor = isUp ? 'text-blue-600' : 'text-red-600';

		// Determine if this button is voted
		const isVoted = isUp ? currentVerdict.value === true : currentVerdict.value === false;
		const iconColor = isVoted ? (isUp ? '#2563eb' : '#dc2626') : '#9ca3af';

		return (
			<div class="flex items-center gap-1">
				<button
					onClick$={onClick$}
					disabled={isLoading}
					class={`flex items-center gap-1 px-2 py-1 rounded transition 
            ${isVoted ? `${bgColor} ${textColor}` : 'text-gray-500 hover:text-gray-700'} 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
					aria-label={`${isUp ? 'Upvote' : 'Downvote'} this review`}
				>
					<Icon class="w-4 h-4" style={{ fill: iconColor }} />
					<span>{count.value}</span>
				</button>
				{isLoading && <span class="ml-2 text-xs text-gray-500">{$localize`Loading...`}</span>}
			</div>
		);
	}
);
