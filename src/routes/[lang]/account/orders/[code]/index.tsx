import { component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { Image } from 'qwik-image';
import { Order } from '~/generated/graphql';
import { getOrderByCodeQuery } from '~/providers/shop/orders/order';
import { formatDateTime, formatPrice } from '~/utils';

export default component$(() => {
	const {
		params: { code },
	} = useLocation();
	const store = useStore<{ order?: Order }>({});

	useVisibleTask$(async () => {
		store.order = await getOrderByCodeQuery(code);
	});

	return store.order ? (
		<div class="max-w-6xl m-auto rounded-lg p-4 space-y-4 text-gray-900">
			<div>
				<h2 class="mb-2">
					Order <span class="text-xl font-semibold">{store.order?.code}</span>
				</h2>
				<p class="mb-4">
					Placed on{' '}
					<span class="text-xl font-semibold">{formatDateTime(store.order?.createdAt)}</span>
				</p>
				<ul class="divide-y divide-gray-200">
					{store.order?.lines.map((line, key) => {
						return (
							<li key={key} class="py-6 flex">
								<div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
									<Image
										layout="fixed"
										width={100}
										height={100}
										aspectRatio={1}
										class="rounded object-cover max-w-max h-full"
										src={line.featuredAsset?.preview}
									/>
								</div>
								<div class="ml-4 flex-1 flex flex-col">
									<div>
										<div class="flex justify-between text-base font-medium">
											<h3>{line.productVariant.name}</h3>
											<p class="ml-4">
												{formatPrice(line.productVariant.price, store.order?.currencyCode || 'USD')}
											</p>
										</div>
									</div>
									<div class="flex-1 flex items-center justify-between text-sm text-gray-600">
										<div class="flex space-x-4">
											<div class="qty">1</div>
										</div>
										<div class="total">
											<div>
												{formatPrice(
													line.productVariant.price * line.quantity,
													store.order?.currencyCode || 'USD'
												)}
											</div>
										</div>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
			<dl class="border-t mt-6 border-gray-200 py-6 space-y-6">
				<div class="flex items-center justify-between">
					<dt class="text-sm">Subtotal</dt>
					<dd class="text-sm font-medium">
						{formatPrice(store.order?.subTotal, store.order?.currencyCode || 'USD')}
					</dd>
				</div>
				<div class="flex items-center justify-between">
					<dt class="text-sm">
						Shipping{' '}
						<span class="text-gray-600">
							(<span>Standard Shipping</span>)
						</span>
					</dt>
					<dd class="text-sm font-medium">
						{formatPrice(store.order?.shippingWithTax, store.order?.currencyCode || 'USD')}
					</dd>
				</div>
				<div class="flex items-center justify-between">
					<dt class="text-sm">Tax</dt>
					<dd class="text-sm font-medium">
						{formatPrice(store.order?.taxSummary[0].taxTotal, store.order?.currencyCode || 'USD')}
					</dd>
				</div>
				<div class="flex items-center justify-between border-t border-gray-200 pt-6">
					<dt class="text-base font-medium">Total</dt>
					<dd class="text-base font-medium">
						{formatPrice(store.order?.totalWithTax, store.order?.currencyCode || 'USD')}
					</dd>
				</div>
			</dl>
			<div class="w-full bg-gray-100 p-8">
				<p class="mb-4 text-gray-600">Shipping Address</p>
				<p class="text-base font-medium">{store.order?.shippingAddress?.fullName}</p>
				<p class="text-base font-medium">{store.order?.shippingAddress?.streetLine1}</p>
				<p class="text-base font-medium">{store.order?.shippingAddress?.city}</p>
				<p class="text-base font-medium">{store.order?.shippingAddress?.province}</p>
			</div>
		</div>
	) : (
		<div class="h-[100vh]" />
	);
});
