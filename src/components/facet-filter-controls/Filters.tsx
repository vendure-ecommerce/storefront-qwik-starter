import { component$, PropFunction } from '@builder.io/qwik';
import FiltersMobile from './FiltersMobile';

export default component$<{ showMenu: boolean; onToggleMenu$: PropFunction<() => void> }>(
	({ showMenu = false, onToggleMenu$ }) => {
		return (
			<>
				<form method="get" action="/collections/electronics" class="hidden lg:block">
					<input type="hidden" name="q" value="" />
					<div class="border-b border-gray-200 py-6">
						<h3 class="-my-3 flow-root">
							<button
								class="py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400 hover:text-gray-500"
								id="headlessui-disclosure-button-1"
								type="button"
								aria-expanded="true"
								aria-controls="headlessui-disclosure-panel-2"
							>
								<span class="font-medium text-gray-900 uppercase">category</span>
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
						<div class="pt-6" id="headlessui-disclosure-panel-2">
							<div class="space-y-4">
								<div class="flex items-center">
									<input
										type="checkbox"
										id="filter-1-0"
										name="fvid"
										class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
										value="2"
									/>
									<label class="ml-3 text-sm text-gray-600">Computers</label>
								</div>
								<div class="flex items-center">
									<input
										type="checkbox"
										id="filter-1-1"
										name="fvid"
										class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
										value="9"
									/>
									<label class="ml-3 text-sm text-gray-600">Photo</label>
								</div>
							</div>
						</div>
					</div>
					<div class="border-b border-gray-200 py-6">
						<h3 class="-my-3 flow-root">
							<button
								class="py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400 hover:text-gray-500"
								id="headlessui-disclosure-button-3"
								type="button"
								aria-expanded="true"
								aria-controls="headlessui-disclosure-panel-4"
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
						<div class="pt-6" id="headlessui-disclosure-panel-4">
							<div class="space-y-4">
								<div class="flex items-center">
									<input
										type="checkbox"
										id="filter-2-0"
										name="fvid"
										class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
										value="3"
									/>
									<label class="ml-3 text-sm text-gray-600">Apple</label>
								</div>
								<div class="flex items-center">
									<input
										type="checkbox"
										id="filter-2-1"
										name="fvid"
										class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
										value="4"
									/>
									<label class="ml-3 text-sm text-gray-600">Logitech</label>
								</div>
								<div class="flex items-center">
									<input
										type="checkbox"
										id="filter-2-2"
										name="fvid"
										class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
										value="5"
									/>
									<label class="ml-3 text-sm text-gray-600">Samsung</label>
								</div>
								<div class="flex items-center">
									<input
										type="checkbox"
										id="filter-2-3"
										name="fvid"
										class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
										value="6"
									/>
									<label class="ml-3 text-sm text-gray-600">Corsair</label>
								</div>
								<div class="flex items-center">
									<input
										type="checkbox"
										id="filter-2-4"
										name="fvid"
										class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
										value="7"
									/>
									<label class="ml-3 text-sm text-gray-600">ADMI</label>
								</div>
								<div class="flex items-center">
									<input
										type="checkbox"
										id="filter-2-5"
										name="fvid"
										class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
										value="8"
									/>
									<label class="ml-3 text-sm text-gray-600">Seagate</label>
								</div>
								<div class="flex items-center">
									<input
										type="checkbox"
										id="filter-2-6"
										name="fvid"
										class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
										value="10"
									/>
									<label class="ml-3 text-sm text-gray-600">Polaroid</label>
								</div>
								<div class="flex items-center">
									<input
										type="checkbox"
										id="filter-2-7"
										name="fvid"
										class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
										value="11"
									/>
									<label class="ml-3 text-sm text-gray-600">Nikkon</label>
								</div>
								<div class="flex items-center">
									<input
										type="checkbox"
										id="filter-2-8"
										name="fvid"
										class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
										value="12"
									/>
									<label class="ml-3 text-sm text-gray-600">Agfa</label>
								</div>
								<div class="flex items-center">
									<input
										type="checkbox"
										id="filter-2-9"
										name="fvid"
										class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
										value="13"
									/>
									<label class="ml-3 text-sm text-gray-600">Manfrotto</label>
								</div>
								<div class="flex items-center">
									<input
										type="checkbox"
										id="filter-2-10"
										name="fvid"
										class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
										value="14"
									/>
									<label class="ml-3 text-sm text-gray-600">Kodak</label>
								</div>
								<div class="flex items-center">
									<input
										type="checkbox"
										id="filter-2-11"
										name="fvid"
										class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
										value="15"
									/>
									<label class="ml-3 text-sm text-gray-600">Sony</label>
								</div>
								<div class="flex items-center">
									<input
										type="checkbox"
										id="filter-2-12"
										name="fvid"
										class="h-4 w-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
										value="16"
									/>
									<label class="ml-3 text-sm text-gray-600">Rolleiflex</label>
								</div>
							</div>
						</div>
					</div>
				</form>
				{!!showMenu ? 'yes' : 'no'}
				{!!showMenu ? <FiltersMobile onToggleMenu$={onToggleMenu$} /> : <></>}
			</>
		);
	}
);
