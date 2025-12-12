import { component$, useComputed$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { APP_STATE, GUEST_ADDED_ADDRESS_ID } from '~/constants';
import { Address } from '~/generated/graphql';
import { getActiveCustomerAddressesQuery } from '~/providers/shop/customer/customer';
import { ShippingAddress } from '~/types';
import { isGuestCustomer } from '~/utils';
import ShippingAddressCard from '../account/ShippingAddressCard';
import { AddressForm } from '../address-form/AddressFormV2';
import { Button } from '../buttons/Button';
import { HighlightedButton } from '../buttons/HighlightedButton';
import { parseToShippingAddress, updateDefaultAddressInBook } from '../common/address';
import DropDownIcon from '../icons/DropDownIcon';

interface AddressSelectorProps {
	onSelectAddress$: (address: ShippingAddress) => void;
}

export default component$<AddressSelectorProps>(({ onSelectAddress$ }) => {
	const appState = useContext(APP_STATE);
	const selectedAddressId = useSignal<string | null>(null);
	const editNewAddress = useSignal<boolean>(false);
	const newAddressEdited = useSignal<boolean>(false);
	const openSelector = useSignal<boolean>(false);
	const isGuest = useSignal<boolean>(false);

	const selectedAddress = useComputed$(() => {
		return appState.addressBook.find((address) => address.id === selectedAddressId.value);
	});
	isGuest.value = isGuestCustomer(appState);

	useVisibleTask$(async () => {
		const activeCustomer = await getActiveCustomerAddressesQuery();
		const addressBook =
			activeCustomer?.addresses
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
		appState.addressBook = addressBook;

		if (addressBook.length > 0) {
			selectedAddressId.value = addressBook[0].id || null;
		} else {
			if (isGuest.value) {
				console.log('Guest user with no address in address book.');
				if (appState.shippingAddress) {
					appState.addressBook.push({
						...appState.shippingAddress,
						id: GUEST_ADDED_ADDRESS_ID,
					});
					selectedAddressId.value = GUEST_ADDED_ADDRESS_ID;
				} else {
					openSelector.value = true;
				}
			}
		}
	});

	return (
		<div class="flex gap-4">
			<div class="flex-1 flex flex-col items-start px-4">
				{isGuest.value && !newAddressEdited.value && !selectedAddress.value && (
					<HighlightedButton onClick$={() => (editNewAddress.value = true)}>
						{' + ' + $localize`New Address`}
					</HighlightedButton>
				)}
				{selectedAddress.value && (
					<ShippingAddressCard
						address={selectedAddress.value}
						showDefault={true}
						onEditSaved$={async (address) => {
							appState.addressBook = appState.addressBook.map((a) =>
								a.id === address.id ? address : a
							);
							updateDefaultAddressInBook(address, appState.addressBook);
							selectedAddressId.value = address.id || null;
							await onSelectAddress$(address);
						}}
					/>
				)}
			</div>
			{!isGuest.value && ( // Selecting Address is not for guest users
				<div class="flex-1">
					<div>
						<div class="flex items-center gap-2">
							<p>{$localize`Select addresses`}</p>
							<button onClick$={() => (openSelector.value = !openSelector.value)}>
								<DropDownIcon />
							</button>
						</div>
					</div>
					<div class={`overflow-y-auto ${openSelector.value ? 'block' : 'hidden'}`}>
						<ul>
							{appState.addressBook.map((address) => (
								<li key={address.id} class="flex items-center mb-1">
									<input
										type="radio"
										name="shippingAddress"
										class="m-4"
										checked={selectedAddressId.value === address.id}
										onChange$={
											// Note this will only run for the radio input that is being selected, not for the one being deselected.
											() => {
												selectedAddressId.value = address.id || null;
												openSelector.value = false;
												onSelectAddress$(address);
											}
										}
									/>
									<ShippingAddressCard
										address={address}
										showDefault={false}
										onEditSaved$={async (address) => {
											// Update the address in the address book
											appState.addressBook = appState.addressBook.map((a) =>
												a.id === address.id ? address : a
											);
											updateDefaultAddressInBook(address, appState.addressBook);
											await onSelectAddress$(address);
											selectedAddressId.value = address.id || null;
											openSelector.value = false;
										}}
										allowDelete={address.id !== selectedAddressId.value}
										onDelete$={async (addressId) => {
											appState.addressBook = appState.addressBook.filter((a) => a.id !== addressId);
										}}
									/>
								</li>
							))}
							{newAddressEdited.value === false && (
								<li key="add-new" class="flex items-center mb-1">
									<input
										type="radio"
										name="shippingAddress"
										class="m-4"
										checked={selectedAddressId.value === 'add-new'}
										onChange$={() => {
											selectedAddressId.value = 'add-new';
											editNewAddress.value = true;
											openSelector.value = false;
										}}
									/>
									<Button onClick$={() => (editNewAddress.value = true)}>
										{' + ' + $localize`New Address`}
									</Button>
								</li>
							)}
						</ul>
					</div>
				</div>
			)}
			<AddressForm
				open={editNewAddress}
				onForward$={async (newAddress) => {
					selectedAddressId.value = newAddress.id || null;
					appState.addressBook = [newAddress, ...appState.addressBook];
					newAddressEdited.value = true;
					updateDefaultAddressInBook(newAddress, appState.addressBook);
					await onSelectAddress$(newAddress);
					openSelector.value = false;
					editNewAddress.value = false;
				}}
			/>
		</div>
	);
});
