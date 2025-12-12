import { component$, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import OrderBriefCard from '~/components/account/OrderBriefCard';
import ShippingAddressCard from '~/components/account/ShippingAddressCard';
import CartContents from '~/components/cart-contents/CartContents';
import CartTotals from '~/components/cart-totals/CartTotals';
import { parseToShippingAddress } from '~/components/common/address';
import SectionWithLabel from '~/components/common/SectionWithLabel';
import { Order } from '~/generated/graphql';
import { getOrderByCodeQuery } from '~/providers/shop/orders/order';
import { ShippingAddress } from '~/types';

export default component$(() => {
	const {
		params: { code },
	} = useLocation();
	const store = useStore<{ order?: Order }>({});
	const shippingAddress = useSignal<ShippingAddress | null>(null);
	const allowReviewSignal = useSignal<boolean>(false);

	useVisibleTask$(async () => {
		const order = await getOrderByCodeQuery(code);
		if (order) {
			store.order = order;
			shippingAddress.value = parseToShippingAddress(order.shippingAddress!);
			if (order.state === 'Delivered') {
				allowReviewSignal.value = true;
			}
		}
	});
	return store.order ? (
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 mt-5">
			<div class="flex justify-center md:justify-end">
				<div class="text-sm max-w-sm">
					<SectionWithLabel label={$localize`Order Brief`} labelClass="m-6">
						<OrderBriefCard order={store.order} />
					</SectionWithLabel>

					{shippingAddress.value && (
						<SectionWithLabel
							label={$localize`Shipping information`}
							topBorder={true}
							labelClass="m-6"
						>
							<ShippingAddressCard
								address={shippingAddress.value}
								allowDelete={false}
								allowEdit={false}
								showDefault={false}
							/>
						</SectionWithLabel>
					)}
				</div>
			</div>

			<div class="flex justify-center md:justify-start">
				<div class=" min-w-60 max-w-96">
					<SectionWithLabel label={$localize`Order summary`} labelClass="m-6">
						{store.order && (
							<>
								<CartContents order={store.order} allowReview={allowReviewSignal.value} />
								<CartTotals order={store.order} readOnly={useSignal(true)} />
							</>
						)}
					</SectionWithLabel>
				</div>
			</div>
		</div>
	) : (
		<div class="h-[100vh]" />
	);
});
