import { component$, QRL, useSignal } from '@builder.io/qwik';
import Tooltip from '~/components/tooltip/Tooltip';
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
	onEditSaved$?: QRL<(address: ShippingAddress, authToken: string | undefined) => Promise<void>>;
	showDefault?: boolean;
	allowDelete?: boolean;
	onDelete$?: QRL<(addressId: string) => Promise<void>>;
	className?: string;
	allowEdit?: boolean;
};

export default component$<IProps>(
	({ address, onEditSaved$, showDefault, allowDelete, onDelete$, className, allowEdit = true }) => {
		const openEditForm = useSignal(false);

		return (
			<div class={`max-w-xs bg-white shadow-lg rounded-lg overflow-hidden my-2 ${className}`}>
				<div class="py-2 px-4">
					<div class="flex items-center justify-between">
						<h1 class="text-sm font-semibold ">
							{address.fullName}{' '}
							{address.company && <span class="py-2 text-sm "> - {address.company}</span>}
						</h1>
						{allowDelete && address.id && (
							<button
								class="hover:text-red-600 rounded ml-2"
								title="Delete address"
								aria-label="Delete address"
								type="button"
								onClick$={() => {
									if (onDelete$ && address.id) {
										if (onDelete$) {
											onDelete$(address.id);
										}
									}
								}}
							>
								<TrashCanIcon />
							</button>
						)}
					</div>
					<p class="py-1 text-sm ">{address.streetLine1}</p>
					{address.streetLine2 && <p class="text-sm ">{address.streetLine2}&nbsp;</p>}
					<div class="flex items-center mt-1 ">
						<LocationIcon />
						<h1 class="px-2 text-xs">
							{address.city}, {address.province} {address.postalCode}, {address.countryCode}
						</h1>
					</div>
					<div class="flex items-center mt-1 mb-1 ">
						<>
							<TelephoneIcon />
							<h1 class="px-2 text-xs">{address.phoneNumber || 'N/A'}</h1>
						</>
						<div class="flex-1" />
						{allowEdit && (
							<button
								class="mr-1 rounded "
								onClick$={() => {
									openEditForm.value = true;
								}}
							>
								<PencilEditIcon />
							</button>
						)}
					</div>

					{showDefault && (address.defaultShippingAddress || address.defaultBillingAddress) && (
						<div class="flex text-xs mt-4">
							{address.defaultShippingAddress && (
								<Tooltip text={$localize`Default shipping address`}>
									<ShippingAddressIcon aria-hidden="true" />
								</Tooltip>
							)}
							{address.defaultBillingAddress && (
								<Tooltip text={$localize`Default billing address`}>
									<BillingAddressIcon aria-hidden="true" />
								</Tooltip>
							)}
						</div>
					)}
				</div>
				<AddressForm open={openEditForm} prefilledAddress={address} onForward$={onEditSaved$} />
			</div>
		);
	}
);
