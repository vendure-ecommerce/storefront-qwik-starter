import { $, component$, useBrowserVisibleTask$, useContext } from '@builder.io/qwik';
import { TabsContainer } from '~/components/account/TabsContainer';
import { APP_STATE } from '~/constants';
import { logoutMutation } from '~/graphql/mutations';
import { getActiveCustomerQuery } from '~/graphql/queries';
import { ActiveCustomer } from '~/types';
import { scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const appState = useContext(APP_STATE);

	useBrowserVisibleTask$(async () => {
		const { activeCustomer } = await execute<{ activeCustomer: ActiveCustomer }>(
			getActiveCustomerQuery()
		);
		if (!activeCustomer) {
			window.location.href = '/sign-in';
		}
		appState.customer = activeCustomer;
		scrollToTop();
	});

	const fullNameWithTitle = (): string => {
		return [appState.customer?.title, appState.customer?.firstName, appState.customer?.lastName]
			.filter((x) => !!x)
			.join(' ');
	};

	const logout = $(async () => {
		await execute(logoutMutation());
		window.location.href = '/';
	});
	return (
		<div class="max-w-6xl xl:mx-auto px-4">
			<h2 class="text-3xl sm:text-5xl font-light text-gray-900 my-8">My Account</h2>
			<p class="text-gray-700 text-lg -mt-4">Welcome back, {fullNameWithTitle()}</p>
			<button onClick$={logout} class="underline my-4 text-primary-600 hover:text-primary-800">
				Sign out
			</button>
			<div class="flex justify-center">
				<div class="w-full text-xl text-gray-500">
					<TabsContainer activeTab="address-book">
						<div q:slot="tabContent" class="min-h-[24rem] rounded-lg p-4 space-y-4">
							addresses
						</div>
					</TabsContainer>
				</div>
			</div>
		</div>
	);
});
