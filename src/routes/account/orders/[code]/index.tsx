import { $, component$, useBrowserVisibleTask$, useContext, useStore } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { TabsContainer } from '~/components/account/TabsContainer';
import { APP_STATE } from '~/constants';
import { logoutMutation } from '~/graphql/mutations';
import { getOrderByCodeQuery } from '~/graphql/queries';
import { ActiveOrder } from '~/types';
import { formatPrice, scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const {
		params: { code },
	} = useLocation();
	const store = useStore<{ order?: ActiveOrder }>({});

	useBrowserVisibleTask$(async () => {
		const { orderByCode } = await execute<{ orderByCode: ActiveOrder }>(
			getOrderByCodeQuery({ code })
		);
		store.order = orderByCode;
		scrollToTop();
	});

	const fullNameWithTitle = (): string => {
		return [appState.customer?.title, appState.customer?.firstName, appState.customer?.lastName]
			.filter((x) => !!x)
			.join(' ');
	};

	const logout = $(async () => {
		await execute(logoutMutation());
		window.location.href = '/';
	});
	return (
		<div class="max-w-6xl xl:mx-auto px-4">
			<h2 class="text-3xl sm:text-5xl font-light text-gray-900 my-8">My Account</h2>
			<p class="text-gray-700 text-lg -mt-4">Welcome back, {fullNameWithTitle()}</p>
			<button onClick$={logout} class="underline my-4 text-primary-600 hover:text-primary-800">
				Sign out
			</button>
			<div class="flex justify-center">
				<div class="w-full text-xl text-gray-500">
					<TabsContainer activeTab="orders">
						<div q:slot="tabContent" class="min-h-[24rem] rounded-lg p-4 space-y-4">
							<pre class="hidden">{JSON.stringify(store.order, null, '\t')}</pre>
							<div>
								<h2 class="text-2xl mb-2">
									Order <span class="font-medium">{store.order?.code}</span>
								</h2>
								<p class="mb-4 text-gray-600">
									Placed on <span class="font-medium">{store.order?.createdAt.toString()}</span>
								</p>
								<ul class="divide-y divide-gray-200">
									{store.order?.lines.map((line) => {
										return (
											<li class="py-6 flex">
												<div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
													<img
														class="rounded object-cover max-w-max h-full"
														src={line.featuredAsset.preview}
													/>
												</div>
												<div class="ml-4 flex-1 flex flex-col">
													<div>
														<div class="flex justify-between text-base font-medium text-gray-900">
															<h3>{line.productVariant.name}</h3>
															<p class="ml-4">
																{formatPrice(
																	line.productVariant.price,
																	store.order?.currencyCode || 'USD'
																)}
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
									<dd class="text-sm font-medium text-gray-900">
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
									<dd class="text-sm font-medium text-gray-900">
										{formatPrice(store.order?.shippingWithTax, store.order?.currencyCode || 'USD')}
									</dd>
								</div>
								<div class="flex items-center justify-between">
									<dt class="text-sm">Tax</dt>
									<dd class="text-sm font-medium text-gray-900">
										{formatPrice(
											store.order?.taxSummary[0].taxTotal,
											store.order?.currencyCode || 'USD'
										)}
									</dd>
								</div>
								<div class="flex items-center justify-between border-t border-gray-200 pt-6">
									<dt class="text-base font-medium">Total</dt>
									<dd class="text-base font-medium text-gray-900">
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
					</TabsContainer>
				</div>
			</div>
		</div>
	);
});
