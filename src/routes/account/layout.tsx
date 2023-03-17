import { Slot, component$, useContext, useVisibleTask$ } from '@builder.io/qwik';
import { TabsContainer } from '~/components/account/TabsContainer';
import { APP_STATE } from '~/constants';
import { getActiveCustomerQuery } from '~/graphql/queries';
import { ActiveCustomer } from '~/types';
import { fullNameWithTitle } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const appState = useContext(APP_STATE);

	useVisibleTask$(async () => {
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
		<div class="px-4 min-h-screen">
			<div class="max-w-6xl m-auto flex items-baseline justify-between mb-8">
				<p class="text-gray-700 text-2xl mt-8 mr-4">
					Welcome back, {fullNameWithTitle(appState.customer)}
				</p>
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
