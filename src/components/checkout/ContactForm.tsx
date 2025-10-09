import { $, component$, QRL, Signal } from '@qwik.dev/core';
import { Form, globalAction$, z, zod$ } from '@qwik.dev/router';
import FormInput from '~/components/common/FormInput';
import { CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { ActiveCustomer } from '~/types';
import { HighlightedButton } from '../buttons/HighlightedButton';
import { Dialog } from '../dialog/Dialog';

interface Iprops {
	open: Signal<boolean>;
	onSubmitCompleted$: QRL<(customer: ActiveCustomer) => void>;
	prefilledInfo?: ActiveCustomer;
}

export const useContactFormAction = globalAction$(
	// This submit handler will be executed right after the form is submitted, before the onSubmitCompleted$ event is triggered
	// `data` contains the form field values
	async (data) => {
		return { success: true, data };
	},
	zod$({
		id: z.string().optional(),
		emailAddress: z.string().min(1).email(),
		firstName: z.string().min(1),
		lastName: z.string().min(1),
		title: z.string().optional(),
		phoneNumber: z.string().optional(),
	})
);

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
	const action = useContactFormAction();

	return (
		<Dialog open={open}>
			<Form
				action={action}
				onSubmitCompleted$={$(async ({ detail }) => {
					if (detail.value.success) {
						await onSubmitCompleted$(detail.value.data);
						open.value = false;
					}
				})}
			>
				<div class="p-2 mt-4 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4">
					<div class="hidden">
						<input type="text" name="id" value={CUSTOMER_NOT_DEFINED_ID} />
					</div>

					<FormInput
						className="sm:col-span-2"
						name="emailAddress"
						label="Email"
						formAction={action}
						autoComplete="email"
						defaults={{ emailAddress: prefilledInfo?.emailAddress || '' }}
					/>
					<FormInput
						name="title"
						label="Title"
						formAction={action}
						autoComplete="honorific-prefix"
						defaults={{ title: prefilledInfo?.title || '' }}
					/>
					<div> </div>
					<FormInput
						name="firstName"
						label="First Name"
						formAction={action}
						autoComplete="given-name"
						defaults={{ firstName: prefilledInfo?.firstName || '' }}
					/>
					<FormInput
						name="lastName"
						label="Last Name"
						formAction={action}
						autoComplete="family-name"
						defaults={{ lastName: prefilledInfo?.lastName || '' }}
					/>

					<FormInput
						className="sm:col-span-2"
						name="phoneNumber"
						label="Phone Number"
						formAction={action}
						autoComplete="tel"
						defaults={{ phoneNumber: prefilledInfo?.phoneNumber || '' }}
					/>
				</div>
				<div class="flex justify-end">
					<HighlightedButton type="submit" extraClass="m-2">
						Save
					</HighlightedButton>
				</div>
			</Form>
		</Dialog>
	);
});
