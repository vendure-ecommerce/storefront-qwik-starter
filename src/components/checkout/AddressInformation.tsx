import { component$, useComputed$, useContext, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { APP_STATE } from '~/constants';
import { ShippingAddress } from '~/types';
import { isGuestCustomer } from '~/utils';
import ShippingAddressCard from '../account/ShippingAddressCard';
import { AddressForm } from '../address-form/AddressFormV2';
import { HighlightedButton } from '../buttons/HighlightedButton';
import PlusIcon from '../icons/PlusIcon';
import AddressSelector from './AddressSelector';

interface AddressInformationProps {
	mode?: 'SHIPPING' | 'BILLING';
}

/**
 * This in charge of changing the appState.shippingAddress
 * There is two distinct behaviors for guest and logged in customers
 * - Guest:
 *     - can only add/edit a single shipping address, stored in appState.shippingAddress
 *     - Adding new address or editing existing address with a button
 * - Logged in customer: can select from address book or add a new one.
 *     - Selected address is stored in appState.shippingAddress and also should be in appState.addressBook
 *     - Adding new address or update existing one is done in the AddressSelector component
 */
export default component$<AddressInformationProps>(({ mode = 'SHIPPING' }) => {
	const appState = useContext(APP_STATE);
	const isGuest = useSignal<boolean>(false);
	const openNewAddress = useSignal<boolean>(false);
	const guestHasAddedAddress = useSignal<boolean>(false);
	const currentShipping = useComputed$(() => appState.shippingAddress as ShippingAddress);

	useVisibleTask$(() => {
		isGuest.value = isGuestCustomer(appState);
		if (isGuest.value && currentShipping.value.streetLine1) {
			guestHasAddedAddress.value = true;
		}
	});

	return (
		<div class="max-w-6xl m-auto p-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Left panel: current shipping address or button to add */}

				<div class="bg-white rounded p-4">
					{currentShipping.value.streetLine1 ? (
						<>
							<ShippingAddressCard
								address={currentShipping.value}
								showDefault={!isGuest.value}
								allowEdit={isGuest.value}
								allowDelete={false}
								onEditSaved$={async (address) => {
									appState.shippingAddress = address;
								}}
							/>
						</>
					) : (
						<p class="mb-4 text-sm text-gray-700">{$localize`No shipping address selected`}</p>
					)}
					{isGuest.value && (
						<div
							class={`flex flex-col items-center justify-center p-6 ${guestHasAddedAddress.value ? 'hidden' : 'block'}`}
						>
							<HighlightedButton
								onClick$={() => {
									openNewAddress.value = true;
									guestHasAddedAddress.value = true;
								}}
							>
								<PlusIcon /> {$localize`Shipping Address`}
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
				prefilledAddress={currentShipping.value}
				allowEditDefault={!isGuest.value}
				onForward$={async (address) => {
					appState.shippingAddress = address;
				}}
			/>
		</div>
	);
});
