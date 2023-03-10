import { component$, useBrowserVisibleTask$, useContext, useSignal } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import AddressCard from '~/components/account/AddressCard';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import PlusIcon from '~/components/icons/PlusIcon';
import { APP_STATE } from '~/constants';
import { getActiveCustomerAddressesQuery } from '~/graphql/queries';
import { ShippingAddress } from '~/types';
import { scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const navigate = useNavigate();
	const appState = useContext(APP_STATE);
	const activeCustomerAddresses = useSignal<{ id: string; addresses: ShippingAddress[] }>();

	useBrowserVisibleTask$(async () => {
		const { activeCustomer } = await execute<{
			activeCustomer: { id: string; addresses: ShippingAddress[] };
		}>(getActiveCustomerAddressesQuery());

		if (!activeCustomer) {
			navigate('/sign-in');
		}

		activeCustomerAddresses.value = activeCustomer;

		if (activeCustomer?.addresses) {
			appState.addressBook.splice(0, appState.addressBook.length);
			appState.addressBook.push(...activeCustomer.addresses);
		}
		scrollToTop();
	});

	return activeCustomerAddresses.value ? (
		<div class="min-h-[24rem] rounded-lg p-4 space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md md:max-w-6xl mx-auto">
				{[...appState.addressBook].map((address) => (
					<div key={address.id}>
						<AddressCard address={address} />
					</div>
				))}
			</div>
			<HighlightedButton onClick$={() => {}}>
				<PlusIcon /> &nbsp; New Address
			</HighlightedButton>
		</div>
	) : (
		<div class="h-[100vh]" />
	);
});
