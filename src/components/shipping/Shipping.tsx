import {
	$,
	component$,
	PropFunction,
	QwikChangeEvent,
	useClientEffect$,
	useContext,
} from '@builder.io/qwik';
import { APP_STATE } from '~/constants';
import { getActiveOrderQuery } from '~/graphql/queries';
import { ActiveCustomer, ActiveOrder } from '~/types';
import { execute } from '~/utils/api';
import LockClosedIcon from '../icons/LockClosedIcon';
import ShippingMethodSelector from '../shipping-method-selector/ShippingMethodSelector';

export default component$<{
	onForward$: PropFunction<(customer: Omit<ActiveCustomer, 'id'>) => Promise<void>>;
}>(({ onForward$ }) => {
	const appState = useContext(APP_STATE);
	useClientEffect$(async () => {
		const { activeOrder } = await execute<{ activeOrder: ActiveOrder }>(getActiveOrderQuery());
		appState.customer =
			activeOrder?.customer || ({ id: '-1', firstName: '', lastName: '' } as ActiveCustomer);
	});
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
								value={appState.customer?.emailAddress}
								disabled={appState.customer?.id !== '-1'}
								onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
									appState.customer.emailAddress = event.target.value;
								})}
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
									value={appState.customer?.firstName}
									disabled={appState.customer?.id !== '-1'}
									onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
										appState.customer.firstName = event.target.value;
									})}
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700">Last name</label>
							<div class="mt-1">
								<input
									type="text"
									value={appState.customer?.lastName}
									disabled={appState.customer?.id !== '-1'}
									onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
										appState.customer.lastName = event.target.value;
									})}
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
					onForward$(appState.customer);
				})}
			>
				<LockClosedIcon />
				<span>Proceed to payment</span>
			</button>
		</div>
	);
});
