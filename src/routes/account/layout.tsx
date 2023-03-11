import { $, component$, Slot, useBrowserVisibleTask$, useContext } from '@builder.io/qwik';
import { TabsContainer } from '~/components/account/TabsContainer';
import { APP_STATE } from '~/constants';
import { logoutMutation } from '~/graphql/mutations';
import { getActiveCustomerQuery } from '~/graphql/queries';
import { ActiveCustomer } from '~/types';
import { fullNameWithTitle } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const appState = useContext(APP_STATE);

	const logout = $(async () => {
		await execute(logoutMutation());
		// force hard refresh
		window.location.href = '/';
	});

	useBrowserVisibleTask$(async () => {
		const { activeCustomer } = await execute<{ activeCustomer: ActiveCustomer }>(
			getActiveCustomerQuery()
		);
		if (activeCustomer) {
			appState.customer = activeCustomer;
		} else {
			window.location.href = '/';
		}
	});

	return (
		<div class="px-4 h-screen">
			<div class="max-w-6xl m-auto">
				<h2 class="text-3xl md:text-4xl font-light text-gray-900 my-8">My Account</h2>
				<p class="text-gray-700 text-md -mt-4">
					Welcome back, {fullNameWithTitle(appState.customer)}
				</p>
				<button onClick$={logout} class="underline my-4 text-primary-600 hover:text-primary-800">
					Sign out
				</button>
			</div>
			<div class="flex justify-center">
				<div class="w-full text-xl text-gray-500">
					<TabsContainer>
						<Slot />
					</TabsContainer>
				</div>
			</div>
		</div>
	);
});
