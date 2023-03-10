import { $, component$, useBrowserVisibleTask$, useContext, useSignal } from '@builder.io/qwik';
import AddressCard from '~/components/account/AddressCard';
import { TabsContainer } from '~/components/account/TabsContainer';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import PlusIcon from '~/components/icons/PlusIcon';
import { APP_STATE } from '~/constants';
import { logoutMutation } from '~/graphql/mutations';
import { getActiveCustomerAddressesQuery } from '~/graphql/queries';
import { ShippingAddress } from '~/types';
import { scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const activeCustomerAddresses = useSignal<{ id: string; addresses: ShippingAddress[] }>();

	useBrowserVisibleTask$(async () => {
		const { activeCustomer } = await execute<{
			activeCustomer: { id: string; addresses: ShippingAddress[] };
		}>(getActiveCustomerAddressesQuery());

		if (!activeCustomer) {
			window.location.href = '/sign-in';
		}

		activeCustomerAddresses.value = activeCustomer;

		if (activeCustomer?.addresses) {
			appState.addressBook.splice(0, appState.addressBook.length);
			appState.addressBook.push(...activeCustomer.addresses);
		}
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
	return activeCustomerAddresses.value ? (
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
							<div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md md:max-w-6xl mx-auto">
								{[...appState.addressBook].map((address) => (
									<div key={address.id}>
										<AddressCard address={address} />
									</div>
								))}
							</div>
							<HighlightedButton onClick$={() => {}}>
								<PlusIcon /> &nbsp; New Address
							</HighlightedButton>
						</div>
					</TabsContainer>
				</div>
			</div>
		</div>
	) : (
		<div style="height: 100vh" />
	);
});
