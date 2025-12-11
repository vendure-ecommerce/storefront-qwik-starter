import { $, component$, useContext, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import OrderCard from '~/components/account/OrderCard';
import GeneralListOptions, { GeneralListOptionType } from '~/components/common/GeneralListOptions';
import AnimatedSpinnerIcon from '~/components/icons/AnimatedSpinnerIcon';
import { APP_STATE } from '~/constants';
import { Customer, Order, SortOrder } from '~/generated/graphql';
import { getActiveCustomerOrdersQuery } from '~/providers/shop/customer/customer';
import { batchUpdateShippoFulfillmentStateMutation } from '~/providers/shop/orders/order';
import { getPurchasedVariantForReviewQuery } from '~/providers/shop/orders/review';
import { OrderFilterOptionMap, SortOptionMap } from '~/types';

export const orderHistorySortOptionMap: SortOptionMap = {
	recent: {
		label: 'Most recent',
		sortBy: { createdAt: SortOrder.Desc },
	},
	oldest: {
		label: 'Oldest first',
		sortBy: { createdAt: SortOrder.Asc },
	},
};

export const orderHistoryFilterOptionMap: OrderFilterOptionMap = {
	recentMonth: {
		label: 'Last month',
		filterBy: {
			createdAt: {
				after: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
			},
		},
	},
	last3Months: {
		label: 'Last 3 months',
		filterBy: {
			createdAt: {
				after: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(),
			},
		},
	},
	thisYear: {
		label: 'This year',
		filterBy: {
			createdAt: {
				after: new Date(new Date().getFullYear(), 0, 1).toISOString(),
			},
		},
	},
	allOrders: {
		label: 'All orders',
		filterBy: {},
	},
};

export default component$(() => {
	const appState = useContext(APP_STATE);
	const activeCustomerOrdersSignal = useSignal<Customer>();
	const isLoading = useSignal(true);
	const pageSize = useSignal<string>('5');
	const sortBy = useSignal<string>('recent');
	const filterBy = useSignal<string>('recentMonth');
	const page = useSignal<number>(1);
	const totalItems = useSignal<number | null>(null);

	const listOptions: GeneralListOptionType[] = [
		{
			label: 'Sort by',
			selections: orderHistorySortOptionMap,
			selectedValue: sortBy,
			onChange$: $(() => {
				page.value = 1;
			}),
		},
		{
			label: 'Filter by',
			selections: orderHistoryFilterOptionMap,
			selectedValue: useSignal<string>('allOrders'),
			onChange$: $(() => {
				page.value = 1;
			}),
		},
	];

	useVisibleTask$(async ({ track }) => {
		// react to page, pageSize or sortBy changes
		track(() => [page.value, pageSize.value, sortBy.value, filterBy.value]);
		if (pageSize.value && sortBy.value) {
			isLoading.value = true;
			const take = parseInt(pageSize.value, 10) || 0;
			const listOptions = {
				take,
				skip: Math.max(0, (page.value - 1) * take),
				sort: orderHistorySortOptionMap[sortBy.value]?.sortBy as any,
				filter: orderHistoryFilterOptionMap[filterBy.value]?.filterBy as any,
			};
			try {
				const customerOrders = await getActiveCustomerOrdersQuery(listOptions);
				if (customerOrders) {
					activeCustomerOrdersSignal.value = customerOrders;
					// store total items for pagination controls
					totalItems.value = customerOrders.orders?.totalItems ?? null;
				}
			} catch (error) {
				console.error('Failed to fetch active customer orders:', error);
			} finally {
				isLoading.value = false;
			}
		}
	});

	useVisibleTask$(async () => {
		isLoading.value = true;
		await batchUpdateShippoFulfillmentStateMutation(); // Update shippo fulfillment states on load
		// Refactored: Only fetch if not already present
		if (typeof appState.purchasedVariantsWithReviewStatus === 'undefined') {
			try {
				const getPurchasedVariantForReviewResult = await getPurchasedVariantForReviewQuery();

				if (
					getPurchasedVariantForReviewResult?.__typename === 'PurchasedVariantWithReviewStatusList'
				) {
					appState.purchasedVariantsWithReviewStatus = (
						getPurchasedVariantForReviewResult.items || []
					).map((item) => ({
						variantId: item.variantId,
						canReview: item.canReview,
						notReviewableReason: item.notReviewableReason ?? undefined,
					}));
				}
			} catch (error) {
				console.error('Failed to fetch purchased variant review status:', error);
			}
		}
		isLoading.value = false;
	});

	if (isLoading.value) {
		return (
			<div class="h-[60vh] flex items-center justify-center">
				<p>Loading your orders...</p>
				<AnimatedSpinnerIcon forcedClass="h-48 w-48" />
			</div>
		);
	}

	return activeCustomerOrdersSignal.value ? (
		<GeneralListOptions ListOptions={listOptions} page={page} totalItems={totalItems}>
			<div class="flex flex-wrap gap-6 justify-evenly">
				{(activeCustomerOrdersSignal.value?.orders?.items || []).map((order: Order) => (
					<div key={order.id}>
						<OrderCard order={order} />
					</div>
				))}
			</div>
		</GeneralListOptions>
	) : (
		<div class="h-[100vh]" />
	);

	// return activeCustomerOrdersSignal.value ? (
	// 	<div class="max-w-6xl m-auto rounded-lg p-4 space-y-4">
	// 		<div class="flex justify-center">
	// 			<GeneralListOptions
	// 			ListOptions={listOptions}
	// 			page={page}
	// 			totalItems={totalItems}
	// 			/>
	// 		</div>
	// 		<div class="flex flex-wrap gap-6 justify-evenly">
	// 			{(activeCustomerOrdersSignal.value?.orders?.items || []).map((order: Order) => (
	// 				<div key={order.id}>
	// 					<OrderCard order={order} />
	// 				</div>
	// 			))}
	// 		</div>
	// 		{/* Pagination controls */}
	// 		<div class="flex justify-center items-center gap-3">
	// 			<button
	// 				class="px-3 py-1 rounded border"
	// 				onClick$={() => (page.value = Math.max(1, page.value - 1))}
	// 				disabled={page.value <= 1}
	// 			>
	// 				<LuMoveLeft />
	// 			</button>
	// 			<span class="text-sm">
	// 				Page {page.value}
	// 				{totalItems.value
	// 					? ` of ${Math.max(1, Math.ceil(totalItems.value / (parseInt(pageSize.value, 10) || 1)))}`
	// 					: ''}
	// 			</span>
	// 			<button
	// 				class="px-3 py-1 rounded border"
	// 				onClick$={() => (page.value = page.value + 1)}
	// 				disabled={
	// 					!!(totalItems.value !== null) &&
	// 					page.value >=
	// 					Math.max(1, Math.ceil(totalItems.value / (parseInt(pageSize.value, 10) || 1)))
	// 				}
	// 			>
	// 				<LuMoveRight />
	// 			</button>
	// 		</div>
	// 	</div>
	// ) : (
	// 	<div class="h-[100vh]" />
	// );
});
