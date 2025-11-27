import { component$, QRL, Signal, useSignal } from '@qwik.dev/core';
import { Form, globalAction$, z, zod$ } from '@qwik.dev/router';
import { LuStar } from '@qwikest/icons/lucide';
import FormInput from '~/components/common/FormInput';
import { submitProductReviewMutation } from '~/providers/shop/orders/review';
import { HighlightedButton } from '../buttons/HighlightedButton';
import FormImageInput from '../common/FormImageInput';
import { Dialog } from '../dialog/Dialog';

const MAX_IMAGE_FILES = 2;

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

	return (
		<Dialog open={open}>
			<Form
				action={action}
				onSubmitCompleted$={async (event) => {
					// Note that this function cannot defined elsewhere for some qwik reasons I don't fully get
					const { detail, target } = event;
					if (detail.value.success && detail.value.data) {
						const form = target as HTMLFormElement;
						// Get the file input by name
						const filesInput = form.elements.namedItem('files') as HTMLInputElement;
						// Get the FileList
						const fileList = filesInput?.files;

						// Convert FileList to array if needed
						const filesArray = fileList ? Array.from(fileList) : [];
						const input = {
							summary: detail.value.data.summary,
							body: detail.value.data.body,
							rating: detail.value.data.rating,
							files: filesArray || undefined,
							// files: detail.value.data.files, // Removed because 'files' is not in the schema
							...basicInfo,
						};

						console.log('Submitting review with input:', input.summary, input.body, input.rating);
						const result = await submitProductReviewMutation(input);
						console.log('Mutation result:', result);
						if (result?.__typename === 'ProductReview') {
							console.log('Review submitted successfully:', result);
							if (onSuccess$) await onSuccess$();
							open.value = false;
						}
						if (result?.__typename === 'ReviewSubmissionError') {
							console.error('Review submission error:', result);
							// Handle error (you might want to show this in the UI)
							alert(result.message);
						}
					}
				}}
			>
				<div class="p-2 mt-4 grid grid-cols-1 gap-y-3">
					<FormInput name="summary" label="Summary" formAction={action} />
					<FormInput
						name="body"
						label="Review"
						formAction={action}
						className="h-48 w-96"
						as="textarea"
					/>
					<FormImageInput
						name="files"
						label={`Upload Images (max ${MAX_IMAGE_FILES})`}
						formAction={action}
						maxFiles={MAX_IMAGE_FILES}
					/>
					{/* Rating */}
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
				</div>
			</Form>
		</Dialog>
	);
});
