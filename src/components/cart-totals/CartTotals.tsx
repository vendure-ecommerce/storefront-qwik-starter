import { $, component$, useContext } from '@qwik.dev/core';
import { APP_STATE } from '~/constants';
import { Order } from '~/generated/graphql';
import { removeCouponCodeMutation } from '~/providers/shop/orders/order';
import { formatPrice } from '~/utils';
import CouponInput from '../coupon-input/CouponInput';
import XMarkIcon from '../icons/XMarkIcon';
import CartPrice from './CartPrice';

export default component$<{
	order?: Order;
	readonly?: boolean;
}>(({ order, readonly = false }) => {
	const appState = useContext(APP_STATE);
	const removeCoupon = $(async (couponCode: string) => {
		const res = await removeCouponCodeMutation(couponCode);
		if (res && res.__typename == 'Order') {
			appState.activeOrder = res as Order;
		}
	});

	return (
		<dl class="border-t mt-6 border-gray-200 py-6 space-y-6">
			{order?.discounts.map((d) => (
				<div key={d.description} class="flex items-center justify-between">
					<div class="text-sm">
						Coupon: <span class="font-medium text-primary-600">{d.description}</span>
					</div>
					<div class="text-sm font-medium text-primary-600">
						{formatPrice(d.amountWithTax, order?.currencyCode || 'USD')}
					</div>
				</div>
			))}
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
			{!readonly && <CouponInput />}
			{(order?.couponCodes || []).length > 0 && !readonly && (
				<div class="flex items-center flex-wrap gap-2">
					<div class="text-sm font-medium">{$localize`Applied coupons`}: </div>
					{order?.couponCodes.map((c) => (
						<div
							class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
							key={c}
						>
							<button class="hover:bg-gray-200 rounded-full p-1" onClick$={() => removeCoupon(c)}>
								<XMarkIcon forcedClass="h-4 w-4" />
							</button>
							<div class="mx-2">{c}</div>
						</div>
					))}
				</div>
			)}
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
