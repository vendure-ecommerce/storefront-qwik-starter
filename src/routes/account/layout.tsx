import { Slot, component$, useContext, useVisibleTask$ } from '@qwik.dev/core';
import { TabsContainer } from '~/components/account/TabsContainer';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { fullNameWithTitle } from '~/utils';

export default component$(() => {
	const appState = useContext(APP_STATE);

	useVisibleTask$(async () => {
		// const activeCustomer = await getActiveCustomerQuery();
		// if (activeCustomer) {
		// 	appState.customer = {
		// 		title: activeCustomer.title ?? '',
		// 		firstName: activeCustomer.firstName,
		// 		id: activeCustomer.id,
		// 		lastName: activeCustomer.lastName,
		// 		emailAddress: activeCustomer.emailAddress,
		// 		phoneNumber: activeCustomer.phoneNumber ?? '',
		// 		upvoteReviewIds: activeCustomer.customFields?.upvoteReviews || [],
		// 		downvoteReviewIds: activeCustomer.customFields?.downvoteReviews || [],
		// 	};
		// 	console.log('activeCustomer:', JSON.stringify(appState.customer, null, 2));
		// } else {
		// 	// window.location.href = '/';
		// }
		if (appState.customer.id === CUSTOMER_NOT_DEFINED_ID) {
			// the user should not be here if not logged in, redirect to home
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
