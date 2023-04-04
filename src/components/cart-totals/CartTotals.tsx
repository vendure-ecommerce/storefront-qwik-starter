import { component$ } from '@builder.io/qwik';
import CartPrice from './CartPrice';
import { Order } from '~/generated/graphql';

export default component$<{
	order?: Order;
}>(({ order }) => {
	return (
		<dl class="border-t mt-6 border-gray-200 py-6 space-y-6">
			<div class="flex items-center justify-between">
				<dt class="text-sm">Subtotal</dt>
				<CartPrice
					completedOrder={order}
					field={'subTotalWithTax'}
					forcedClass="text-sm font-medium text-gray-900"
				/>
			</div>
			<div class="flex items-center justify-between">
				<dt class="text-sm">Shipping</dt>
				<CartPrice
					completedOrder={order}
					field={'shippingWithTax'}
					forcedClass="text-sm font-medium text-gray-900"
				/>
			</div>
			<div class="flex items-center justify-between border-t border-gray-200 pt-6">
				<dt class="text-base font-medium">Total</dt>
				<CartPrice
					completedOrder={order}
					field={'totalWithTax'}
					forcedClass="text-sm font-medium text-gray-900"
				/>
			</div>
		</dl>
	);
});
