import { component$, QRL, Signal, useContext } from '@qwik.dev/core';
import { Form, globalAction$, z, zod$ } from '@qwik.dev/router';
import FormInput from '~/components/common/FormInput';
import { APP_STATE, AUTH_TOKEN } from '~/constants';
import { validateAddressByShippoQuery } from '~/providers/shop/account/account';
import { ShippingAddress } from '~/types';
import {
	fieldsNotIdentical,
	mapShippoMessagesToIssues,
	shippoMessagesToStrings,
} from '~/utils/shippo';
import { HighlightedButton } from '../buttons/HighlightedButton';
import { Dialog } from '../dialog/Dialog';

type IProps = {
	open: Signal<boolean>;
	onForward$?: QRL<(data: ShippingAddress, authToken: string | undefined) => Promise<void>>;
	prefilledAddress?: ShippingAddress;
	allowEditDefault?: boolean; // default to true
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
	zod$(
		z
			.object({
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
				defaultShippingAddress: z.string().optional(), // 'on' or undefined
				defaultBillingAddress: z.string().optional(), // 'on' or undefined
			})
			.superRefine(async (data, ctx) => {
				try {
					// Basic early-exit: if essential fields are missing/blank, skip external validation.
					// This avoids calling Shippo when the form is already missing required data.
					const essentialFields = ['streetLine1', 'city', 'countryCode', 'postalCode'];
					for (const f of essentialFields) {
						if (!data || !String((data as any)[f] ?? '').trim()) {
							// Let the field-level validators (z.string().min(1)) report the missing field.
							return;
						}
					}

					// Local quick format check: for US addresses require two uppercase letters (e.g., CA, NY)
					if (data && String(data.countryCode).toUpperCase() === 'US') {
						if (!/^[A-Z]{2}$/.test(String(data.province || ''))) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								path: ['province'],
								message: $localize`For US addresses, state must be two uppercase letters (e.g., CA, NY)`,
							});
							// Skip external Shippo validation if local format check fails
							return;
						}
					}
					const shippoValidateResult = await validateAddressByShippoQuery({
						city: data.city,
						country: data.countryCode,
						countryCode: data.countryCode,
						province: data.province,
						postalCode: data.postalCode,
						streetLine1: data.streetLine1,
						streetLine2: data.streetLine2,
					});

					if (shippoValidateResult?.__typename === 'ShippoAddressValidationResult') {
						const { validationResults } = shippoValidateResult;
						const isValid = validationResults?.isValid;
						const hasMessages =
							validationResults?.messages && validationResults.messages.length > 0;

						// If Shippo reports invalid, convert messages and attach as issues
						if (!isValid || hasMessages) {
							// Lazy import to avoid circulars and reuse helper
							const messages = shippoMessagesToStrings(shippoValidateResult as any);

							if (messages.length > 0) {
								// Map messages to issues (path + message) using shared helper
								const issues = mapShippoMessagesToIssues(messages);
								issues.forEach(({ path, message }) =>
									ctx.addIssue({ code: z.ZodIssueCode.custom, path, message })
								);
							} else {
								// No messages returned, attach a generic form-level error
								ctx.addIssue({
									code: z.ZodIssueCode.custom,
									path: [],
									message: $localize`Address validation failed. Please check the address details.`,
								});
							}
						}
						const suggestedChanges = fieldsNotIdentical(
							data as ShippingAddress,
							shippoValidateResult
						);
						if (suggestedChanges.length > 0) {
							suggestedChanges.forEach((change) => {
								ctx.addIssue({
									code: z.ZodIssueCode.custom,
									path: [change.field],
									message: $localize`Suggested correction: ${change.suggested}`,
								});
							});
						}
					}
				} catch (err) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: [],
						message: $localize`Address validation service unavailable. Please try again later.`,
					});
				}
			})
	)
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
export const AddressForm = component$<IProps>(
	({ open, onForward$, prefilledAddress, allowEditDefault = true }) => {
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
							const authToken = detail.value.authToken;
							if (onForward$) {
								await onForward$(formData as ShippingAddress, authToken);
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
										value="US"
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
						{allowEditDefault && ( // this is for Guest doesn't need to set default address
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
	}
);

// createOrUpdateAddress$ moved to ~/components/common/address
