import { $, component$, QRL, Signal, useContext, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { LuThumbsDown, LuThumbsUp, LuX } from '@qwikest/icons/lucide';
import { APP_STATE } from '~/constants';
import { voteOnReviewMutation } from '~/providers/shop/orders/review';
import { SpinnerWaitingAnimation } from '../icons/SpinnerWaitingAnimation';

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
			if (currentVerdict.value === null) {
				await voteOnReviewMutation(reviewId, vote);
				if (vote) {
					upvotes.value++;
					appState.customer.upvoteReviewIds.push(reviewId);
				} else {
					downvotes.value++;
					appState.customer.downvoteReviewIds.push(reviewId);
				}
				currentVerdict.value = vote;
			} else {
				if (currentVerdict.value === vote) {
					// User is retracting their vote
					await voteOnReviewMutation(reviewId, !vote);
					currentVerdict.value = null;
					if (!vote) {
						// Retracting a downvote
						downvotes.value--;
						appState.customer.downvoteReviewIds.splice(
							appState.customer.downvoteReviewIds.indexOf(reviewId),
							1
						);
					} else {
						// Retracting an upvote
						upvotes.value--;
						appState.customer.upvoteReviewIds.splice(
							appState.customer.upvoteReviewIds.indexOf(reviewId),
							1
						);
					}
				} else {
					// User is changing their vote, which is not allowed directly
					errMessage.value = $localize`To change your vote, please retract your current vote first.`;
				}
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
					count={upvotes.value}
					currentVerdict={currentVerdict.value}
					isLoading={isLoading.value}
					disabled={currentVerdict.value === false}
					onClick$={async () => await handleVote(true)}
				/>
				<VoteButton
					mode="down"
					count={downvotes.value}
					currentVerdict={currentVerdict.value}
					isLoading={isLoading.value}
					disabled={currentVerdict.value === true}
					onClick$={async () => await handleVote(false)}
				/>
			</div>
			{errMessage.value && (
				<div
					class="text-red-600 text-xs border rounded-sm cursor-pointer m-2"
					onClick$={$(() => {
						errMessage.value = null;
					})}
				>
					{errMessage.value}
					<LuX class="inline-block w-4 h-4 ml-1" />
				</div>
			)}
		</div>
	);
});

interface VoteButtonProps {
	mode: 'up' | 'down';
	count: number;
	currentVerdict: boolean | null;
	isLoading: boolean;
	disabled: boolean;
	onClick$: QRL<() => void>;
}

export const VoteButton = component$<VoteButtonProps>(
	({ mode, count, currentVerdict, isLoading, disabled, onClick$ }) => {
		const isUp = mode === 'up';
		const Icon = isUp ? LuThumbsUp : LuThumbsDown;
		const bgColor = isUp ? 'bg-blue-100' : 'bg-red-100';
		const textColor = isUp ? 'text-blue-600' : 'text-red-600';

		// Determine if this button is voted
		const isVoted = isUp ? currentVerdict === true : currentVerdict === false;
		const iconColor = isVoted ? (isUp ? '#2563eb' : '#dc2626') : '#9ca3af';

		return (
			<div class="flex items-center gap-1">
				<button
					onClick$={onClick$}
					disabled={isLoading || disabled}
					class={`flex items-center gap-1 px-2 py-1 rounded transition 
            ${isVoted ? `${bgColor} ${textColor}` : 'text-gray-500 hover:text-gray-700'} 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
					aria-label={`${isUp ? 'Upvote' : 'Downvote'} this review`}
				>
					{isLoading ? (
						<SpinnerWaitingAnimation />
					) : (
						<>
							<Icon class="w-4 h-4" style={{ fill: iconColor }} />
							<span>{count}</span>
						</>
					)}
				</button>
			</div>
		);
	}
);
