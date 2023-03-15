import { component$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import AddressCard from '~/components/account/AddressCard';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import PlusIcon from '~/components/icons/PlusIcon';
import { APP_STATE } from '~/constants';
import { deleteCustomerAddressMutation } from '~/graphql/mutations';
import { getActiveCustomerAddressesQuery } from '~/graphql/queries';
import { ShippingAddress } from '~/types';
import { scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const navigate = useNavigate();
	const appState = useContext(APP_STATE);
	const activeCustomerAddresses = useSignal<{ id: string; addresses: ShippingAddress[] }>();

	useVisibleTask$(async () => {
		const { activeCustomer } = await execute<{
			activeCustomer: { id: string; addresses: ShippingAddress[] };
		}>(getActiveCustomerAddressesQuery());

		activeCustomerAddresses.value = activeCustomer;

		if (activeCustomer?.addresses) {
			appState.addressBook.splice(0, appState.addressBook.length);
			appState.addressBook.push(...activeCustomer.addresses);
		}
		scrollToTop();
	});

	return activeCustomerAddresses.value ? (
		<div class="max-w-6xl m-auto rounded-lg p-4 space-y-4">
			<div class="flex flex-wrap gap-6 justify-evenly">
				{[...appState.addressBook].map((address) => (
					<div class="min-w-[20rem]" key={address.id}>
						<AddressCard
							address={address}
							onDelete$={async (id) => {
								await execute<{
									id: string;
								}>(deleteCustomerAddressMutation(id));
								location.reload();
							}}
						/>
					</div>
				))}
			</div>
			<div class="flex justify-center">
				<HighlightedButton
					onClick$={() => {
						navigate('/account/address-book/add');
					}}
				>
					<PlusIcon /> &nbsp; New Address
				</HighlightedButton>
			</div>
		</div>
	) : (
		<div class="h-[100vh]" />
	);
});
