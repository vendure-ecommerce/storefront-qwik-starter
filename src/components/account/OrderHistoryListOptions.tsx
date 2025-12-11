import { component$, QRL, Signal } from '@qwik.dev/core';
import { orderHistorySortOptionMap } from '~/routes/account/purchase-history';

interface OrderHistoryListOptionsProps {
	pageSize: Signal<string>;
	sortBy: Signal<string>;
	onChange$: QRL<() => void>;
}

export default component$<OrderHistoryListOptionsProps>(({ pageSize, sortBy, onChange$ }) => {
	return (
		<div class="mt-8 flex flex-col gap-4 pb-6">
			<div class="flex flex-col sm:flex-row gap-6">
				{/* Page Size (native select) */}
				<div class="flex items-center gap-2">
					<label class="text-sm font-medium text-gray-500 whitespace-nowrap flex items-center gap-2">
						<span>Orders per page:</span>
						<select
							class="border rounded-md bg-white  text-gray-500 text-sm px-2 w-12 h-6 p-0 m-0"
							value={pageSize.value}
							onChange$={async (e) => {
								pageSize.value = (e.target as HTMLSelectElement).value;
								if (onChange$) await onChange$();
							}}
						>
							{['5', '10', '20', '50'].map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
					</label>
				</div>

				{/* Sort By (native select) */}
				<div class="flex items-center gap-2">
					<label class="text-sm font-medium text-gray-500 whitespace-nowrap flex items-center gap-2">
						<span>Sort by:</span>
						<select
							class="border rounded-md bg-white  text-gray-500 text-sm px-2 w-32 h-6 p-0 m-0"
							value={sortBy.value}
							onChange$={async (e) => {
								sortBy.value = (e.target as HTMLSelectElement).value;
								if (onChange$) await onChange$();
							}}
						>
							{Object.entries(orderHistorySortOptionMap).map(([key, option]) => (
								<option key={key} value={key}>
									{option.label}
								</option>
							))}
						</select>
					</label>
				</div>
			</div>
		</div>
	);
});
