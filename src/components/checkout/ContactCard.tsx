import { component$, QRL, useContext, useSignal } from '@qwik.dev/core';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { HighlightedButton } from '../buttons/HighlightedButton';
import PencilEditIcon from '../icons/PencilEditIcon';
import PlusIcon from '../icons/PlusIcon';
import ContactForm from './ContactForm';

interface Iprops {
	onEditSave$?: QRL<(emailAddress: string, firstName: string, lastName: string) => void>;
}

/**
 * ContactCard component displays the customer's contact information (name and email).
 * If the customer is a guest (not logged in), an edit button is shown to allow updating the info.
 * If no contact info is available, a button to add contact information is displayed.
 * Once the contact info is added or edited, it updates the appState.
 * If the customer is logged in, the edit option is disabled.
 *
 *
 * Props:
 * - onEditSave$: Optional QRL function to be called after contact info is edited and saved.
 */
export default component$<Iprops>(({ onEditSave$ }) => {
	const appState = useContext(APP_STATE);
	const openContactForm = useSignal(false);

	const { emailAddress, firstName, lastName } = appState.customer || {};

	const isGuest = appState.customer.id === CUSTOMER_NOT_DEFINED_ID;

	return (
		<>
			{emailAddress && firstName && lastName ? (
				<div class="w-fit bg-white shadow-lg rounded-lg overflow-hidden my-2">
					<div class="flex items-center py-2 px-4 gap-2">
						<div class="flex flex-col w-fit">
							<h1 class="text-sm font-semibold text-gray-800 w-fit">
								{firstName} {lastName}
							</h1>
							<p class="py-1 text-sm text-gray-700 w-fit">{emailAddress}</p>
						</div>
						{isGuest && (
							<button
								class="text-sm text-primary-600 hover:text-primary-800"
								onClick$={async () => {
									openContactForm.value = true;
								}}
							>
								<PencilEditIcon forcedClass="h-5 w-5" />
							</button>
						)}
					</div>
				</div>
			) : (
				<HighlightedButton
					type="button"
					onClick$={async () => {
						openContactForm.value = true;
					}}
					extraClass="m-2"
				>
					<PlusIcon /> {$localize`Contact information`}
				</HighlightedButton>
			)}
			<ContactForm
				open={openContactForm}
				prefilledInfo={{ emailAddress, firstName, lastName }}
				onSubmitCompleted$={async (emailAddress, firstName, lastName) => {
					// update appState.customer with the new contact info after form submission
					if (onEditSave$) {
						await onEditSave$(emailAddress, firstName, lastName);
					}
					openContactForm.value = false;
				}}
			/>
		</>
	);
});
