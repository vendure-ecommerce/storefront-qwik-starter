import { component$ } from '@builder.io/qwik';
import { Order } from '~/generated/graphql';
import CartPrice from './CartPrice';

export default component$<{
	order?: Order;
}>(({ order }) => {
	return (
		<dl class="border-t mt-6 border-gray-200 py-6 space-y-6">
			<div class="flex items-center justify-between">
				<dt class="text-sm">{$localize`Subtotal`}</dt>
				<CartPrice
					order={order}
					field={'subTotalWithTax'}
					forcedClass="text-sm font-medium text-gray-900"
				/>
			</div>
			<div class="flex items-center justify-between">
				<dt class="text-sm">{$localize`Shipping cost`}</dt>
				<CartPrice
					order={order}
					field={'shippingWithTax'}
					forcedClass="text-sm font-medium text-gray-900"
				/>
			</div>
			<div class="flex items-center justify-between border-t border-gray-200 pt-6">
				<dt class="text-base font-medium">{$localize`Total`}</dt>
				<CartPrice
					order={order}
					field={'totalWithTax'}
					forcedClass="text-sm font-medium text-gray-900"
				/>
			</div>
		</dl>
	);
});
