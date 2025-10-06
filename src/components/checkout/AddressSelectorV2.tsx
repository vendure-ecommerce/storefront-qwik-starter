import { component$, useComputed$, useContext, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { APP_STATE } from '~/constants';
import { Address } from '~/generated/graphql';
import { getActiveCustomerAddressesQuery } from '~/providers/shop/customer/customer';
import { ShippingAddress } from '~/types';
import ShippingAddressCard from '../account/ShippingAddressCard';
import { AddressForm } from '../address-form/AddressFormV2';
import { Button } from '../buttons/Button';

import { Select } from '@qwik-ui/headless';

interface AddressSelectorProps {
	onSelectAddress$: (address: ShippingAddress) => void;
}

export default component$<AddressSelectorProps>(({ onSelectAddress$ }) => {
	const appState = useContext(APP_STATE);
	const selectedAddressId = useSignal<string>('');
	const editNewAddress = useSignal<boolean>(false);
	const newAddressEdited = useSignal<boolean>(false);

	const selectedAddress = useComputed$(() => {
		return appState.addressBook.find((address) => address.id === selectedAddressId.value);
	});

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
			selectedAddressId.value = addressBook[0].id || '';
		}
	});

	return (
		<div class="flex gap-4">
			<div class="flex-1 flex flex-col items-center justify-start">
				{selectedAddress.value && (
					<ShippingAddressCard
						address={selectedAddress.value}
						showDefault={true}
						onEditSaved$={async (address) => {
							appState.addressBook = appState.addressBook.map((a) =>
								a.id === address.id ? address : a
							);
							updateDefaultAddressInBook(address, appState.addressBook);
							await onSelectAddress$(address);
							selectedAddressId.value = address.id || '';
						}}
					/>
				)}
			</div>
			<div class="flex-1">
				<Select.Root bind:value={selectedAddressId}>
					<Select.Trigger class="w-full" aria-label="Address">
						<span>{'Select an address'}</span>
					</Select.Trigger>
					<Select.Popover class="select-popover">
						{appState.addressBook.map((address) => (
							<Select.Item key={address.id} value={address.id || ''} class="flex items-center mb-1">
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
									}}
								/>
							</Select.Item>
						))}
						{newAddressEdited.value === false && (
							<Select.Item key="add" value="add" class="flex items-center mb-1">
								<Button onClick$={() => (editNewAddress.value = true)}> + New Address</Button>
							</Select.Item>
						)}
					</Select.Popover>
				</Select.Root>
				<AddressForm
					open={editNewAddress}
					onForward$={async (newAddress) => {
						await onSelectAddress$(newAddress);
						selectedAddressId.value = newAddress.id || '';
						appState.addressBook = [newAddress, ...appState.addressBook];
						newAddressEdited.value = true;
					}}
				/>
			</div>
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
