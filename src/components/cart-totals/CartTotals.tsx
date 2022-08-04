import { component$ } from '@builder.io/qwik';
import CartPrice from './CartPrice';

export default component$(() => {
	return (
		<dl className="border-t mt-6 border-gray-200 py-6 space-y-6">
			<div className="flex items-center justify-between">
				<dt className="text-sm">Subtotal</dt>
				<CartPrice field={'subTotalWithTax'} forcedClassName="text-sm font-medium text-gray-900" />
			</div>
			<div className="flex items-center justify-between">
				<dt className="text-sm">Shipping</dt>
				<CartPrice field={'shippingWithTax'} forcedClassName="text-sm font-medium text-gray-900" />
			</div>
			<div className="flex items-center justify-between border-t border-gray-200 pt-6">
				<dt className="text-base font-medium">Total</dt>
				<CartPrice field={'totalWithTax'} forcedClassName="text-sm font-medium text-gray-900" />
			</div>
		</dl>
	);
});
