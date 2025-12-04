import { component$, QRL, Signal, useContext, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { Form, globalAction$, z, zod$ } from '@qwik.dev/router';
import { LuStar } from '@qwikest/icons/lucide';
import FormInput from '~/components/common/FormInput';
import { APP_STATE } from '~/constants';
import { isReviewAllowedQuery, submitProductReviewMutation } from '~/providers/shop/orders/review';
import { HighlightedButton } from '../buttons/HighlightedButton';
import FormImageInput from '../common/FormImageInput';
import { Dialog } from '../dialog/Dialog';
import VariantCard from './VariantCard';

const MAX_IMAGE_FILES = 3;

interface IProps {
	open: Signal<boolean>;
	productInfo: {
		variantName: string;
		productName: string;
		preview: string;
	};
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
		authorLocation: z.string().max(100, 'Location must be at most 100 characters').optional(),
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

export default component$<IProps>(({ open, productInfo, basicInfo, onSuccess$ }) => {
	const action = useWriteReviewAction();
	const appState = useContext(APP_STATE);
	const ratingSignal = useSignal<number>(5);
	const hideLastName = useSignal(false);
	const isAllowed = useSignal<boolean>(true);
	const notAllowedReason = useSignal<string>('');
	const hideLocation = useSignal<boolean>(false);

	useVisibleTask$(async () => {
		const isAllowedQueryResult = await isReviewAllowedQuery(basicInfo.productVariantId);
		if (isAllowedQueryResult.__typename === 'PurchasedVariantWithReviewStatus') {
			isAllowed.value = isAllowedQueryResult.canReview;
			notAllowedReason.value = isAllowedQueryResult.notReviewableReason || '';
		} else {
			console.log(
				'isReviewAllowedQuery returned unexpected result:',
				JSON.stringify(isAllowedQueryResult, null, 2)
			);
			isAllowed.value = false;
			notAllowedReason.value = 'Unable to verify review eligibility.';
		}
	});

	const firstName = appState.customer.firstName || 'DiliNook';
	const lastName = appState.customer?.lastName || '';
	return (
		<Dialog open={open}>
			{isAllowed.value ? (
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
								authorLocation: detail.value.data.authorLocation,
								files: filesArray || undefined,
								...basicInfo,
							};

							const result = await submitProductReviewMutation(input);
							if (result?.__typename === 'ProductReview') {
								appState.purchasedVariantsWithReviewStatus =
									appState.purchasedVariantsWithReviewStatus?.map((item) => {
										if (item.variantId === basicInfo.productVariantId) {
											return {
												...item,
												canReview: false,
												notReviewableReason: 'Review submitted - pending approval',
											};
										}
										return item;
									});
								if (onSuccess$) await onSuccess$();
							}
							if (result?.__typename === 'ReviewSubmissionError') {
								alert(result.message);
							}
						}
					}}
				>
					<div class="grid grid-cols-3 gap-4 p-4">
						<div class="col-span-1">
							<h2 class="text-lg font-medium mb-4">{$localize`Write a Review for`}</h2>
							<VariantCard
								preview={productInfo.preview}
								productName={productInfo.productName}
								variantName={productInfo.variantName}
							/>
						</div>
						<div class="p-2 mt-4 col-span-2 gap-y-3">
							{/* Author Section */}
							<FormInput
								name="authorName"
								label={$localize`Author`}
								formAction={action}
								defaults={{
									authorName: `${firstName}${hideLastName.value && lastName ? ` ${lastName.charAt(0)}.` : ` ${lastName}`}`,
								}}
								readOnly={true}
							>
								<div class="block text-xs text-gray-700 ml-4">
									<input
										type="checkbox"
										checked={hideLastName.value}
										onChange$={() => (hideLastName.value = !hideLastName.value)}
										class="ml-2 mr-2"
									/>

									{$localize`Use Initial on Last Name`}
								</div>
							</FormInput>

							<FormInput name="summary" label={$localize`Title`} formAction={action} />
							<FormInput name="body" label={$localize`Review`} formAction={action} as="textarea" />
							<FormInput
								name="authorLocation"
								label={$localize`Location`}
								formAction={action}
								defaults={{
									authorLocation: hideLocation.value ? '' : basicInfo.authorLocation || '',
								}}
								readOnly={true}
							>
								<div class="block text-xs text-gray-700 ml-4">
									<input
										type="checkbox"
										checked={hideLocation.value}
										onChange$={() => (hideLocation.value = !hideLocation.value)}
										class="mr-2"
									/>
									{$localize`Hide Location`}
								</div>
							</FormInput>
							<FormImageInput
								name="files"
								label={$localize`Upload Images (max ${MAX_IMAGE_FILES})`}
								formAction={action}
								maxFiles={MAX_IMAGE_FILES}
							/>
							{/* Rating */}
							<div>
								<label class="block mb-1 font-medium">{$localize`Rating`}</label>
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
					</div>
					<div class="flex justify-end">
						<HighlightedButton type="submit" extraClass="m-2">
							{$localize`Submit Review`}
						</HighlightedButton>
					</div>
				</Form>
			) : (
				<div class="p-4">
					<h2 class="text-lg font-medium mb-4">{$localize`Sorry! Cannot Submit Review`}</h2>
					<p class="text-gray-700">{notAllowedReason.value}</p>
					<div class="flex justify-end mt-6">
						<HighlightedButton onClick$={() => (open.value = false)}>
							{$localize`Close`}
						</HighlightedButton>
					</div>
				</div>
			)}
		</Dialog>
	);
});
