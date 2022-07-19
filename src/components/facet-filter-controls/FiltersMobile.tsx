import { component$, PropFunction } from '@builder.io/qwik';

export default component$<{ onToggleMenu$: PropFunction<() => void> }>(({ onToggleMenu$ }) => {
	return (
		<div class="relative z-40 lg:hidden" id="headlessui-dialog-4" role="dialog" aria-modal="true">
			<div class="fixed inset-0 bg-black bg-opacity-25 opacity-100"></div>
			<div class="fixed inset-0 flex z-40">
				<div
					class="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto translate-x-0"
					id="headlessui-dialog-panel-7"
				>
					<div class="px-4 flex items-center justify-between">
						<h2 class="text-lg font-medium text-gray-900">Filters</h2>
						<button
							type="button"
							class="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400"
							onClick$={onToggleMenu$}
						>
							<span class="sr-only">Close menu</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								aria-hidden="true"
								class="h-6 w-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</button>
					</div>
					<form method="get" action="/collections/computers" class="mt-4 border-t border-gray-200">
						<input type="hidden" name="q" value="" />
						<div class="border-t border-gray-200 px-4 py-6">
							<h3 class="-mx-2 -my-3 flow-root">
								<button
									class="px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500"
									id="headlessui-disclosure-button-8"
									type="button"
									aria-expanded="true"
									aria-controls="headlessui-disclosure-panel-9"
								>
									<span class="font-medium text-gray-900 uppercase">brand</span>
									<span class="ml-6 flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											aria-hidden="true"
											class="h-5 w-5"
										>
											<path
												fill-rule="evenodd"
												d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
												clip-rule="evenodd"
											></path>
										</svg>
									</span>
								</button>
							</h3>
							<div class="pt-6" id="headlessui-disclosure-panel-9">
								<div class="space-y-6">
									<div class="flex items-center">
										<input
											id="filter-mobile-2-0"
											name="fvid"
											type="checkbox"
											class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
											value="3"
										/>
										<label class="ml-3 min-w-0 flex-1 text-gray-500">Apple</label>
									</div>
									<div class="flex items-center">
										<input
											id="filter-mobile-2-1"
											name="fvid"
											type="checkbox"
											class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
											value="4"
										/>
										<label class="ml-3 min-w-0 flex-1 text-gray-500">Logitech</label>
									</div>
									<div class="flex items-center">
										<input
											id="filter-mobile-2-2"
											name="fvid"
											type="checkbox"
											class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
											value="5"
										/>
										<label class="ml-3 min-w-0 flex-1 text-gray-500">Samsung</label>
									</div>
									<div class="flex items-center">
										<input
											id="filter-mobile-2-3"
											name="fvid"
											type="checkbox"
											class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
											value="6"
										/>
										<label class="ml-3 min-w-0 flex-1 text-gray-500">Corsair</label>
									</div>
									<div class="flex items-center">
										<input
											id="filter-mobile-2-4"
											name="fvid"
											type="checkbox"
											class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
											value="7"
										/>
										<label class="ml-3 min-w-0 flex-1 text-gray-500">ADMI</label>
									</div>
									<div class="flex items-center">
										<input
											id="filter-mobile-2-5"
											name="fvid"
											type="checkbox"
											class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
											value="8"
										/>
										<label class="ml-3 min-w-0 flex-1 text-gray-500">Seagate</label>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
});
