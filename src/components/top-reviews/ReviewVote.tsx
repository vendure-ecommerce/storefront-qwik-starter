import { $, component$, QRL, Signal, useContext, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { LuThumbsUp } from '@qwikest/icons/lucide';
import { APP_STATE } from '~/constants';
import { voteOnReviewMutation } from '~/providers/shop/orders/review';
import { SpinnerWaitingAnimation } from '../icons/SpinnerWaitingAnimation';

interface ReviewVoteProps {
	reviewId: string;
	upvotes: Signal<number>;
	onSuccess?: QRL<(vote: boolean) => void>;
}

export default component$<ReviewVoteProps>(({ reviewId, upvotes, onSuccess }) => {
	const appState = useContext(APP_STATE);
	const currentVerdict = useSignal<boolean>(false); // true for upvote, false for no vote
	const isLoading = useSignal(false);

	useVisibleTask$(() => {
		currentVerdict.value = appState.customer.upvoteReviewIds.includes(reviewId.toString()) || false;
	});

	const handleVote = $(async () => {
		isLoading.value = true;
		try {
			if (currentVerdict.value === false) {
				// User hasn't voted yet, so this is an upvote
				await voteOnReviewMutation(reviewId, true);
				upvotes.value++;
				appState.customer.upvoteReviewIds = [...appState.customer.upvoteReviewIds, reviewId];
				currentVerdict.value = true;
			} else {
				// User is retracting their upvote
				await voteOnReviewMutation(reviewId, false);
				upvotes.value--;
				appState.customer.upvoteReviewIds = appState.customer.upvoteReviewIds.filter(
					(id) => id !== reviewId
				);
				currentVerdict.value = false;
			}
		} catch (error) {
			console.error('Failed to vote on review:', error);
		} finally {
			isLoading.value = false;
		}
	});

	return (
		<div class="flex flex-col items-start gap-2 mt-4 text-sm">
			<div class="flex items-center gap-4">
				<p>{$localize`Was this review helpful?`}</p>
				<VoteButton
					count={upvotes.value}
					currentVerdict={currentVerdict.value}
					isLoading={isLoading.value}
					onClick$={handleVote}
				/>
			</div>
		</div>
	);
});

interface VoteButtonProps {
	count: number;
	currentVerdict: boolean;
	isLoading: boolean;
	onClick$: QRL<() => void>;
}

export const VoteButton = component$<VoteButtonProps>(
	({ count, currentVerdict, isLoading, onClick$ }) => {
		const isVoted = currentVerdict === true;
		const iconColor = isVoted ? '#2563eb' : '#9ca3af';
		const bgColor = isVoted ? 'bg-blue-100' : '';
		const textColor = isVoted ? 'text-blue-600' : 'text-gray-500';

		return (
			<button
				onClick$={onClick$}
				disabled={isLoading}
				class={`flex items-center gap-1 px-2 py-1 rounded transition 
          ${bgColor} ${textColor} hover:text-gray-700
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
				aria-label="Upvote this review"
			>
				{isLoading ? (
					<SpinnerWaitingAnimation />
				) : (
					<>
						<LuThumbsUp class="w-4 h-4" style={{ fill: iconColor }} />
						<span>{count}</span>
					</>
				)}
			</button>
		);
	}
);
