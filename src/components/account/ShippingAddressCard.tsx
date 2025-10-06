import { component$, QRL, useSignal } from '@qwik.dev/core';
import { deleteCustomerAddressMutation } from '~/providers/shop/customer/customer';
import { ShippingAddress } from '~/types';
import { AddressForm } from '../address-form/AddressFormV2';
import BillingAddressIcon from '../icons/BillingAddressIcon';
import LocationIcon from '../icons/LocationIcon';
import PencilEditIcon from '../icons/PencilEditIcon';
import ShippingAddressIcon from '../icons/ShippingAddressIcon';
import TelephoneIcon from '../icons/TelephoneIcon';
import TrashCanIcon from '../icons/TrashCanIcon';

type IProps = {
	address: ShippingAddress;
	onEditSaved$?: QRL<(address: ShippingAddress) => Promise<void>>;
	showDefault?: boolean;
	allowDelete?: boolean;
	onDelete$?: QRL<(addressId: string) => Promise<void>>;
};

export default component$<IProps>(
	({ address, onEditSaved$, showDefault, allowDelete, onDelete$ }) => {
		const openEditForm = useSignal(false);

		return (
			<div class="max-w-xs bg-white shadow-lg rounded-lg overflow-hidden my-2">
				<div class="py-2 px-4">
					<div class="flex items-center justify-between">
						<h1 class="text-sm font-semibold text-gray-800">
							{address.fullName}{' '}
							{address.company && (
								<span class="py-2 text-sm text-gray-700"> - {address.company}</span>
							)}
						</h1>
						{allowDelete && onDelete$ && address.id && (
							<button
								class="text-gray-400 hover:text-red-600 rounded ml-2"
								title="Delete address"
								aria-label="Delete address"
								type="button"
								onClick$={() => {
									if (onDelete$ && address.id) {
										deleteCustomerAddressMutation(address.id);
										onDelete$(address.id);
									}
								}}
							>
								<TrashCanIcon />
							</button>
						)}
					</div>
					<p class="py-1 text-sm text-gray-700">{address.streetLine1}</p>
					{address.streetLine2 && <p class="text-sm text-gray-700">{address.streetLine2}&nbsp;</p>}
					<div class="flex items-center mt-1 text-gray-700">
						<LocationIcon />
						<h1 class="px-2 text-xs">
							{address.city}, {address.province} {address.postalCode}, {address.countryCode}
						</h1>
					</div>
					<div class="flex items-center mt-1 mb-1 text-gray-700">
						<>
							<TelephoneIcon />
							<h1 class="px-2 text-xs">{address.phoneNumber || 'N/A'}</h1>
						</>
						<div class="flex-1" />
						<button
							class="mr-1 rounded hover:bg-gray-20"
							onClick$={() => {
								openEditForm.value = true;
							}}
						>
							<PencilEditIcon />
						</button>
					</div>

					{showDefault && (address.defaultShippingAddress || address.defaultBillingAddress) && (
						<div class="flex text-xs justify-between mt-4">
							{address.defaultShippingAddress && (
								<div class="flex items-center">
									<ShippingAddressIcon />
									<span class="ml-2">Default Shipping Address</span>
								</div>
							)}
							{address.defaultBillingAddress && (
								<div class="flex items-center">
									<BillingAddressIcon />
									<span class="ml-2">Default Billing Address</span>
								</div>
							)}
						</div>
					)}
				</div>
				<AddressForm open={openEditForm} prefilledAddress={address} onForward$={onEditSaved$} />
			</div>
		);
	}
);
