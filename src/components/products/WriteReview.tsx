import { component$, QRL, Signal, useContext, useSignal } from '@qwik.dev/core';
import { Form, globalAction$, z, zod$ } from '@qwik.dev/router';
import { LuStar } from '@qwikest/icons/lucide';
import FormInput from '~/components/common/FormInput';
import { APP_STATE } from '~/constants';
import { submitProductReviewMutation } from '~/providers/shop/orders/review';
import { HighlightedButton } from '../buttons/HighlightedButton';
import FormImageInput from '../common/FormImageInput';
import { Dialog } from '../dialog/Dialog';

const MAX_IMAGE_FILES = 2;

interface IProps {
	open: Signal<boolean>;
	basicInfo: {
		productVariantId: string;
		authorLocation?: string;
	};
	onSuccess$?: QRL<() => void>;
}

export const useWriteReviewAction = globalAction$(
	async (data, { params }) => {
		// You can add mutation logic here, or call it in the onSubmitCompleted$
		return { success: true, data };
	},
	zod$({
		authorName: z
			.string()
			.min(1, 'Author name is required')
			.max(50, 'Author name must be at most 50 characters'),
		summary: z
			.string()
			.min(1, 'Summary is required')
			.max(30, 'Summary must be at most 30 characters'),
		body: z
			.string()
			.min(1, 'Review body is required')
			.max(150, 'Review body must be at most 150 characters'),
		rating: z.coerce.number().int().min(1).max(5),
	})
);

export default component$<IProps>(({ open, basicInfo, onSuccess$ }) => {
	const action = useWriteReviewAction();
	const appState = useContext(APP_STATE);
	const ratingSignal = useSignal<number>(5);
	const hideLastName = useSignal(false);

	const firstName = appState.customer.firstName || 'DiliNook';
	const lastName = appState.customer?.lastName || '';

	return (
		<Dialog open={open}>
			<Form
				action={action}
				onSubmitCompleted$={async (event) => {
					const { detail, target } = event;
					if (detail.value.success && detail.value.data) {
						const form = target as HTMLFormElement;
						const filesInput = form.elements.namedItem('files') as HTMLInputElement;
						const fileList = filesInput?.files;
						const filesArray = fileList ? Array.from(fileList) : [];
						const input = {
							authorName: detail.value.data.authorName,
							summary: detail.value.data.summary,
							body: detail.value.data.body,
							rating: detail.value.data.rating,
							files: filesArray || undefined,
							...basicInfo,
						};

						const result = await submitProductReviewMutation(input);
						if (result?.__typename === 'ProductReview') {
							if (onSuccess$) await onSuccess$();
							open.value = false;
						}
						if (result?.__typename === 'ReviewSubmissionError') {
							alert(result.message);
						}
					}
				}}
			>
				<div class="p-2 mt-4 grid grid-cols-1 gap-y-3">
					{/* Author Section */}
					<FormInput
						name="authorName"
						label="Author"
						formAction={action}
						defaults={{
							authorName: `${firstName}${hideLastName.value && lastName ? ` ${lastName.charAt(0)}.` : ` ${lastName}`}`,
						}}
						readOnly={true}
					/>
					<p class="block text-sm font-medium text-gray-700 m-2">
						<input
							type="checkbox"
							checked={hideLastName.value}
							onChange$={() => (hideLastName.value = !hideLastName.value)}
							class="mr-2"
						/>
						Use Initial on Last Name
					</p>

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
