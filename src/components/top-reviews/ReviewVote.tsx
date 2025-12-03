import { $, component$, QRL, Signal, useContext, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { LuThumbsDown, LuThumbsUp } from '@qwikest/icons/lucide';
import { APP_STATE } from '~/constants';

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

	useVisibleTask$(() => {
		// Sync currentVerdict with appState on mount
		console.log('activeCustomer:', JSON.stringify(appState.customer, null, 2));

		// const userVotedUp = appState.customer.upvoteReviewIds.includes(reviewId.toString()) || false;
		// const userVotedDown = appState.customer.downvoteReviewIds.includes(reviewId.toString()) || false;
		// console.log('User voted up:', userVotedUp, 'User voted down:', userVotedDown);
		// currentVerdict.value = userVotedUp ? true : userVotedDown ? false : null;
	});

	// const handleVote = $(async (vote: boolean) => {
	//   isLoading.value = true;
	//   console.log('currentVerdict before vote:', currentVerdict.value);
	//   try {
	//     const result = await voteOnReviewMutation(
	//       reviewId,
	//       vote,
	//     );
	//     if (result?.__typename === 'Success') {
	//       if (currentVerdict.value !== null) {
	//         if (currentVerdict && currentVerdict.value !== vote) {
	//           // User is changing their vote (as if nothing happened)
	//           currentVerdict.value = null;
	//           if (vote) {
	//             downvotes.value--;
	//             appState.customer.downvoteReviewIds.splice(
	//               appState.customer.downvoteReviewIds.indexOf(reviewId),
	//               1
	//             );
	//           } else {
	//             upvotes.value--;
	//             appState.customer.upvoteReviewIds.splice(
	//               appState.customer.upvoteReviewIds.indexOf(reviewId),
	//               1
	//             );
	//           }
	//         }
	//       } else {
	//         currentVerdict.value = vote;
	//         if (vote) {
	//           upvotes.value++;
	//           appState.customer.upvoteReviewIds.push(reviewId);
	//         } else {
	//           downvotes.value++;
	//           appState.customer.downvoteReviewIds.push(reviewId);
	//         }
	//       }
	//       if (onSuccess) {
	//         await onSuccess(vote);
	//       }
	//     } else {
	//       console.error('Error voting on review:', JSON.stringify(result, null, 2));
	//     }
	//   } catch (error) {
	//     console.error('Failed to vote on review:', error);
	//   } finally {
	//     console.log('currentVerdict after vote:', currentVerdict.value);
	//     isLoading.value = false;
	//   }
	// });

	const handleVote = $(async (vote: boolean) => {});
	return (
		<div class="flex items-center gap-4 mt-4 text-sm">
			<div class="flex items-center gap-1">
				<VoteButton
					mode="up"
					count={upvotes}
					currentVerdict={currentVerdict}
					isLoading={isLoading.value}
					onClick$={async () => await handleVote(true)}
				/>
			</div>
			<div class="flex items-center gap-1">
				<VoteButton
					mode="down"
					count={downvotes}
					currentVerdict={currentVerdict}
					isLoading={isLoading.value}
					onClick$={async () => await handleVote(false)}
				/>
			</div>
			<p>
				Current Verdict is:{' '}
				{currentVerdict.value === null ? 'No Vote' : currentVerdict.value ? 'Upvoted' : 'Downvoted'}
			</p>
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

		return (
			<button
				onClick$={onClick$}
				disabled={isLoading}
				class={`flex items-center gap-1 px-2 py-1 rounded transition 
          ${currentVerdict.value ? `${bgColor} ${textColor}` : 'text-gray-500 hover:text-gray-700'} 
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
				aria-label={`${isUp ? 'Upvote' : 'Downvote'} this review`}
			>
				<Icon class="w-4 h-4" />
				<span>{count}</span>
			</button>
		);
	}
);
