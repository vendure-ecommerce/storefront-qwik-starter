import { component$, useSignal, useStore, useVisibleTask$ } from '@qwik.dev/core';
import { useLocation } from '@qwik.dev/router';
import ShippingAddressCard from '~/components/account/ShippingAddressCard';
import CartContents from '~/components/cart-contents/CartContents';
import CartTotals from '~/components/cart-totals/CartTotals';
import { parseToShippingAddress } from '~/components/common/address';
import SectionWithLabel from '~/components/common/SectionWithLabel';
import { Order } from '~/generated/graphql';
import { getOrderByCodeQuery } from '~/providers/shop/orders/order';
import { ShippingAddress } from '~/types';
import { formatDateTime } from '~/utils';

export default component$(() => {
	const {
		params: { code },
	} = useLocation();
	const store = useStore<{ order?: Order }>({});
	const shippingAddress = useSignal<ShippingAddress | null>(null);

	useVisibleTask$(async () => {
		const order = await getOrderByCodeQuery(code);
		if (order) {
			store.order = order;
			shippingAddress.value = parseToShippingAddress(order.shippingAddress!);
		}
	});
	return store.order ? (
		<div class="lg:grid md:grid-col-2 lg:grid-cols-3 lg:gap-x-12 xl:gap-x-16 ">
			<div class="mt-3 lg:mt-5 ">
				<SectionWithLabel label={$localize`Order details`}>
					<div class="text-sm">
						<h2>
							Order <span class="font-semibold">{store.order?.code}</span>
						</h2>
						<p>
							Placed on <span class="font-semibold">{formatDateTime(store.order?.createdAt)}</span>
						</p>
					</div>
				</SectionWithLabel>

				{shippingAddress.value && (
					<SectionWithLabel label={$localize`Shipping information`} topBorder={true}>
						<ShippingAddressCard
							address={shippingAddress.value}
							allowDelete={false}
							allowEdit={false}
							showDefault={false}
						/>
					</SectionWithLabel>
				)}
			</div>

			<div class="mt-3 lg:mt-5 ">
				<SectionWithLabel label={$localize`Order summary`}>
					{store.order && <CartContents order={store.order} />}
					{store.order && <CartTotals order={store.order} readonly />}
				</SectionWithLabel>
			</div>
		</div>
	) : (
		<div class="h-[100vh]" />
	);
});
