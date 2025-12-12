import { component$ } from '@builder.io/qwik';
import { ShippingMethodQuote } from '~/generated/graphql';
import { formatPrice } from '~/utils';
import CheckCircleIcon from '../icons/CheckCircleIcon';

interface Props {
	shippingMethod: ShippingMethodQuote;
	checked: boolean;
}

export default component$<Props>(({ shippingMethod, checked }) => {
	return (
		<>
			<span class="flex-1 flex">
				<span class="flex flex-col">
					<span class="block text-sm font-medium text-gray-900">{shippingMethod.name}</span>

					<span class="mt-1 text-sm font-medium text-gray-900">
						{formatPrice(shippingMethod.priceWithTax, 'USD')}
					</span>
					<span class="block text-sm text-gray-500">
						{$localize`Get it by`}{' '}
						<span class="font-medium">{shippingMethod.metadata?.maxWaitDays}</span>{' '}
						{$localize`Days`}
					</span>
					<span class="block text-xs text-gray-500">
						{$localize`Shipping to Postal Code: `} {shippingMethod.metadata?.shipToPostalCode}
					</span>
				</span>
			</span>
			{checked && <CheckCircleIcon />}
			<span
				class={`border-2 ${
					checked ? 'border-primary-500' : ''
				} absolute -inset-px rounded-lg pointer-events-none`}
			></span>
		</>
	);
});
