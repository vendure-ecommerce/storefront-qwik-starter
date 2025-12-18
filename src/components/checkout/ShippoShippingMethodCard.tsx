import { component$ } from '@builder.io/qwik';
import { LuCheckCircle } from '@qwikest/icons/lucide';
import { ShippingMethodQuote } from '~/generated/graphql';
import { formatPrice } from '~/utils';

interface Props {
	shippingMethod: ShippingMethodQuote;
	checked: boolean;
}

export default component$<Props>(({ shippingMethod, checked }) => {
	return (
		<div class="indicator">
			{checked && (
				<span class="indicator-item indicator-start indicator-top">
					<LuCheckCircle class="h-6 w-6 text-primary" />
				</span>
			)}
			<div
				class={`card shadow-sm max-w-60 bg-base-200
					${checked ? 'border-2 border-primary' : ''}
				`}
			>
				<div class="card-body">
					<div class="flex justify-between">
						<h2 class="text-md font-bold">{shippingMethod.name}</h2>
						<span class="text-md font-medium ml-2">
							{formatPrice(shippingMethod.priceWithTax, 'USD')}
						</span>
					</div>
					{shippingMethod.metadata?.maxWaitDays && (
						<span class="block text-sm ">
							{$localize`Get it by`}{' '}
							<span class="font-medium">{shippingMethod.metadata?.maxWaitDays}</span>{' '}
							{$localize`Days`}
						</span>
					)}
					{shippingMethod.metadata?.shipToPostalCode && (
						<span class="block text-xs ">
							{$localize`Shipping to Postal Code: `} {shippingMethod.metadata?.shipToPostalCode}
						</span>
					)}

					{/* <span
						class={`border-2 ${checked ? 'border-primary' : ''
							} absolute -inset-px rounded-lg pointer-events-none`}
					></span> */}
				</div>
			</div>
		</div>
	);
});
