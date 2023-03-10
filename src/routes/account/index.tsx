import {
	$,
	QwikChangeEvent,
	component$,
	useBrowserVisibleTask$,
	useContext,
	useSignal,
} from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { Button } from '~/components/buttons/Button';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import { ErrorMessage } from '~/components/error-message/ErrorMessage';
import CheckIcon from '~/components/icons/CheckIcon';
import PencilIcon from '~/components/icons/PencilIcon';
import ShieldCheckIcon from '~/components/icons/ShieldCheckIcon';
import XMarkIcon from '~/components/icons/XMarkIcon';
import { Modal } from '~/components/modal/Modal';
import { APP_STATE } from '~/constants';
import {
	requestUpdateCustomerEmailAddressMutation,
	updateCustomerMutation,
} from '~/graphql/mutations';
import { getActiveCustomerQuery } from '~/graphql/queries';
import { ActiveCustomer } from '~/types';
import { fullNameWithTitle, scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const navigate = useNavigate();
	const appState = useContext(APP_STATE);
	const isEditing = useSignal(false);
	const showModal = useSignal(false);
	const newEmail = useSignal('');
	const errorMessage = useSignal('');
	const currentPassword = useSignal('');
	const update = {
		customer: {} as ActiveCustomer,
	};

	useBrowserVisibleTask$(async () => {
		const { activeCustomer } = await execute<{ activeCustomer: ActiveCustomer }>(
			getActiveCustomerQuery()
		);
		if (!activeCustomer) {
			navigate('/sign-in');
		}
		appState.customer = activeCustomer;
		newEmail.value = activeCustomer.emailAddress as string;
		scrollToTop();
	});

	const updateCustomer = $(async (): Promise<void> => {
		await execute<{
			updateCustomer: ActiveCustomer;
		}>(updateCustomerMutation(appState.customer));

		if (appState.customer.emailAddress !== newEmail.value) {
			showModal.value = true;
		} else {
			isEditing.value = false;
		}
	});

	const updateEmail = $(async (password: string, newEmail: string) => {
		const { requestUpdateCustomerEmailAddress } = await execute<{
			requestUpdateCustomerEmailAddress: {
				password: string;
				newEmail: string;
				__typename: string;
				message?: string;
			};
		}>(requestUpdateCustomerEmailAddressMutation(password, newEmail));
		if (requestUpdateCustomerEmailAddress.__typename === 'InvalidCredentialsError') {
			errorMessage.value = requestUpdateCustomerEmailAddress.message || '';
		} else {
			errorMessage.value = '';
			isEditing.value = false;
			showModal.value = false;
		}
	});

	return (
		<div class="min-h-[24rem] rounded-lg p-4 space-y-4">
			<Modal
				open={showModal.value}
				title="Confirm E-Mail address change"
				submitProps={{
					type: 'button',
					onClick$: $(() => {
						updateEmail(currentPassword.value, newEmail.value);
					}),
				}}
				cancelProps={{
					type: 'button',
					onClick$: $(() => {
						showModal.value = false;
					}),
				}}
			>
				<div q:slot="modalIcon">
					<ShieldCheckIcon forcedClass="h-10 w-10 text-primary-500" />
				</div>
				<div q:slot="modalContent" class="space-y-4">
					<p>We will send a verification E-Mail to {newEmail.value}</p>

					<div class="space-y-1">
						<label html-for="password">Confirm the change by entering your password:</label>
						<input
							type="password"
							name="password"
							onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
								currentPassword.value = event.target.value;
							})}
							class="w-full"
						/>
					</div>

					{errorMessage.value !== '' && (
						<ErrorMessage
							heading="We ran into a problem changing your E-Mail!"
							message={errorMessage.value}
						/>
					)}
				</div>
			</Modal>
			<div class="gap-4 grid grid-cols-1 md:grid-cols-2">
				{isEditing.value && (
					<div class="md:col-span-2 md:w-1/4">
						<h3 class="text-sm text-gray-500">Title</h3>
						<input
							type="text"
							value={appState.customer?.title}
							onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
								update.customer.title = event.target.value;
							})}
							class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
						/>
					</div>
				)}

				{isEditing.value ? (
					<>
						<div>
							<label html-for="firstName" class="text-sm text-gray-500">
								First Name
							</label>
							<input
								type="text"
								value={appState.customer?.firstName}
								onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
									if (event.target.value !== '') {
										update.customer.firstName = event.target.value;
									}
								})}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							/>
						</div>
						<div>
							<label html-for="lastName" class="text-sm text-gray-500">
								Last Name
							</label>
							<input
								type="text"
								value={appState.customer?.lastName}
								onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
									if (event.target.value !== '') {
										update.customer.lastName = event.target.value;
									}
								})}
								class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							/>
						</div>
					</>
				) : (
					<div class="md:col-span-2">
						<h3 class="text-sm text-gray-500">Full Name</h3>
						<p class="py-2 text-lg text-gray-700">{fullNameWithTitle(appState.customer)}</p>
					</div>
				)}

				<div>
					<h3 class="text-sm text-gray-500">E-Mail</h3>
					{isEditing.value ? (
						<input
							type="email"
							value={appState.customer?.emailAddress}
							onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
								if (event.target.value !== '') {
									newEmail.value = event.target.value;
								}
							})}
							class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
						/>
					) : (
						<p class="py-2 text-lg text-gray-700">{appState.customer?.emailAddress}</p>
					)}
				</div>

				<div>
					<h3 class="text-sm text-gray-500">Phone Nr.</h3>
					{isEditing.value ? (
						<input
							type="tel"
							value={appState.customer?.phoneNumber}
							onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
								update.customer.phoneNumber = event.target.value;
							})}
							class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
						/>
					) : (
						<p class="py-2 text-lg text-gray-700">{appState.customer?.phoneNumber}</p>
					)}
				</div>
			</div>

			{isEditing.value ? (
				<>
					<div class="flex gap-x-4">
						<HighlightedButton
							onClick$={() => {
								appState.customer = { ...appState.customer, ...update.customer };
								updateCustomer();
							}}
						>
							<CheckIcon /> &nbsp; Save
						</HighlightedButton>

						<Button
							onClick$={() => {
								isEditing.value = false;
							}}
						>
							<XMarkIcon forcedClass="w-4 h-4" /> &nbsp; Cancel
						</Button>
					</div>
				</>
			) : (
				<HighlightedButton
					onClick$={() => {
						update.customer = { ...appState.customer };
						isEditing.value = true;
					}}
				>
					<PencilIcon /> &nbsp; Edit
				</HighlightedButton>
			)}
		</div>
	);
});
