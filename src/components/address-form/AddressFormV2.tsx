import { $, component$, QRL, Signal, useContext } from '@qwik.dev/core';
import { Form, globalAction$, z, zod$ } from '@qwik.dev/router';
import FormInput from '~/components/common/FormInput';
import {
	APP_STATE,
	AUTH_TOKEN,
	CUSTOMER_NOT_DEFINED_ID,
	GUEST_ADDED_ADDRESS_ID,
} from '~/constants';
import { CreateAddressInput, UpdateAddressInput } from '~/generated/graphql';
import {
	createCustomerAddressMutation,
	updateCustomerAddressMutation,
} from '~/providers/shop/customer/customer';
import { ShippingAddress } from '~/types';
import { HighlightedButton } from '../buttons/HighlightedButton';
import { Dialog } from '../dialog/Dialog';

type IProps = {
	open: Signal<boolean>;
	onForward$?: QRL<(data: ShippingAddress) => Promise<void>>;
	prefilledAddress?: ShippingAddress;
};

export const useAddressEditAction = globalAction$(
	// This submit handler will be executed right after the form is submitted, before the onSubmitCompleted$ event is triggered
	// `data` contains the form field values
	async (data, { cookie }) => {
		// Convert checkbox values to boolean
		const parsedData = {
			...data,
			defaultShippingAddress: data.defaultShippingAddress === 'on',
			defaultBillingAddress: data.defaultBillingAddress === 'on',
		};
		const authToken = cookie.get(AUTH_TOKEN)?.value;

		return { success: true, data: parsedData, authToken: authToken };
	},
	zod$({
		id: z.string().optional(),
		fullName: z.string().min(1),
		company: z.string().optional(),
		streetLine1: z.string().min(1),
		streetLine2: z.string().optional(),
		city: z.string().min(1),
		countryCode: z.string().min(1),
		province: z.string().min(1),
		postalCode: z.string().min(1),
		phoneNumber: z.string().optional(),
		defaultShippingAddress: z.string().optional(), // 'on' or undefined (note that form checkbox returns 'on' when checked, it can't return boolean)
		defaultBillingAddress: z.string().optional(), // 'on' or undefined
	})
);

/**
 * AddressForm component for adding or editing addresses.
 * If requester is a guest (not logged in), the submit will not create or update the address in the backend.
 * If the requester is a logged-in customer, the submit will be created or updated in the backend.
 *
 * @prop open: Signal<boolean> to control the visibility of the dialog.
 * @prop onForward$: QRL function to handle form submission and pass back the address data.
 * 	Note that the onForward$ function has an argument of type ShippingAddress, which is the object returned from the form.
 *  And it should be a QRL. E.g. onForward$={$(async (address) => { ... })}
 * @prop prefilledAddress: Optional ShippingAddress to prefill the form fields when editing an existing address.
 */
