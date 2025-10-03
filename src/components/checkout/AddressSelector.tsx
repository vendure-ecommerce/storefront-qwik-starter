import { component$, useContext, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { APP_STATE } from '~/constants';
import { Address } from '~/generated/graphql';
import { getActiveCustomerAddressesQuery } from '~/providers/shop/customer/customer';
import { ShippingAddress } from '~/types';
import ShippingAddressCard from '../account/ShippingAddressCard';
import { AddressForm } from '../address-form/AddressFormV2';
import { Button } from '../buttons/Button';

interface AddressSelectorProps {
	onSelectAddress$: (address: ShippingAddress) => void;
}

export default component$<AddressSelectorProps>(({ onSelectAddress$ }) => {
	const appState = useContext(APP_STATE);
	const selectedAddressId = useSignal<string | null>(null);
	const editNewAddress = useSignal<boolean>(false);
	const newAddressEdited = useSignal<boolean>(false);

	useVisibleTask$(async () => {
		const activeCustomer = await getActiveCustomerAddressesQuery();
		const addressBook =
			activeCustomer?.addresses
				?.slice()
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
		}
	});

	return (
		<div>
			<h2>Select Shipping Address</h2>
			<ul>
				{appState.addressBook.map((address) => (
					<li key={address.id} class="flex items-center mb-1">
						<input
							type="radio"
							name="shippingAddress"
							class="m-4"
							checked={selectedAddressId.value === address.id}
							onChange$={() => onSelectAddress$(address)}
						/>
						<ShippingAddressCard address={address} />
					</li>
				))}
				{newAddressEdited.value === false && (
					<li key="add-new" class="flex items-center mb-1">
						<input
							type="radio"
							name="shippingAddress"
							class="m-4"
							checked={selectedAddressId.value === 'add-new'}
							onChange$={() => (editNewAddress.value = true)}
						/>
						<Button onClick$={() => (editNewAddress.value = true)}>Add New Address</Button>
					</li>
				)}
			</ul>
			<AddressForm
				open={editNewAddress}
				onForward$={async (newAddress) => {
					await onSelectAddress$(newAddress);
					newAddress.id = 'added-new';
					selectedAddressId.value = newAddress.id;
					appState.addressBook = [newAddress, ...appState.addressBook];
					newAddressEdited.value = true;
				}}
			/>
		</div>
	);
});

const parseToShippingAddress = (address: Address): ShippingAddress => {
	let country = '';
	let countryCode = '';

	if (address.country !== undefined) {
		country = address.country?.code ?? '';
		countryCode = address.country?.code ?? '';
	}

	return {
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
	};
};
