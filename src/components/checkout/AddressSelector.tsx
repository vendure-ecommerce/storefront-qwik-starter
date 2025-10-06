import { component$, useComputed$, useContext, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { APP_STATE, GUEST_ADDED_ADDRESS_ID } from '~/constants';
import { Address } from '~/generated/graphql';
import { getActiveCustomerAddressesQuery } from '~/providers/shop/customer/customer';
import { ShippingAddress } from '~/types';
import { isGuestCustomer } from '~/utils';
import ShippingAddressCard from '../account/ShippingAddressCard';
import { AddressForm } from '../address-form/AddressFormV2';
import { Button } from '../buttons/Button';
import { HighlightedButton } from '../buttons/HighlightedButton';
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

	const selectedAddress = useComputed$(() => {
		return appState.addressBook.find((address) => address.id === selectedAddressId.value);
	});
	const isGuest = isGuestCustomer(appState);

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
			if (isGuest) {
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
				{isGuest && !newAddressEdited.value && !selectedAddress.value && (
					<HighlightedButton onClick$={() => (editNewAddress.value = true)}>
						+ New Address
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
			{!isGuest && ( // Selecting Address is not for guest users
				<div class="flex-1">
					<div>
						<div class="flex items-center gap-2">
							<p>Select addresses</p>
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
									<Button onClick$={() => (editNewAddress.value = true)}>+ New Address</Button>
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

/**
 * If the given address is set as defaultShippingAddress or defaultBillingAddress,
 * ensure that no other address in the addressBook has the same flag set to true.
 * @param address
 * @param addressBook
 */
const updateDefaultAddressInBook = (
	address: ShippingAddress,
	addressBook: ShippingAddress[]
): void => {
	if (address.defaultShippingAddress) {
		addressBook.forEach((a) => {
			if (a.id !== address.id && a.defaultShippingAddress) {
				a.defaultShippingAddress = false;
			}
		});
	}
	if (address.defaultBillingAddress) {
		addressBook.forEach((a) => {
			if (a.id !== address.id && a.defaultBillingAddress) {
				a.defaultBillingAddress = false;
			}
		});
	}
};

const parseToShippingAddress = (address: Address): ShippingAddress => {
	let country = '';
	let countryCode = '';

	if (address.country !== undefined) {
		country = address.country?.code ?? '';
		countryCode = address.country?.code ?? '';
	}

	return {
		id: address.id,
		city: address.city ?? '',
		company: address.company ?? '',
		country: country,
		countryCode: countryCode,
		fullName: address.fullName ?? '',
		phoneNumber: address.phoneNumber ?? '',
		postalCode: address.postalCode ?? '',
		province: address.province ?? '',
		streetLine1: address.streetLine1 ?? '',
		streetLine2: address.streetLine2 ?? '',
		defaultShippingAddress: address.defaultShippingAddress ?? false,
		defaultBillingAddress: address.defaultBillingAddress ?? false,
	};
};
