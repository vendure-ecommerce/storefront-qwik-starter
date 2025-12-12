import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import ShippingAddressCard from '~/components/account/ShippingAddressCard';
import { AddressForm } from '~/components/address-form/AddressFormV2';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import {
	createOrUpdateAddress,
	parseToShippingAddress,
	updateDefaultAddressInBook,
} from '~/components/common/address';
import PlusIcon from '~/components/icons/PlusIcon';
import { Address } from '~/generated/graphql';
import {
	deleteCustomerAddressMutation,
	getActiveCustomerAddressesQuery,
} from '~/providers/shop/customer/customer';
import { ShippingAddress } from '~/types';

export default component$(() => {
	const activeCustomerAddresses = useSignal<{ addresses: ShippingAddress[] }>();
	const addressBook = useSignal<ShippingAddress[]>([]);
	const editNewAddress = useSignal<boolean>(false);

	useVisibleTask$(async () => {
		const activeCustomer = await getActiveCustomerAddressesQuery();
		const { addresses } = activeCustomer;
		console.log('activeCustomer fetched:', JSON.stringify(activeCustomer, null, 2));
		const fetchedAddresses =
			addresses
				?.slice()
				.filter((address: Address) => !!address.id)
				.sort((a: Address, b: Address) => {
					// Sort by defaultShippingAddress
					if (a.defaultShippingAddress && !b.defaultShippingAddress) return -1;
					if (!a.defaultShippingAddress && b.defaultShippingAddress) return 1;
					// Sort by defaultBillingAddress
					if (a.defaultBillingAddress && !b.defaultBillingAddress) return -1;
					if (!a.defaultBillingAddress && b.defaultBillingAddress) return 1;
					// Sort by createdAt desc
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				})
				.map((address: Address) => parseToShippingAddress(address)) || [];

		addressBook.value = fetchedAddresses;
		activeCustomerAddresses.value = { addresses: fetchedAddresses };
	});

	return (
		<>
			{activeCustomerAddresses.value ? (
				<div class="max-w-6xl m-auto rounded-lg p-4 space-y-4">
					<div class="flex flex-wrap gap-6 justify-evenly">
						{[...addressBook.value].map((address) => (
							<div class="min-w-[20rem]" key={address.id}>
								<ShippingAddressCard
									allowDelete={true}
									onDelete$={async (addressId) => {
										deleteCustomerAddressMutation(addressId);

										addressBook.value = addressBook.value.filter((a) => a.id !== addressId);
									}}
									address={address}
									showDefault={true}
									onEditSaved$={async (
										updatedAddress: ShippingAddress,
										authToken: string | undefined
									) => {
										await createOrUpdateAddress(
											// note that here we only do the update as the address book is from customer, so they must have id
											updatedAddress,
											authToken
										);
										addressBook.value = addressBook.value.map((a) =>
											a.id === updatedAddress.id ? updatedAddress : a
										);
										updateDefaultAddressInBook(updatedAddress, addressBook.value);
									}}
								/>
							</div>
						))}
					</div>
				</div>
			) : (
				<div class="h-[100vh]" />
			)}
			<div class="flex justify-center">
				<HighlightedButton
					onClick$={() => {
						editNewAddress.value = true;
					}}
				>
					<PlusIcon /> &nbsp; {$localize`New Address`}
				</HighlightedButton>
			</div>
			<AddressForm
				open={editNewAddress}
				onForward$={async (address: ShippingAddress, authToken: string | undefined) => {
					await createOrUpdateAddress(
						// note that here we only do the update as the address book is from customer, so they must have id
						address,
						authToken
					);
					addressBook.value = [address, ...addressBook.value];
					updateDefaultAddressInBook(address, addressBook.value);
				}}
			/>
		</>
	);
});
