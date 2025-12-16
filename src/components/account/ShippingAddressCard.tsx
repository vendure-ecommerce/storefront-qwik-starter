import { component$, QRL, useSignal } from '@builder.io/qwik';
import {
	LuCreditCard,
	LuMapPin,
	LuPenLine,
	LuPhone,
	LuTrash,
	LuTruck,
} from '@qwikest/icons/lucide';
import { ShippingAddress } from '~/types';
import { AddressForm } from '../address-form/AddressFormV2';

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
			<div class={`card shadow-sm ${className}`}>
				<div class="card-body card-border shadow-lg">
					<div class="flex items-center justify-between">
						<h2 class="text-sm font-semibold ">
							{address.fullName}{' '}
							{address.company && <span class="py-2 text-sm "> - {address.company}</span>}
						</h2>
						{allowDelete && address.id && (
							<button
								class="btn btn-soft btn-md btn-error"
								title={$localize`Delete Address`}
								aria-label={$localize`Delete Address`}
								type="button"
								onClick$={() => {
									if (onDelete$ && address.id) {
										if (onDelete$) {
											onDelete$(address.id);
										}
									}
								}}
							>
								<LuTrash class="w-4 h-4" />
							</button>
						)}
					</div>
					{showDefault && (address.defaultShippingAddress || address.defaultBillingAddress) && (
						<div class="flex text-xs gap-3">
							{address.defaultShippingAddress && (
								<div class="tooltip" data-tip={$localize`Default shipping address`}>
									<LuTruck class="w-4 h-4" />
								</div>
							)}
							{address.defaultBillingAddress && (
								<div class="tooltip" data-tip={$localize`Default billing address`}>
									<LuCreditCard class="w-4 h-4" />
								</div>
							)}
						</div>
					)}
					<p class="py-1 text-sm ">{address.streetLine1}</p>
					{address.streetLine2 && <p class="text-sm ">{address.streetLine2}&nbsp;</p>}
					<div class="flex items-center mt-1 ">
						<LuMapPin class="w-4 h-4" />
						<h1 class="px-2 text-xs">
							{address.city}, {address.province} {address.postalCode}, {address.countryCode}
						</h1>
					</div>
					<div class="flex items-center mt-1 mb-1 ">
						<>
							<LuPhone class="w-4 h-4" />
							<h1 class="px-2 text-xs">{address.phoneNumber || 'N/A'}</h1>
						</>
						<div class="flex-1" />
						{allowEdit && (
							<button
								class="btn btn-soft btn-md"
								title={$localize`Edit Address`}
								onClick$={() => {
									openEditForm.value = true;
								}}
							>
								<LuPenLine class="w-4 h-4" />
							</button>
						)}
					</div>
				</div>
				<AddressForm open={openEditForm} prefilledAddress={address} onForward$={onEditSaved$} />
			</div>
		);
	}
);
