import { $, component$, QRL } from '@builder.io/qwik';
import { FacetWithValues } from '~/types';
import CloseIcon from '../icons/CloseIcon';
import MinusIcon from '../icons/MinusIcon';
import PlusIcon from '../icons/PlusIcon';

export default component$<{
	showMenu: boolean;
	facetsWithValues: FacetWithValues[];
	onToggleMenu$: QRL<() => void>;
	onFilterChange$: QRL<(id: string) => void>;
	onOpenCloseFilter$: QRL<(id: string) => void>;
}>(
	({
		showMenu = false,
		facetsWithValues: _facetsWithValues,
		onToggleMenu$,
		onFilterChange$,
		onOpenCloseFilter$,
	}) => {
		return (
			<div>
				<div class="hidden lg:block">
					{_facetsWithValues.map((facet: FacetWithValues) => (
						<div key={facet.id} class="border-b border-gray-200 py-6">
							<h3 class="-my-3 flow-root">
								<button
									class="py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400 hover:text-gray-500"
									type="button"
								>
									<span class="font-medium text-gray-900 uppercase">{facet.name}</span>
									<span
										class="ml-6 flex items-center"
										onClick$={() => {
											onOpenCloseFilter$(facet.id);
										}}
									>
										{facet.open ? <MinusIcon /> : <PlusIcon />}
									</span>
								</button>
							</h3>
							{facet.open && (
								<div class="pt-6">
									<div class="space-y-4">
										{facet.values.map((value) => (
											<div key={value.id} class="flex items-center cursor-pointer">
												<label class="text-sm text-gray-600">
													<input
														class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
														type="checkbox"
														checked={value.selected}
														onClick$={() => onFilterChange$(value.id)}
													/>
													<span class="ml-3">{value.name}</span>
												</label>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					))}
				</div>
				{showMenu && (
					<div class="relative z-40 lg:hidden">
						<div class="fixed inset-0 bg-black bg-opacity-25 opacity-100"></div>
						<div class="fixed inset-0 flex z-40">
							<div class="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto translate-x-0">
								<div class="px-4 flex items-center justify-between">
									<h2 class="text-lg font-medium text-gray-900">Filters</h2>
									<button
										type="button"
										class="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400"
										onClick$={$(async () => {
											onToggleMenu$();
										})}
									>
										<span class="sr-only">Close menu</span>
										<CloseIcon />
									</button>
								</div>
								<form class="mt-4 border-t border-gray-200">
									{_facetsWithValues.map((facet) => (
										<div key={facet.id} class="border-t border-gray-200 px-4 py-6">
											<h3 class="-mx-2 -my-3 flow-root">
												<button
													class="px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500"
													type="button"
												>
													<span class="font-medium text-gray-900 uppercase">{facet.name}</span>
													<span
														class="ml-6 flex items-center"
														onClick$={() => {
															onOpenCloseFilter$(facet.id);
														}}
													>
														{facet.open ? <MinusIcon /> : <PlusIcon />}
													</span>
												</button>
											</h3>
											{facet.open && (
												<div class="pt-6">
													<div class="space-y-6">
														{facet.values.map((value) => (
															<div key={value.id} class="flex items-center cursor-pointer">
																<input
																	class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
																	type="checkbox"
																	checked={value.selected}
																	onClick$={() => onFilterChange$(value.id)}
																/>
																<label class="ml-3 min-w-0 flex-1 text-gray-500">
																	{value.name}
																</label>
															</div>
														))}
													</div>
												</div>
											)}
										</div>
									))}
								</form>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
);
