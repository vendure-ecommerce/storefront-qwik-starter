import { Slot, component$, useContext, useVisibleTask$ } from '@builder.io/qwik';
import { TabsContainer } from '~/components/account/TabsContainer';
import { APP_STATE } from '~/constants';
import { getActiveCustomerQuery } from '~/providers/shop/customer/customer';
import { fullNameWithTitle } from '~/utils';

export default component$(() => {
	const appState = useContext(APP_STATE);

	useVisibleTask$(async () => {
		const activeCustomer = await getActiveCustomerQuery();
		if (activeCustomer) {
			appState.customer = {
				title: activeCustomer.title ?? '',
				firstName: activeCustomer.firstName,
				id: activeCustomer.id,
				lastName: activeCustomer.lastName,
				emailAddress: activeCustomer.emailAddress,
				phoneNumber: activeCustomer.phoneNumber ?? '',
			};
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
