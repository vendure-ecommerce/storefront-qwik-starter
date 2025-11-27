import { $, component$, QRL, Signal, useSignal } from '@qwik.dev/core';
import { Form, globalAction$, z, zod$ } from '@qwik.dev/router';
import { LuStar } from '@qwikest/icons/lucide';
import FormInput from '~/components/common/FormInput';
import { submitProductReviewMutation } from '~/providers/shop/orders/review';
import { HighlightedButton } from '../buttons/HighlightedButton';
import { Dialog } from '../dialog/Dialog';

interface IProps {
	open: Signal<boolean>;
	basicInfo: {
		productId: string;
		variantId?: string;
		authorLocation?: string;
	};
	onSuccess$?: QRL<() => void>;
	onClose$?: QRL<() => void>;
}

export const useWriteReviewAction = globalAction$(
	async (data, { params }) => {
		// You can add mutation logic here, or call it in the onSubmitCompleted$
		return { success: true, data };
	},
	zod$({
		summary: z
			.string()
			.min(1, 'Summary is required')
			.max(20, 'Summary must be at most 20 characters'),
		body: z
			.string()
			.min(1, 'Review body is required')
			.max(200, 'Review body must be at most 200 characters'),
		rating: z.coerce.number().int().min(1).max(5),
	})
);

export default component$<IProps>(({ open, basicInfo, onSuccess$, onClose$ }) => {
	const action = useWriteReviewAction();
	const ratingSignal = useSignal<number>(5);

	const handleSubmit = $(async (detail: any) => {
		if (detail.value.success) {
			// Call your mutation here
			const input = {
				summary: detail.value.data.summary,
				body: detail.value.data.body,
				rating: detail.value.data.rating,
				...basicInfo,
			};
			const result = await submitProductReviewMutation(input);
			if (result?.__typename === 'ProductReview') {
				if (onSuccess$) await onSuccess$();
				open.value = false;
			}
			if (result?.__typename === 'ReviewSubmissionError') {
				// Handle error (you might want to show this in the UI)
				alert(result.message);
			}
		}
	});
	return (
		<Dialog open={open}>
			<Form action={action} onSubmitCompleted$={handleSubmit}>
				<div class="p-2 mt-4 grid grid-cols-1 gap-y-3">
					<FormInput name="summary" label="Summary" formAction={action} />
					<FormInput
						name="body"
						label="Review"
						formAction={action}
						className="h-48 w-96"
						as="textarea"
					/>
					<div>
						<label class="block mb-1 font-medium">Rating</label>
						<div class="flex items-center space-x-1">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									type="button"
									key={star}
									aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
									onClick$={() => (ratingSignal.value = star)}
									class="focus:outline-none"
								>
									<LuStar
										class={`w-6 h-6 ${star <= ratingSignal.value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
									/>
								</button>
							))}
							<input type="hidden" name="rating" value={ratingSignal.value} />
							<span class="ml-2 text-sm text-gray-600">{ratingSignal.value}</span>
						</div>
					</div>
				</div>
				<div class="flex justify-end">
					<HighlightedButton type="submit" extraClass="m-2">
						Submit Review
					</HighlightedButton>
					<button
						type="button"
						class="m-2 px-4 py-2 rounded border"
						onClick$={() => {
							if (onClose$) onClose$();
							open.value = false;
						}}
					>
						Cancel
					</button>
				</div>
			</Form>
		</Dialog>
	);
});
