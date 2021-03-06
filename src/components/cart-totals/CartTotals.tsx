import { component$, mutable } from '@builder.io/qwik';
import { ActiveOrder } from '~/types';
import Price from '../products/Price';

export default component$<{ order: ActiveOrder }>(({ order }) => {
	return (
		<dl className="border-t mt-6 border-gray-200 py-6 space-y-6">
			<div className="flex items-center justify-between">
				<dt className="text-sm">Subtotal</dt>
				<Price
					priceWithTax={mutable(order?.subTotalWithTax)}
					currencyCode={mutable(order?.currencyCode)}
					forcedClassName="text-sm font-medium text-gray-900"
				></Price>
			</div>
			<div className="flex items-center justify-between">
				<dt className="text-sm">Shipping</dt>

				<Price
					priceWithTax={mutable(order?.shippingWithTax ?? 0)}
					currencyCode={mutable(order?.currencyCode)}
					forcedClassName="text-sm font-medium text-gray-900"
				></Price>
			</div>
			<div className="flex items-center justify-between border-t border-gray-200 pt-6">
				<dt className="text-base font-medium">Total</dt>
				<Price
					priceWithTax={mutable(order?.totalWithTax)}
					currencyCode={mutable(order?.currencyCode)}
					forcedClassName="text-base font-medium text-gray-900"
				></Price>
			</div>
		</dl>
	);
});
