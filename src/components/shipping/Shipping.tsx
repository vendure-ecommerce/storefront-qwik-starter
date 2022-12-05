import { $, component$, PropFunction } from '@builder.io/qwik';
import LockClosedIcon from '../icons/LockClosedIcon';
import ShippingMethodSelector from '../shipping-method-selector/ShippingMethodSelector';

export default component$<{ onForward$: PropFunction<() => void> }>(({ onForward$ }) => {
	return (
		<div>
			<div>
				<h2 class="text-lg font-medium text-gray-900">Contact information</h2>
				<form>
					<div class="mt-4">
						<label class="block text-sm font-medium text-gray-700">Email address</label>
						<div class="mt-1">
							<input
								type="email"
								value="test@vendure.io"
								disabled
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							/>
						</div>
					</div>
					<div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
						<div>
							<label class="block text-sm font-medium text-gray-700">First name</label>
							<div class="mt-1">
								<input
									type="text"
									value="John"
									disabled
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700">Last name</label>
							<div class="mt-1">
								<input
									type="text"
									value="Doe"
									disabled
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>
						</div>
					</div>
				</form>
			</div>

			<div class="mt-10 border-t border-gray-200 pt-10">
				<ShippingMethodSelector />
			</div>

			<button
				class="bg-primary-600 hover:bg-primary-700 flex w-full items-center justify-center space-x-2 mt-24 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
				onClick$={$(async () => {
					onForward$();
				})}
			>
				<LockClosedIcon />
				<span>Proceed to payment</span>
			</button>
		</div>
	);
});
