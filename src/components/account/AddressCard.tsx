import { $, component$, useContext } from '@builder.io/qwik';
import { useNavigate } from '@qwik.dev/router';
import { APP_STATE } from '~/constants';
import { deleteCustomerAddressMutation } from '~/providers/shop/customer/customer';
import { ShippingAddress } from '~/types';
import { Button } from '../buttons/Button';
import { HighlightedButton } from '../buttons/HighlightedButton';
import BillingAddressIcon from '../icons/BillingAddressIcon';
import LocationIcon from '../icons/LocationIcon';
import PencilIcon from '../icons/PencilIcon';
import ShippingAddressIcon from '../icons/ShippingAddressIcon';
import TelephoneIcon from '../icons/TelephoneIcon';
import XCircleIcon from '../icons/XCircleIcon';

type IProps = {
	address: ShippingAddress;
};

export default component$<IProps>(({ address }) => {
	const navigate = useNavigate();
	const appState = useContext(APP_STATE);

	const onDelete$ = $(async () => {
		if (address.id) {
			try {
				await deleteCustomerAddressMutation(address.id);
				// Optimistically update state without full page reload
				appState.addressBook = appState.addressBook.filter((a) => a.id !== address.id);
			} catch (error) {
				console.error('Failed to delete address:', error);
			}
		}
	});

	return (
		<div class="max-w-xs bg-white shadow-lg rounded-lg overflow-hidden my-4">
			<div class="py-4 px-6">
				<h1 class="text-2xl font-semibold text-gray-800">
					{address.fullName}{' '}
					{address.company && <span class="py-2 text-lg text-gray-700"> - {address.company}</span>}
				</h1>
				<p class="py-2 text-lg text-gray-700">{address.streetLine1}</p>
				<p class="text-lg text-gray-700">{address.streetLine2}&nbsp;</p>
				<div class="flex items-center mt-4 text-gray-700">
					<LocationIcon />
					<h1 class="px-2 text-sm">
						{address.city}, {address.province}
					</h1>
				</div>
				<div class="flex items-center mt-4 mb-4 text-gray-700">
					<TelephoneIcon />
					<h1 class="px-2 text-sm">{address.phoneNumber}</h1>
				</div>
				<div class="flex justify-around">
					<HighlightedButton
						onClick$={() => {
							navigate(`/account/address-book/${address.id}`);
						}}
					>
						<PencilIcon /> &nbsp; Edit
					</HighlightedButton>
					<Button onClick$={onDelete$}>
						<XCircleIcon /> &nbsp; Delete
					</Button>
				</div>
				<div class="flex text-xs justify-between mt-4">
					{address.defaultShippingAddress && (
						<div class="flex items-center">
							<ShippingAddressIcon />
							<span class="ml-2">Shipping Address</span>
						</div>
					)}
					{address.defaultBillingAddress && (
						<div class="flex items-center">
							<BillingAddressIcon />
							<span class="ml-2">Billing Address</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
});
