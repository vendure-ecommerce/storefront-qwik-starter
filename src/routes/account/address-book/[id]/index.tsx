import { $, component$, useBrowserVisibleTask$, useContext } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import { TabsContainer } from '~/components/account/TabsContainer';
import AddressForm from '~/components/address-form/AddressForm';
import { Button } from '~/components/buttons/Button';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import CheckIcon from '~/components/icons/CheckIcon';
import XMarkIcon from '~/components/icons/XMarkIcon';
import { APP_STATE } from '~/constants';
import { logoutMutation, updateCustomerAddressMutation } from '~/graphql/mutations';
import { getActiveCustomerAddressesQuery } from '~/graphql/queries';
import { ShippingAddress } from '~/types';
import { scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const navigate = useNavigate();
	const appState = useContext(APP_STATE);
	const location = useLocation();

	useBrowserVisibleTask$(async () => {
		const { activeCustomer } = await execute<{
			activeCustomer: { id: string; addresses: ShippingAddress[] };
		}>(getActiveCustomerAddressesQuery());

		if (!activeCustomer) {
			navigate('/sign-in');
		}

		if (activeCustomer?.addresses) {
			const [activeAddress] = activeCustomer.addresses.filter(
				(address) => address.id === location.params.id
			);
			activeAddress.countryCode = activeAddress?.country?.code;
			appState.shippingAddress = {
				...appState.shippingAddress,
				...activeAddress,
			};
		}

		scrollToTop();
	});

	const fullNameWithTitle = (): string => {
		return [appState.customer?.title, appState.customer?.firstName, appState.customer?.lastName]
			.filter((x) => !!x)
			.join(' ');
	};

	const updateAddress = $(async () => {
		delete appState.shippingAddress.country;
		await execute<{
			updateCustomerAddress: ShippingAddress;
		}>(updateCustomerAddressMutation(appState.shippingAddress));
		navigate('/account/address-book');
	});

	const logout = $(async () => {
		await execute(logoutMutation());
		navigate('/');
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
							<div class="max-w-md">
								<AddressForm shippingAddress={appState.shippingAddress} />
								<div class="flex mt-8">
									<HighlightedButton onClick$={updateAddress}>
										<CheckIcon /> &nbsp; Save
									</HighlightedButton>
									<span class="mr-4" />
									<Button
										onClick$={() => {
											navigate('/account/address-book');
										}}
									>
										<XMarkIcon /> &nbsp; Cancel
									</Button>
								</div>
							</div>
						</div>
					</TabsContainer>
				</div>
			</div>
		</div>
	);
});
