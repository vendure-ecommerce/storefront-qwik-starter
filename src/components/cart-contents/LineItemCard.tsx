import { component$, QRL, Signal, useSignal } from '@qwik.dev/core';
import { OrderLine } from '~/generated/graphql';
import { slugToRoute } from '~/utils';
import Price from '../products/Price';
import WriteReview from '../products/WriteReview';
import ItemPreview from './ItemPreview';

// signals expected by ItemPreview (passed through from parent)
type Signals = {
	filamentColorSignal?: Signal<any>;
	fontMenuSignal?: Signal<any>;
};

interface Props extends Signals {
	line: OrderLine;
	currencyCode: string;
	readOnly: Signal<boolean>;
	onQuantityChange$?: QRL<(id: string, value: number) => void>;
	onRemove$?: QRL<(id: string) => void>;
	canReview?: boolean;
}

export default component$<Props>(
	({
		line,
		currencyCode,
		readOnly,
		onQuantityChange$,
		onRemove$,
		filamentColorSignal,
		fontMenuSignal,
		canReview = false,
	}) => {
		const linePriceWithTax = line.linePriceWithTax;
		const openReviewSignal = useSignal<boolean>(false);

		return (
			<li key={line.id} class="py-6 flex">
				<div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
					<ItemPreview
						filamentColorSignal={filamentColorSignal}
						fontMenuSignal={fontMenuSignal}
						line={line}
					/>
				</div>

				<div class="ml-4 flex-1 flex flex-col">
					<div>
						<div class="flex justify-between text-base font-medium text-gray-900">
							<h3>
								<a href={slugToRoute(line.productVariant.product.slug)}>
									{line.productVariant.name}
								</a>
							</h3>
							<Price
								priceWithTax={linePriceWithTax}
								currencyCode={currencyCode}
								forcedClass="ml-4"
							/>
						</div>
					</div>
					<div class="flex-1 flex items-center text-sm">
						{!readOnly.value ? (
							<form>
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
									class="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								>
									{[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
										<option key={num} value={num} selected={line.quantity === num}>
											{num.toString()}
										</option>
									))}
								</select>
							</form>
						) : (
							<div class="text-gray-800">
								<span class="mr-1">{$localize`Quantity`}</span>
								<span class="font-medium">{line.quantity}</span>
							</div>
						)}
						<div class="flex-1"></div>
						{!readOnly.value && (
							<div class="flex">
								<button
									value={line.id}
									class="font-medium text-primary-600 hover:text-primary-500"
									onClick$={async () => onRemove$ && onRemove$!.call(undefined, line.id)}
								>
									{$localize`Remove`}
								</button>
							</div>
						)}
						{canReview && (
							<div class="flex m-2">
								<a
									href="#"
									class="text-primary-600 underline px-2 py-1"
									onClick$={(e) => {
										e.preventDefault();
										openReviewSignal.value = true;
									}}
								>
									review this
								</a>
							</div>
						)}
					</div>
				</div>
				{canReview && (
					<WriteReview
						open={openReviewSignal}
						basicInfo={{
							productVariantId: line.productVariant.id,
						}}
					/>
				)}
			</li>
		);
	}
);