export const AddressForm = component$<IProps>(({ open, onForward$, prefilledAddress }) => {
	const appState = useContext(APP_STATE);
	const action = useAddressEditAction();
	const isGuest = appState.customer.id === CUSTOMER_NOT_DEFINED_ID;

	return (
		<Dialog
			open={open}
			extraClass="max-w-2xl"
			id={`address-form-dialog-${prefilledAddress?.id || 'new'}`}
		>
			<Form
				action={action}
				onSubmitCompleted$={async ({ detail }) => {
					if (detail.value.success && detail.value.data) {
						const formData = detail.value.data;
						const authToken = detail.value.authToken;
						if (!isGuest) {
							const createdOrUpdatedAddressId = await createOrUpdateAddress$(
								formData as ShippingAddress,
								authToken
							);
							if (createdOrUpdatedAddressId) {
								formData.id = createdOrUpdatedAddressId;
							}
						} else {
							formData.id = GUEST_ADDED_ADDRESS_ID;
						}
						if (onForward$) {
							await onForward$(formData as ShippingAddress);
						}
						open.value = false;
					}
				}}
			>
				<div class="p-2 mt-4 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4">
					<div class="hidden">
						<input type="text" name="id" value={prefilledAddress?.id || undefined} readOnly />
					</div>
					<FormInput
						name="fullName"
						label={$localize`Full name`}
						formAction={action}
						defaults={prefilledAddress}
						autoComplete="given-name"
					/>
					<FormInput
						className="sm:col-span-2"
						name="company"
						label={$localize`Company`}
						formAction={action}
						defaults={prefilledAddress}
						autoComplete="organization"
					/>
					<FormInput
						className="sm:col-span-2"
						name="streetLine1"
						label={$localize`Address`}
						formAction={action}
						defaults={prefilledAddress}
						autoComplete="street-address"
					/>
					<FormInput
						className="sm:col-span-2"
						name="streetLine2"
						label={$localize`Apartment, suite, etc.`}
						formAction={action}
						defaults={prefilledAddress}
					/>
					<FormInput
						name="city"
						label={$localize`City`}
						formAction={action}
						defaults={prefilledAddress}
						autoComplete="address-level2"
					/>
					<div>
						<label html-for="countryCode" class="block text-sm font-medium text-gray-700">
							{$localize`Country`}
						</label>
						<div class="mt-1">
							{appState.availableCountries && (
								<select
									id="countryCode"
									name="countryCode"
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								>
									{appState.availableCountries.map((item) => (
										<option key={item.code} value={item.code}>
											{item.name}
										</option>
									))}
								</select>
							)}
						</div>
					</div>
					<FormInput
						name="province"
						label={$localize`State / Province`}
						formAction={action}
						defaults={prefilledAddress}
						autoComplete="address-level1"
					/>
					<FormInput
						name="postalCode"
						label={$localize`Postal code`}
						formAction={action}
						defaults={prefilledAddress}
						autoComplete="postal-code"
					/>
					<FormInput
						className="sm:col-span-2"
						name="phoneNumber"
						label={$localize`Phone`}
						formAction={action}
						defaults={prefilledAddress}
						autoComplete="tel"
					/>
					{!isGuest && ( // Guest doesn't need to set default address
						<>
							<div class="sm:col-span-1">
								<label
									html-for="defaultShippingAddress"
									class="block text-sm font-medium text-gray-700"
								>
									{$localize`Default Shipping Address`}
								</label>
								<div class="mt-1">
									<input
										type="checkbox"
										name="defaultShippingAddress"
										id="defaultShippingAddress"
										checked={prefilledAddress?.defaultShippingAddress}
									/>
								</div>
							</div>

							<div class="sm:col-span-1">
								<label
									html-for="defaultBillingAddress"
									class="block text-sm font-medium text-gray-700"
								>
									{$localize`Default Billing Address`}
								</label>
								<div class="mt-1">
									<input
										type="checkbox"
										name="defaultBillingAddress"
										id="defaultBillingAddress"
										checked={prefilledAddress?.defaultBillingAddress}
									/>
								</div>
							</div>
						</>
					)}
				</div>
				<div class="flex justify-end">
					<HighlightedButton type="submit" extraClass="m-2">
						Save Address
					</HighlightedButton>
				</div>
			</Form>
		</Dialog>
	);
});

const createOrUpdateAddress$ = $(
	async (address: ShippingAddress, authToken: string | undefined): Promise<string | undefined> => {
		if (!address.id || address.id === 'add' || address.id === '') {
			delete address.id;
			const result = await createCustomerAddressMutation(address as CreateAddressInput, authToken);
			console.log('createCustomerAddressMutation result:', JSON.stringify(result, null, 2));
			return result?.createCustomerAddress?.id;
		}
		const result = await updateCustomerAddressMutation(address as UpdateAddressInput, authToken);
		console.log('updateCustomerAddressMutation result:', JSON.stringify(result, null, 2));
		return result?.updateCustomerAddress?.id;
	}
);
