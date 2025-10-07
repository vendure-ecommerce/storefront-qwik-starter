import {
	component$,
	QRL,
	Signal,
	useComputed$,
	useContext,
	useSignal,
	useStore,
	useVisibleTask$,
} from '@qwik.dev/core';
import { useLocation, useNavigate } from '@qwik.dev/router';
import { APP_STATE } from '~/constants';
import { Order } from '~/generated/graphql';

import { adjustOrderLineMutation, removeOrderLineMutation } from '~/providers/shop/orders/order';
import { useFilamentColor, useFontMenu } from '~/routes/layout';
import { isCheckoutPage } from '~/utils';
import CartContentCard from './CartContentCard';

export default component$<{
	order?: Order;
	onOrderLineChange$?: QRL<() => Promise<void>>;
	readyToProceedSignal: Signal<boolean>;
}>(({ order, onOrderLineChange$: onOrderLineChange$, readyToProceedSignal }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const appState = useContext(APP_STATE);
	const currentOrderLineSignal = useSignal<{ id: string; value: number }>();
	const rowsSignal = useComputed$(() => order?.lines || appState.activeOrder?.lines || []);
	const isInEditableUrl = !isCheckoutPage(location.url.toString()) || !order;
	const currencyCode = order?.currencyCode || appState.activeOrder?.currencyCode || 'USD';
	const adjustOrderLineFailedSignal = useStore<{ errorCode: string; message: string }>({
		errorCode: '',
		message: '',
	});

	const FilamentColorSignal = useFilamentColor(); // Load the Filament_Color from db
	const FontMenuSignal = useFontMenu();

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
					<CartContentCard
						key={line.id}
						line={line}
						currencyCode={currencyCode}
						isInEditableUrl={isInEditableUrl}
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
});
