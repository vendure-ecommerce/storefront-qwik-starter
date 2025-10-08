import { component$, useComputed$, useContext, useSignal } from '@qwik.dev/core';
import { APP_STATE } from '~/constants';
import { ShippingAddress } from '~/types';
import { isGuestCustomer } from '~/utils';
import ShippingAddressCard from '../account/ShippingAddressCard';
import { AddressForm } from '../address-form/AddressFormV2';
import { HighlightedButton } from '../buttons/HighlightedButton';
import PlusIcon from '../icons/PlusIcon';
import AddressSelector from './AddressSelector';

/**
 * This in charge of changing the appState.shippingAddress
 */
export default component$(() => {
	const appState = useContext(APP_STATE);
	const isGuest = useSignal<boolean>(false);
	const openNewAddress = useSignal<boolean>(false);
	const currentShipping = useComputed$(
		() => appState.shippingAddress as ShippingAddress | undefined
	);

	isGuest.value = isGuestCustomer(appState);

	// computed current shipping address

	return (
		<div class="max-w-6xl m-auto p-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Left panel: current shipping address or button to add */}

				<div class="bg-white rounded p-4">
					{currentShipping.value && currentShipping.value.streetLine1 ? (
						<ShippingAddressCard
							address={currentShipping.value}
							showDefault={false}
							onEditSaved$={async (address) => {
								appState.shippingAddress = address;
							}}
							allowDelete={false}
						/>
					) : (
						<div class="flex flex-col items-center justify-center p-6">
							<p class="mb-4 text-sm text-gray-700">{$localize`No shipping address selected`}</p>
							<HighlightedButton onClick$={() => (openNewAddress.value = true)}>
								<PlusIcon />
								{$localize`New shipping address`}
							</HighlightedButton>
						</div>
					)}
				</div>

				{/* Right panel: address selector for non-guests */}
				<div class="bg-white rounded p-4">
					{!isGuest.value ? (
						<AddressSelector
							onSelectAddress$={async (address) => {
								// set as current shipping address and ensure in addressBook
								appState.shippingAddress = address;
							}}
						/>
					) : (
						<p class="text-sm text-gray-600">{$localize`Sign in to choose from saved addresses`}</p>
					)}
				</div>
			</div>

			<AddressForm
				open={openNewAddress}
				onForward$={async (address) => {
					// Add to appState and set as shipping address
					appState.shippingAddress = address;
					openNewAddress.value = false;
				}}
			/>
		</div>
	);
});
