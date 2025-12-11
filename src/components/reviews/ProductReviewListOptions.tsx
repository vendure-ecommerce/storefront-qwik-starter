import { Select } from '@qwik-ui/headless';
import { component$, QRL, Signal } from '@qwik.dev/core';
import { LuChevronDown } from '@qwikest/icons/lucide';
import { SortOptionMap } from '~/types';

interface ProductReviewListOptionsProps {
	pageSize: Signal<string>;
	minRating: Signal<string>;
	sortBy: Signal<string>;
	onFilterChange$: QRL<() => void>;
	sortOptionMap: SortOptionMap;
}

export default component$<ProductReviewListOptionsProps>(
	({ pageSize, minRating, sortBy, onFilterChange$, sortOptionMap }) => {
		return (
			<div class="mt-8 flex flex-col gap-4 pb-6">
				<div class="flex flex-col sm:flex-row gap-6">
					{/* Page Size */}
					<Select.Root bind:value={pageSize}>
						<div class="flex items-center gap-2">
							<Select.Label class="text-sm font-medium text-gray-700 whitespace-nowrap">
								Reviews per page:
							</Select.Label>
							<Select.Trigger class="border rounded-md bg-white w-8">
								<LuChevronDown class="ml-2 inline-block w-4 h-4" />
							</Select.Trigger>
						</div>
						<Select.Popover class="select-popover">
							{['5', '10', '20', '50'].map((size) => (
								<Select.Item
									class="select-item-label"
									key={size}
									value={size}
									onClick$={async () => {
										pageSize.value = size;
										await onFilterChange$();
									}}
								>
									{size}
								</Select.Item>
							))}
						</Select.Popover>
					</Select.Root>

					{/* Min Rating Filter */}
					<Select.Root bind:value={minRating}>
						<div class="flex items-center gap-2">
							<Select.Label class="text-sm font-medium text-gray-700 whitespace-nowrap">
								Minimum rating:
							</Select.Label>
							<Select.Trigger class="border rounded-md bg-white w-8">
								<LuChevronDown class="ml-2 inline-block w-4 h-4" />
							</Select.Trigger>
						</div>
						<Select.Popover class="select-popover">
							{[
								{ value: '0', label: 'All' },
								{ value: '1', label: '⭐ 1+' },
								{ value: '2', label: '⭐⭐ 2+' },
								{ value: '3', label: '⭐⭐⭐ 3+' },
								{ value: '4', label: '⭐⭐⭐⭐ 4+' },
								{ value: '5', label: '⭐⭐⭐⭐⭐ 5' },
							].map(({ value, label }) => (
								<Select.Item
									class="select-item-label"
									key={value}
									value={value}
									onClick$={async () => {
										minRating.value = value;
										await onFilterChange$();
									}}
								>
									{label}
								</Select.Item>
							))}
						</Select.Popover>
					</Select.Root>

					{/* Sort By - using sortOptionMap */}
					<Select.Root bind:value={sortBy}>
						<div class="flex items-center gap-2">
							<Select.Label class="text-sm font-medium text-gray-700 whitespace-nowrap">
								Sort by:
							</Select.Label>
							<Select.Trigger class="border rounded-md bg-white w-8">
								<LuChevronDown class="ml-2 inline-block w-4 h-4" />
							</Select.Trigger>
						</div>
						<Select.Popover class="select-popover">
							{Object.entries(sortOptionMap).map(([key, option]) => (
								<Select.Item
									class="select-item-label"
									key={key}
									value={key}
									onClick$={async () => {
										sortBy.value = key;
										await onFilterChange$();
									}}
								>
									{option.label}
								</Select.Item>
							))}
						</Select.Popover>
					</Select.Root>
				</div>
			</div>
		);
	}
);
