import {
	$,
	component$,
	Slot,
	useBrowserVisibleTask$,
	useContext,
	useSignal,
} from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { TabsContainer } from '~/components/account/TabsContainer';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { logoutMutation } from '~/graphql/mutations';
import { getActiveCustomerQuery, getActiveOrderQuery } from '~/graphql/queries';
import { ActiveCustomer, ActiveOrder } from '~/types';
import { fullNameWithTitle } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const navigate = useNavigate();
	const appState = useContext(APP_STATE);
	const canBeVisible = useSignal(false);

	const logout = $(async () => {
		await execute(logoutMutation());
		// this force an hard refresh
		window.location.href = '/';
	});

	useBrowserVisibleTask$(async () => {
		const { activeOrder } = await execute<{ activeOrder: ActiveOrder }>(getActiveOrderQuery());
		if (activeOrder?.customer) {
			appState.customer = activeOrder?.customer;
		}
		if (appState.customer.id === CUSTOMER_NOT_DEFINED_ID) {
			const { activeCustomer } = await execute<{ activeCustomer: ActiveCustomer }>(
				getActiveCustomerQuery()
			);
			if (activeCustomer) {
				appState.customer = activeCustomer;
			}
		}

		if (appState.customer.id === CUSTOMER_NOT_DEFINED_ID) {
			navigate('/');
		} else {
			canBeVisible.value = true;
		}
	});

	return canBeVisible.value ? (
		<div class="px-4">
			<h2 class="text-3xl sm:text-5xl font-light text-gray-900 my-8">My Account</h2>
			<p class="text-gray-700 text-lg -mt-4">
				Welcome back, {fullNameWithTitle(appState.customer)}
			</p>
			<button onClick$={logout} class="underline my-4 text-primary-600 hover:text-primary-800">
				Sign out
			</button>
			<div class="flex justify-center">
				<div class="w-full text-xl text-gray-500">
					<TabsContainer>
						<Slot />
					</TabsContainer>
				</div>
			</div>
		</div>
	) : null;
});
