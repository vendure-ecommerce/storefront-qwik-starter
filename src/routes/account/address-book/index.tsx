import { component$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import AddressCard from '~/components/account/AddressCard';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import PlusIcon from '~/components/icons/PlusIcon';
import { APP_STATE } from '~/constants';
import { Address } from '~/generated/graphql';
import {
	deleteCustomerAddressMutation,
	getActiveCustomerAddressesQuery,
} from '~/providers/shop/customer/customer';
import { ShippingAddress } from '~/types';

export default component$(() => {
	const navigate = useNavigate();
	const appState = useContext(APP_STATE);
	const activeCustomerAddresses = useSignal<{ id: string; addresses: ShippingAddress[] }>();

	useVisibleTask$(async () => {
		const activeCustomer = await getActiveCustomerAddressesQuery();
		const { id, addresses } = activeCustomer;
		const shippingAddresses: ShippingAddress[] = (addresses as Address[]).map(
			(address: Address) =>
				({
					id: address.id,
					fullName: address.fullName,
					streetLine1: address.streetLine1,
					streetLine2: address.streetLine2,
					company: address.company,
					city: address.city,
					province: address.province,
					postalCode: address.postalCode,
					countryCode: address.country.code, // Updated to countryCode
					phoneNumber: address.phoneNumber,
					defaultShippingAddress: address.defaultShippingAddress,
					defaultBillingAddress: address.defaultBillingAddress,
				}) as ShippingAddress
		);
		activeCustomerAddresses.value = { id, addresses: shippingAddresses };

		if (activeCustomer?.addresses) {
			appState.addressBook.splice(0, appState.addressBook.length);
			appState.addressBook.push(...shippingAddresses);
		}
	});

	return activeCustomerAddresses.value ? (
		<div class="max-w-6xl m-auto rounded-lg p-4 space-y-4">
			<div class="flex flex-wrap gap-6 justify-evenly">
				{[...appState.addressBook].map((address) => (
					<div class="min-w-[20rem]" key={address.id}>
						<AddressCard
							address={address}
							onDelete$={async (id) => {
								try {
									await deleteCustomerAddressMutation(id);
									// Optimistically update state without full page reload
									appState.addressBook = appState.addressBook.filter((a) => a.id !== id);
								} catch (error) {
									console.error('Failed to delete address:', error);
								}
							}}
						/>
					</div>
				))}
			</div>
			<div class="flex justify-center">
				<HighlightedButton
					onClick$={() => {
						navigate('/account/address-book/add');
					}}
				>
					<PlusIcon /> &nbsp; New Address
				</HighlightedButton>
			</div>
		</div>
	) : (
		<div class="h-[100vh]" />
	);
});
