import { $, component$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Form, globalAction$, useLocation, useNavigate, z, zod$ } from '@builder.io/qwik-city';
import AddressForm from '~/components/address-form/AddressForm';
import { Button } from '~/components/buttons/Button';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import CheckIcon from '~/components/icons/CheckIcon';
import XCircleIcon from '~/components/icons/XCircleIcon';
import XMarkIcon from '~/components/icons/XMarkIcon';
import { APP_STATE, AUTH_TOKEN } from '~/constants';
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

	const createOrUpdateAddress = $(async (id: string | undefined, authToken: string | undefined) => {
		delete appState.shippingAddress.country;
		if (id === 'add') {
			await execute<{
				createCustomerAddress: ShippingAddress;
			}>(createCustomerAddressMutation(appState.shippingAddress), authToken);
		} else {
			await execute<{
				updateCustomerAddress: ShippingAddress;
			}>(updateCustomerAddressMutation(appState.shippingAddress), authToken);
		}
	});

	const submitFormAction = globalAction$(
		async (formData, { cookie, redirect, url }) => {
			const id = url.pathname.split('/').slice(-2, -1)[0];
			const authToken = cookie.get(AUTH_TOKEN)?.value;
			appState.shippingAddress = { ...appState.shippingAddress, ...formData };
			await createOrUpdateAddress(id, authToken);
			redirect(303, '/account/address-book');
		},
		zod$({
			fullName: z.string().nonempty(),
			company: z.string(),
			streetLine1: z.string().nonempty(),
			streetLine2: z.string(),
			city: z.string().nonempty(),
			countryCode: z.string().nonempty(),
			province: z.string().nonempty(),
			postalCode: z.string().nonempty(),
			phoneNumber: z.string(),
		})
	);
	const useSubmitFormAction = submitFormAction();

	return activeCustomerAddress.value ? (
		<div class="max-w-6xl m-auto rounded-lg p-4 space-y-4">
			<div class="max-w-md m-auto">
				<Form action={useSubmitFormAction}>
					<AddressForm shippingAddress={appState.shippingAddress} />
					{useSubmitFormAction.value?.failed && (
						<div class="rounded-md bg-red-50 p-4 mt-8">
							<div class="flex">
								<div class="flex-shrink-0">
									<XCircleIcon />
								</div>
								<div class="ml-3">
									<h3 class="text-sm font-medium text-red-800">
										We ran into a problem updating your address!
									</h3>

									{Object.entries(useSubmitFormAction?.value?.fieldErrors || {}).map(
										([field, error]) => (
											<p class="text-sm text-red-700 mt-2">
												{field} - {error}
											</p>
										)
									)}
								</div>
							</div>
						</div>
					)}
					<div class="flex mt-8">
						<HighlightedButton onClick$={() => {}}>
							<CheckIcon /> &nbsp; <button type="submit">Save</button>
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
				</Form>
			</div>
		</div>
	) : (
		<div class="h-[100vh]" />
	);
});
