import { component$, useContext, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import ShippingAddressCard from '~/components/account/ShippingAddressCard';
import { AddressForm } from '~/components/address-form/AddressFormV2';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import { parseToShippingAddress, updateDefaultAddressInBook } from '~/components/common/address';
import PlusIcon from '~/components/icons/PlusIcon';
import { APP_STATE } from '~/constants';
import { Address } from '~/generated/graphql';
import { getActiveCustomerAddressesQuery } from '~/providers/shop/customer/customer';
import { ShippingAddress } from '~/types';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const activeCustomerAddresses = useSignal<{ addresses: ShippingAddress[] }>();
	const editNewAddress = useSignal<boolean>(false);

	useVisibleTask$(async () => {
		const activeCustomer = await getActiveCustomerAddressesQuery();
		const { id, addresses } = activeCustomer;
		console.log('activeCustomer fetched:', JSON.stringify(activeCustomer, null, 2));
		const addressBook =
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

		activeCustomerAddresses.value = { addresses: addressBook };
		console.log(
			'appState.addressBook before update:',
			JSON.stringify(appState.addressBook, null, 2)
		);

		if (addresses) {
			appState.addressBook.splice(0, appState.addressBook.length);
			appState.addressBook.push(...addressBook);
		}
	});

	return (
		<>
			{activeCustomerAddresses.value ? (
				<div class="max-w-6xl m-auto rounded-lg p-4 space-y-4">
					<div class="flex flex-wrap gap-6 justify-evenly">
						{[...appState.addressBook].map((address) => (
							<div class="min-w-[20rem]" key={address.id}>
								<ShippingAddressCard
									allowDelete={true}
									onDelete$={async (addressId) => {
										appState.addressBook = appState.addressBook.filter((a) => a.id !== addressId);
									}}
									address={address}
									showDefault={true}
									onEditSaved$={async (updated) => {
										appState.addressBook = appState.addressBook.map((a) =>
											a.id === updated.id ? updated : a
										);
										updateDefaultAddressInBook(updated, appState.addressBook);
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
				onForward$={async (address: ShippingAddress) => {
					appState.addressBook = [address, ...appState.addressBook];
					updateDefaultAddressInBook(address, appState.addressBook);
				}}
			/>
		</>
	);
});
