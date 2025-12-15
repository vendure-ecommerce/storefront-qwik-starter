import { component$, QRL, Signal, Slot } from '@builder.io/qwik';
import { LuMoveLeft, LuMoveRight } from '@qwikest/icons/lucide';
import GeneralSelector, { GeneralSelectOption } from './GeneralSelector';

interface GeneralListOptionsProps {
	ListOptions: GeneralListOptionType[];
	page: Signal<number>;
	totalItems: Signal<number | null>;
	pageSize?: number;
}
export type GeneralListOptionType = {
	label: string;
	selections: GeneralSelectOption;
	selectedValue: Signal<string>;
	onChange$?: QRL<() => void>;
};

export default component$<GeneralListOptionsProps>(
	({ ListOptions, page, totalItems, pageSize = 10 }) => {
		return (
			<div class="max-w-6xl m-auto rounded-lg p-4 space-y-4">
				<div class="flex justify-center">
					<div class="flex flex-col sm:flex-row gap-6">
						{ListOptions.map((option) => (
							<div class="flex items-center gap-2" key={option.label}>
								<label class="text-sm font-medium whitespace-nowrap flex items-center gap-2">
									<span>{option.label}:</span>
									<GeneralSelector
										options={option.selections}
										selectedValue={option.selectedValue}
										onChange$={option.onChange$}
									/>
								</label>
							</div>
						))}
					</div>
				</div>

				<Slot />

				{/* Pagination controls */}
				<div class="flex justify-center items-center gap-3">
					<button
						class="px-3 py-1 rounded border"
						onClick$={() => (page.value = Math.max(1, page.value - 1))}
						disabled={page.value <= 1}
					>
						<LuMoveLeft />
					</button>
					<span class="text-sm">
						Page {page.value}
						{totalItems.value ? ` of ${Math.max(1, Math.ceil(totalItems.value / pageSize))}` : ''}
					</span>
					<button
						class="px-3 py-1 rounded border"
						onClick$={() => (page.value = page.value + 1)}
						disabled={
							!!(totalItems.value !== null) &&
							page.value >= Math.max(1, Math.ceil(totalItems.value / pageSize))
						}
					>
						<LuMoveRight />
					</button>
				</div>
			</div>
		);
	}
);
