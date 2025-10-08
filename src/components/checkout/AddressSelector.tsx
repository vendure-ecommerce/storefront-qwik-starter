import { component$, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { Address } from '~/generated/graphql';
import {
	deleteCustomerAddressMutation,
	getActiveCustomerAddressesQuery,
} from '~/providers/shop/customer/customer';
import { ShippingAddress } from '~/types';
import ShippingAddressCard from '../account/ShippingAddressCard';
import {
	createOrUpdateAddress,
	parseToShippingAddress,
	updateDefaultAddressInBook,
} from '../common/address';
import DropDownIcon from '../icons/DropDownIcon';

interface AddressSelectorProps {
	onSelectAddress$: (address: ShippingAddress) => void;
}

export default component$<AddressSelectorProps>(({ onSelectAddress$ }) => {
	const addressBook = useSignal<ShippingAddress[]>([]);
	const selectedId = useSignal<string>('');
	const open = useSignal<boolean>(false);

	useVisibleTask$(async () => {
		const activeCustomer = await getActiveCustomerAddressesQuery();
		addressBook.value =
			activeCustomer?.addresses
				?.slice()
				.filter((address: Address) => !!address.id)
				.sort((a: Address, b: Address) => {
					if (a.defaultShippingAddress && !b.defaultShippingAddress) return -1;
					if (!a.defaultShippingAddress && b.defaultShippingAddress) return 1;
					if (a.defaultBillingAddress && !b.defaultBillingAddress) return -1;
					if (!a.defaultBillingAddress && b.defaultBillingAddress) return 1;
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				})
				.map((address: Address) => parseToShippingAddress(address)) || [];
		if (addressBook.value.length > 0) {
			selectedId.value = addressBook.value[0].id || '';
			await onSelectAddress$(addressBook.value[0]);
		}
	});

	return (
		<div class="p-2 m-2">
			<div>
				<div class="flex items-center justify-center gap-2">
					<button
						type="button"
						class="flex items-center text-blue-500 text-sm"
						onClick$={() => (open.value = !open.value)}
						aria-expanded={open.value}
						aria-haspopup="listbox"
					>
						{$localize`Select from saved address`}
						<DropDownIcon />
					</button>
				</div>

				<div class="flex items-center justify-center gap-2">
					<div
						class={`${open.value ? 'block' : 'hidden'} mt-2 z-10 w-80 max-w-md rounded shadow-lg bg-white border`}
					>
						<ul class="max-h-80 overflow-y-auto p-2" role="listbox">
							{addressBook.value.map((address) => (
								<li key={address.id} class="mb-0.5">
									<div class="flex items-center">
										<input
											type="radio"
											name="shippingAddress"
											class="m-1 mr-2"
											checked={selectedId.value === address.id}
											onChange$={async () => {
												selectedId.value = address.id || '';
												open.value = false;
												await onSelectAddress$(address);
											}}
										/>
										<div
											class={`${selectedId.value === address.id ? 'border-2 border-blue-500' : 'border border-transparent'} flex-1 p-1 hover:border-blue-300 transition cursor-pointer`}
										>
											<div class="p-1">
												<ShippingAddressCard
													address={address}
													showDefault={true}
													onEditSaved$={async (address, authToken) => {
														updateDefaultAddressInBook(address, addressBook.value);
														await createOrUpdateAddress(
															// note that here we only do the update as the address book is from customer, so they must have id
															address,
															authToken
														);
														addressBook.value = addressBook.value.map((a) =>
															a.id === address.id ? address : a
														);
														selectedId.value = address.id || '';
														await onSelectAddress$(address);
													}}
													allowDelete={true}
													onDelete$={async (addressId) => {
														deleteCustomerAddressMutation(addressId);
														addressBook.value = addressBook.value.filter((a) => a.id !== addressId);
														if (selectedId.value === addressId) {
															selectedId.value = '';
														}
													}}
												/>
											</div>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
});
