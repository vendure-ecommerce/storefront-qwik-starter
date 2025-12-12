import {
	component$,
	QRL,
	Signal,
	useComputed$,
	useContext,
	useSignal,
	useStore,
	useVisibleTask$,
} from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import { APP_STATE } from '~/constants';
import { Order } from '~/generated/graphql';

import { adjustOrderLineMutation, removeOrderLineMutation } from '~/providers/shop/orders/order';
import { useFilamentColor, useFontMenu } from '~/routes/layout';
import { isCheckoutPage } from '~/utils';
import LineItemCard from './LineItemCard';

interface IProps {
	order?: Order;
	onOrderLineChange$?: QRL<() => Promise<void>>;
	readyToProceedSignal?: Signal<boolean>;
	readOnly?: Signal<boolean>;
	allowReview?: boolean;
}
/**
 * - If `order` prop is provided, the component is in read-only mode.
 *    - This will show the order's lines instead of the appState's activeOrder lines.
 *    - The onOrderLineChange$, readyToProceedSignal, and `readOnly` props will be ignored.
 * - If `order` prop is not provided, this will pull the appState.activeOrder lines,
 * 		and the component is in editable mode.
 * 		- if `readOnly` is set to false (default), the user can edit the cart
 *      - This will allow quantity changes and line item removals.
 *      - The onOrderLineChange$ callback will be called after an order line is successfully changed.
 */
export default component$<IProps>(
	({
		order,
		onOrderLineChange$,
		readyToProceedSignal = useSignal(true),
		readOnly = useSignal(false),
		allowReview = false,
	}) => {
		const navigate = useNavigate();
		const location = useLocation();
		const appState = useContext(APP_STATE);
		const currentOrderLineSignal = useSignal<{ id: string; value: number }>();
		const rowsSignal = useComputed$(() => order?.lines || appState.activeOrder?.lines || []);
		const adjustOrderLineFailedSignal = useStore<{ errorCode: string; message: string }>({
			errorCode: '',
			message: '',
		});
		const FilamentColorSignal = useFilamentColor(); // Load the Filament_Color from db
		const FontMenuSignal = useFontMenu();

		// If order is passed as prop, it's in read-only mode
		if (order) {
			readOnly.value = true;
		}
		const currencyCode = order?.currencyCode || appState.activeOrder?.currencyCode || 'USD';

		const variantsWithReviewStatus = appState.purchasedVariantsWithReviewStatus || [];

		const reviewLocation = `${order?.shippingAddress?.city || ''}, ${order?.shippingAddress?.province || ''}`;

		useVisibleTask$(async ({ track }) => {
			track(() => currentOrderLineSignal.value);
			if (currentOrderLineSignal.value) {
				const res = await adjustOrderLineMutation(
					currentOrderLineSignal.value!.id,
					currentOrderLineSignal.value!.value
				);
				if (res.__typename === 'Order') {
					appState.activeOrder = res as Order;
					adjustOrderLineFailedSignal.errorCode = '';
					adjustOrderLineFailedSignal.message = '';
				} else {
					// Handle error case
					readyToProceedSignal.value = false;
					adjustOrderLineFailedSignal.errorCode = res.errorCode;
					adjustOrderLineFailedSignal.message = res.message;
				}

				if (onOrderLineChange$) {
					await onOrderLineChange$();
				}
			}
		});

		return (
			<div class="flow-root">
				<ul class="-my-6 divide-y divide-gray-200">
					{rowsSignal.value.map((line) => (
						<LineItemCard
							key={line.id}
							line={line}
							currencyCode={currencyCode}
							readOnly={readOnly}
							allowReview={allowReview}
							notReviewableReasonFixed={
								variantsWithReviewStatus.find(
									(v) => v.variantId === line.productVariant.id && !v.canReview
								)?.notReviewableReason || undefined
							}
							reviewLocation={reviewLocation}
							filamentColorSignal={FilamentColorSignal}
							fontMenuSignal={FontMenuSignal}
							onQuantityChange$={async (id, value) => {
								currentOrderLineSignal.value = { id, value };
							}}
							onRemove$={async (id) => {
								const res = await removeOrderLineMutation(id);
								if (res) {
									appState.activeOrder = res;
								}
								if (
									appState.activeOrder?.lines?.length === 0 &&
									isCheckoutPage(location.url.toString())
								) {
									appState.showCart = false;
									navigate(`/`);
								}
							}}
						/>
					))}
				</ul>
				{adjustOrderLineFailedSignal.errorCode && (
					<div class="mt-4 p-4 bg-red-100 text-red-800 rounded">
						<strong class="font-bold">Error: </strong>
						<span>{adjustOrderLineFailedSignal.message}</span>
						{/* refresh page button */}
						<button
							class="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
							onClick$={async () => {
								navigate(0);
							}}
						>
							{$localize`Refresh the page to see the correct quantity`}
						</button>
					</div>
				)}
			</div>
		);
	}
);
