import { component$, QRL, Signal, useComputed$, useSignal } from '@builder.io/qwik';
import { LuGraduationCap, LuUser } from '@qwikest/icons/lucide';
import { CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { ActiveCustomer } from '~/types';
import GeneralInput from '../common/GeneralInput';
import { Dialog } from '../dialog/Dialog';

interface Iprops {
	open: Signal<boolean>;
	onSubmitCompleted$: QRL<(customer: ActiveCustomer) => void>;
	prefilledInfo?: ActiveCustomer;
}

/**
 * ContactForm component for adding or editing contact information.
 *
 * @prop open: Signal<boolean> to control the visibility of the dialog.
 * @prop onSubmit$: QRL function to handle form submission and pass back the contact data.
 * 	Note that the onSubmit$ function has arguments of type string for email, firstName, and lastName, which are the values returned from the form.
 * @prop prefilledInfo?: Optional object containing prefilled values for email, firstName, and lastName.
 * If provided, these values will be used to prefill the form fields.
 
	*/
export default component$<Iprops>(({ open, onSubmitCompleted$, prefilledInfo }) => {
	const email = useSignal(prefilledInfo?.emailAddress || '');
	const firstName = useSignal(prefilledInfo?.firstName || '');
	const lastName = useSignal(prefilledInfo?.lastName || '');
	const title = useSignal(prefilledInfo?.title || '');
	const phoneNumber = useSignal(prefilledInfo?.phoneNumber || '');

	const emailCompleteSignal = useSignal<boolean>(!!prefilledInfo?.emailAddress);
	const firstNameCompleteSignal = useSignal<boolean>(!!prefilledInfo?.firstName);
	const lastNameCompleteSignal = useSignal<boolean>(!!prefilledInfo?.lastName);

	const submitAllowed = useComputed$(() => {
		return (
			emailCompleteSignal.value && firstNameCompleteSignal.value && lastNameCompleteSignal.value
		);
	});

	return (
		<Dialog open={open}>
			<div class="p-2 mt-4 xs:w-48 sm:w-60 md:w-75">
				<h2 class="text-2xl font-bold mb-4">{$localize`Contact Information`}</h2>
				<GeneralInput
					label="Email"
					type="email"
					fieldValue={email}
					completeSignal={emailCompleteSignal}
					inputProps={{
						autoComplete: 'email',
						placeholder: 'e.g., your@email.com',
					}}
				/>

				<GeneralInput
					label="Title"
					type="text"
					fieldValue={title}
					required={false}
					inputProps={{
						autoComplete: 'honorific-prefix',
						placeholder: 'e.g., Mr., Ms., Dr.',
					}}
				>
					<div q:slot="icon" class="opacity-50">
						<LuGraduationCap class="h-5 w-5" />
					</div>
				</GeneralInput>

				<GeneralInput
					label="First Name"
					type="text"
					fieldValue={firstName}
					completeSignal={firstNameCompleteSignal}
					inputProps={{
						autoComplete: 'given-name',
						placeholder: 'First Name',
					}}
				>
					<div q:slot="icon" class="opacity-50">
						<LuUser class="h-5 w-5" />
					</div>
				</GeneralInput>

				<GeneralInput
					label="Last Name"
					type="text"
					fieldValue={lastName}
					completeSignal={lastNameCompleteSignal}
					inputProps={{
						autoComplete: 'family-name',
						placeholder: 'Last Name',
					}}
				>
					<div q:slot="icon" class="opacity-50">
						<LuUser class="h-5 w-5" />
					</div>
				</GeneralInput>

				<GeneralInput
					label="Phone Number"
					type="tel"
					fieldValue={phoneNumber}
					required={false}
					inputProps={{
						autoComplete: 'tel',
						placeholder: 'e.g., +1-555-555-5555',
					}}
				/>
			</div>
			<div class="flex justify-end">
				<button
					class="btn btn-ghost m-2"
					onClick$={async () => {
						email.value = prefilledInfo?.emailAddress || '';
						firstName.value = prefilledInfo?.firstName || '';
						lastName.value = prefilledInfo?.lastName || '';
						title.value = prefilledInfo?.title || '';
						phoneNumber.value = prefilledInfo?.phoneNumber || '';
					}}
				>
					{$localize`Reset`}
				</button>
				<button
					class="btn btn-primary m-2"
					disabled={!submitAllowed.value}
					onClick$={async () => {
						const customerData: ActiveCustomer = {
							...(prefilledInfo || {
								id: CUSTOMER_NOT_DEFINED_ID,
								upvoteReviewIds: [],
							}),
							emailAddress: email.value,
							firstName: firstName.value,
							lastName: lastName.value,
							title: title.value,
							phoneNumber: phoneNumber.value,
						};
						await onSubmitCompleted$.call(undefined, customerData);
						open.value = false;
					}}
				>
					{$localize`Save`}
				</button>
			</div>
		</Dialog>
	);
});
