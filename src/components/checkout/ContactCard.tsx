import { component$, QRL, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { LuMail, LuPencilLine, LuPhone, LuPlus } from '@qwikest/icons/lucide';
import { APP_STATE } from '~/constants';
import { ActiveCustomer } from '~/types';
import { isGuestCustomer } from '~/utils';
import ContactForm from './ContactForm';

interface Iprops {
	onEditSave$?: QRL<(customer: ActiveCustomer) => void>;
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
	const isGuest = useSignal<boolean>(false);

	const { title, emailAddress, firstName, lastName, phoneNumber } = appState.customer || {};

	useVisibleTask$(() => {
		isGuest.value = isGuestCustomer(appState);
	});

	return (
		<>
			{emailAddress && firstName && lastName ? (
				<div class="card border card-sm">
					<div class="card-body">
						<div class="flex gap-2">
							<h1 class="card-title">
								{title || ''} {firstName} {lastName}
							</h1>
							{isGuest.value && (
								<button
									class="btn btn-accent btn-soft btn-sm"
									onClick$={async () => {
										openContactForm.value = true;
									}}
								>
									<LuPencilLine class="h-5 w-5" />
								</button>
							)}
						</div>
						<div class="flex gap-2 items-center">
							<LuMail />
							{emailAddress}
						</div>

						{phoneNumber && (
							<div class="flex gap-2 items-center">
								<LuPhone />
								{phoneNumber}
							</div>
						)}
					</div>
				</div>
			) : (
				<button
					class="btn btn-accent btn-md flex items-center"
					type="button"
					onClick$={async () => {
						openContactForm.value = true;
					}}
				>
					<LuPlus /> {$localize`Contact information`}
				</button>
			)}
			<ContactForm
				open={openContactForm}
				prefilledInfo={appState.customer}
				onSubmitCompleted$={async (customer) => {
					// update appState.customer with the new contact info after form submission
					if (onEditSave$) {
						await onEditSave$(customer);
					}
					openContactForm.value = false;
				}}
			/>
		</>
	);
});
