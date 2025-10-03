import { $, component$, QRL, Signal, useContext } from '@qwik.dev/core';
import { Form, globalAction$, z, zod$ } from '@qwik.dev/router';
import { APP_STATE, AUTH_TOKEN } from '~/constants';
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
		const createdOrUpdatedAddressId = await createOrUpdateAddress$(
			parsedData as ShippingAddress,
			authToken
		);
		if (createdOrUpdatedAddressId) {
			parsedData.id = createdOrUpdatedAddressId;
		}
		return { success: true, data: parsedData };
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
					<AddressInputField
						name="fullName"
						label={$localize`Full name`}
						formAction={action}
						defaultAddress={prefilledAddress}
						autoComplete="given-name"
					/>
					<AddressInputField
						className="sm:col-span-2"
						name="company"
						label={$localize`Company`}
						formAction={action}
						defaultAddress={prefilledAddress}
						autoComplete="organization"
					/>
					<AddressInputField
						className="sm:col-span-2"
						name="streetLine1"
						label={$localize`Address`}
						formAction={action}
						defaultAddress={prefilledAddress}
						autoComplete="street-address"
					/>
					<AddressInputField
						className="sm:col-span-2"
						name="streetLine2"
						label={$localize`Apartment, suite, etc.`}
						formAction={action}
						defaultAddress={prefilledAddress}
					/>
					<AddressInputField
						name="city"
						label={$localize`City`}
						formAction={action}
						defaultAddress={prefilledAddress}
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
					<AddressInputField
						name="province"
						label={$localize`State / Province`}
						formAction={action}
						defaultAddress={prefilledAddress}
						autoComplete="address-level1"
					/>
					<AddressInputField
						name="postalCode"
						label={$localize`Postal code`}
						formAction={action}
						defaultAddress={prefilledAddress}
						autoComplete="postal-code"
					/>
					<AddressInputField
						className="sm:col-span-2"
						name="phoneNumber"
						label={$localize`Phone`}
						formAction={action}
						defaultAddress={prefilledAddress}
						autoComplete="tel"
					/>
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
								defaultChecked={prefilledAddress?.defaultShippingAddress}
							/>
						</div>
					</div>

					<div class="sm:col-span-1">
						<label html-for="defaultBillingAddress" class="block text-sm font-medium text-gray-700">
							{$localize`Default Billing Address`}
						</label>
						<div class="mt-1">
							<input
								type="checkbox"
								name="defaultBillingAddress"
								id="defaultBillingAddress"
								defaultChecked={prefilledAddress?.defaultBillingAddress}
							/>
						</div>
					</div>
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

interface AddressInputFieldProps {
	name: keyof ShippingAddress;
	label: string;
	formAction: ReturnType<typeof useAddressEditAction>;
	autoComplete?: string;
	defaultAddress?: ShippingAddress;
	className?: string;
}
const AddressInputField = component$<AddressInputFieldProps>(
	({ name, label, formAction, autoComplete, defaultAddress, className }) => {
		const fieldErrors = formAction.value?.fieldErrors as
			| Record<string, string | undefined>
			| undefined;
		const error = fieldErrors?.[name as string];

		const defaultValue = defaultAddress ? defaultAddress[name] ?? '' : '';

		return (
			<div class={className || ''}>
				<label for={name as string} class="block text-sm font-medium text-gray-700">
					{label}
				</label>
				<div class="mt-1">
					<input
						type="text"
						id={name as string}
						name={name as string}
						value={defaultValue as string}
						autoComplete={autoComplete}
						class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
					/>
				</div>
				{error && renderError(error)}
			</div>
		);
	}
);
const renderError = (errorMessage: string | undefined) => {
	if (!errorMessage) return null;
	return <p class="error text-xs text-red-600 mt-1 ">{errorMessage}</p>;
};

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
