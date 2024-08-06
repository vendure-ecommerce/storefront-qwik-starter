import { component$, useComputed$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { Link, useLocation, useNavigate } from '@builder.io/qwik-city';
import { Image } from 'qwik-image';
import { APP_STATE } from '~/constants';
import { Order } from '~/generated/graphql';
import { adjustOrderLineMutation, removeOrderLineMutation } from '~/providers/shop/orders/order';
import { isCheckoutPage } from '~/utils';
import Price from '../products/Price';

export default component$<{
	order?: Order;
}>(({ order }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const appState = useContext(APP_STATE);
	const currentOrderLineSignal = useSignal<{ id: string; value: number }>();
	const rowsSignal = useComputed$(() => order?.lines || appState.activeOrder?.lines || []);
	const isInEditableUrl = !isCheckoutPage(location.url.toString()) || !order;
	const currencyCode = order?.currencyCode || appState.activeOrder?.currencyCode || 'USD';

	useTask$(({ track, cleanup }) => {
		track(() => currentOrderLineSignal.value);
		let id: NodeJS.Timeout;
		if (currentOrderLineSignal.value) {
			id = setTimeout(async () => {
				appState.activeOrder = await adjustOrderLineMutation(
					currentOrderLineSignal.value!.id,
					currentOrderLineSignal.value!.value
				);
			}, 300);
		}
		cleanup(() => {
			if (id) {
				clearTimeout(id);
			}
		});
	});

	return (
		<div class="flow-root">
			<ul class="-my-6 divide-y divide-gray-200">
				{rowsSignal.value.map((line) => {
					const { linePriceWithTax } = line;
					return (
						<li key={line.id} class="py-6 flex">
							<div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
								<Image
									layout="fixed"
									width="100"
									height="100"
									class="w-full h-full object-center object-cover"
									src={line.featuredAsset?.preview + '?preset=thumb'}
									alt={line.productVariant.name}
								/>
							</div>

							<div class="ml-4 flex-1 flex flex-col">
								<div>
									<div class="flex justify-between text-base font-medium text-gray-900">
										<h3>
											<Link href={`/products/${line.productVariant.product.slug}/`}>
												{line.productVariant.name}
											</Link>
										</h3>
										<Price
											priceWithTax={linePriceWithTax}
											currencyCode={currencyCode}
											forcedClass="ml-4"
										></Price>
									</div>
								</div>
								<div class="flex-1 flex items-center text-sm">
									{isInEditableUrl ? (
										<form>
											<label html-for={`quantity-${line.id}`} class="mr-2">
												{$localize`Quantity`}
											</label>
											<select
												disabled={!isInEditableUrl}
												id={`quantity-${line.id}`}
												name={`quantity-${line.id}`}
												value={line.quantity}
												onChange$={(_, el) => {
													currentOrderLineSignal.value = { id: line.id, value: +el.value };
												}}
												class="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
											>
												<option value={1}>1</option>
												<option value={2}>2</option>
												<option value={3}>3</option>
												<option value={4}>4</option>
												<option value={5}>5</option>
												<option value={6}>6</option>
												<option value={7}>7</option>
												<option value={8}>8</option>
											</select>
										</form>
									) : (
										<div class="text-gray-800">
											<span class="mr-1">{$localize`Quantity`}</span>
											<span class="font-medium">{line.quantity}</span>
										</div>
									)}
									<div class="flex-1"></div>
									<div class="flex">
										{isInEditableUrl && (
											<button
												value={line.id}
												class="font-medium text-primary-600 hover:text-primary-500"
												onClick$={async () => {
													appState.activeOrder = await removeOrderLineMutation(line.id);
													if (
														appState.activeOrder?.lines?.length === 0 &&
														isCheckoutPage(location.url.toString())
													) {
														appState.showCart = false;
														navigate(`/`);
													}
												}}
											>
												{$localize`Remove`}
											</button>
										)}
									</div>
								</div>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
});
