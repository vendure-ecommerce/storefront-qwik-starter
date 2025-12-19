import { $, component$, QRL, Signal, useSignal } from '@builder.io/qwik';
import { Link, useNavigate } from '@builder.io/qwik-city';
import { LuTrash } from '@qwikest/icons/lucide';
import { OrderLine } from '~/generated/graphql';
import { slugToRoute } from '~/utils';
import Info from '../common/Info/Info';
import Price from '../products/Price';
import WriteReview from '../products/WriteReview';
import ItemPreview from './ItemPreview';

interface Props {
	line: Pick<
		OrderLine,
		'id' | 'quantity' | 'linePriceWithTax' | 'featuredAsset' | 'productVariant' | 'customFields'
	>;
	currencyCode: string;
	readOnly: Signal<boolean>;
	onQuantityChange$?: QRL<(id: string, value: number) => void>;
	onRemove$?: QRL<(id: string) => void>;
	allowReview?: boolean;
	notReviewableReasonFixed?: string;
	reviewLocation?: string;
}

export default component$<Props>(
	({
		line,
		currencyCode,
		readOnly,
		onQuantityChange$,
		onRemove$,
		allowReview = false,
		notReviewableReasonFixed,
		reviewLocation = '',
	}) => {
		const justReviewed = useSignal<boolean>(false);
		const linePriceWithTax = line.linePriceWithTax;
		const openReviewSignal = useSignal<boolean>(false);
		const navigate = useNavigate();

		return (
			<li key={line.id} class="py-4 flex">
				<div
					class="flex flex-row w-full"
					onClick$={() => navigate(slugToRoute(line.productVariant.product.slug))}
				>
					<div class="shrink-0 w-24 h-24 border rounded-md overflow-hidden flex justify-center items-center">
						<ItemPreview line={line} />
					</div>

					<div class="ml-4 flex-1 flex flex-col">
						<div>
							<div class="flex justify-between text-base font-medium ">
								<div class="text-md">{line.productVariant.product.name}</div>
							</div>
							<p class="mt-1 text-xs border rounded-md p-1 w-fit">{line.productVariant.name}</p>
							<Price
								priceWithTax={linePriceWithTax}
								currencyCode={currencyCode}
								// forcedClass="ml-2"
							/>
						</div>
					</div>
				</div>
				<div class="ml-4 flex flex-col items-start">
					<div class="flex-1 flex items-center text-sm">
						{!readOnly.value ? (
							<>
								<label html-for={`quantity-${line.id}`} class="mr-2">
									{$localize`Quantity`}
								</label>
								<select
									disabled={readOnly.value}
									id={`quantity-${line.id}`}
									name={`quantity-${line.id}`}
									value={line.quantity}
									onChange$={(_, el) =>
										onQuantityChange$ && onQuantityChange$!.call(undefined, line.id, +el.value)
									}
									class="select select-xs"
								>
									{[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
										<option key={num} value={num} selected={line.quantity === num}>
											{num.toString()}
										</option>
									))}
								</select>
							</>
						) : (
							<div class="flex items-center">
								<span class="mr-1">{$localize`Quantity:`}</span>
								<span class="font-medium">{line.quantity}</span>
							</div>
						)}

						{!readOnly.value && (
							<button
								value={line.id}
								class="btn btn-ghost btn-sm ml-4"
								onClick$={async () => onRemove$ && onRemove$!.call(undefined, line.id)}
							>
								<LuTrash class="w-4 h-4" />
							</button>
						)}
						{allowReview && (
							<div class="flex m-2">
								<Link
									href="#"
									class={`text-primary-600 underline px-2 py-1 
											${notReviewableReasonFixed || justReviewed.value ? 'opacity-50 cursor-not-allowed' : ''}
											`}
									onClick$={(e) => {
										e.preventDefault();
										if (notReviewableReasonFixed || justReviewed.value) {
											return;
										}
										openReviewSignal.value = true;
									}}
								>
									review this
								</Link>
								{(notReviewableReasonFixed || justReviewed.value) && (
									<Info text={notReviewableReasonFixed || 'Just Reviewed - Pending Approval'} />
								)}
							</div>
						)}
					</div>
				</div>
				{allowReview && (
					<WriteReview
						open={openReviewSignal}
						onSuccess$={$(async () => {
							console.log('Review submitted for line:', line.id);
							justReviewed.value = true;
							openReviewSignal.value = false;
						})}
						productInfo={{
							variantName: line.productVariant.name,
							productName: line.productVariant.product.name,
							preview: line.featuredAsset?.preview || '',
						}}
						basicInfo={{
							productVariantId: line.productVariant.id,
							authorLocation: reviewLocation,
						}}
					/>
				)}
			</li>
		);
	}
);
