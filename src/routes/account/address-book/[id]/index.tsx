import { $, component$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import AddressForm from '~/components/address-form/AddressForm';
import { Button } from '~/components/buttons/Button';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import CheckIcon from '~/components/icons/CheckIcon';
import XMarkIcon from '~/components/icons/XMarkIcon';
import { APP_STATE } from '~/constants';
import { createCustomerAddressMutation, updateCustomerAddressMutation } from '~/graphql/mutations';
import { getActiveCustomerAddressesQuery } from '~/graphql/queries';
import { ShippingAddress } from '~/types';
import { scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const navigate = useNavigate();
	const location = useLocation();
	const appState = useContext(APP_STATE);
	const activeCustomerAddress = useSignal<ShippingAddress>();

	useVisibleTask$(async () => {
		const { activeCustomer } = await execute<{
			activeCustomer: { id: string; addresses: ShippingAddress[] };
		}>(getActiveCustomerAddressesQuery());

		if (activeCustomer?.addresses) {
			const [activeAddress] = activeCustomer.addresses.filter(
				(address) => address.id === location.params.id
			);
			if (activeAddress) {
				activeAddress.countryCode = activeAddress?.country?.code;
				appState.shippingAddress = {
					...appState.shippingAddress,
					...activeAddress,
				};
				activeCustomerAddress.value = activeAddress;
			} else {
				activeCustomerAddress.value = appState.shippingAddress;
			}
		} else {
			activeCustomerAddress.value = appState.shippingAddress;
		}
		scrollToTop();
	});

	const createOrUpdateAddress = $(async () => {
		delete appState.shippingAddress.country;
		if (location.params.id === 'add') {
			await execute<{
				createCustomerAddress: ShippingAddress;
			}>(createCustomerAddressMutation(appState.shippingAddress));
		} else {
			await execute<{
				updateCustomerAddress: ShippingAddress;
			}>(updateCustomerAddressMutation(appState.shippingAddress));
		}
		navigate('/account/address-book');
	});

	return activeCustomerAddress.value ? (
		<div class="max-w-6xl m-auto rounded-lg p-4 space-y-4">
			<div class="max-w-md m-auto">
				<AddressForm shippingAddress={appState.shippingAddress} />
				<div class="flex mt-8">
					<HighlightedButton onClick$={createOrUpdateAddress}>
						<CheckIcon /> &nbsp; Save
					</HighlightedButton>
					<span class="mr-4" />
					<Button
						onClick$={() => {
							navigate('/account/address-book');
						}}
					>
						<XMarkIcon /> &nbsp; Cancel
					</Button>
				</div>
			</div>
		</div>
	) : (
		<div class="h-[100vh]" />
	);
});
