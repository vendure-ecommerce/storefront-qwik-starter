import { $, component$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { isBrowser } from '@builder.io/qwik/build';
import { Image } from 'qwik-image';
import { Button } from '~/components/buttons/Button';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import { ErrorMessage } from '~/components/error-message/ErrorMessage';
import CheckIcon from '~/components/icons/CheckIcon';
import PencilSquareIcon from '~/components/icons/PencilSquareIcon';
import ShieldCheckIcon from '~/components/icons/ShieldCheckIcon';
import XMarkIcon from '~/components/icons/XMarkIcon';
import { Modal } from '~/components/modal/Modal';
import { APP_STATE } from '~/constants';
import {
	requestUpdateCustomerEmailAddressMutation,
	updateCustomerMutation,
} from '~/providers/shop/account/account';
import { getActiveCustomerQuery } from '~/providers/shop/customer/customer';
import { ActiveCustomer } from '~/types';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const isEditing = useSignal(false);
	const showModal = useSignal(false);
	const newEmail = useSignal('');
	const errorMessage = useSignal('');
	const currentPassword = useSignal('');
	const update = {
		customer: {} as ActiveCustomer,
	};

	useVisibleTask$(async () => {
		const activeCustomer = await getActiveCustomerQuery();
		appState.customer = {
			title: activeCustomer.title ?? '',
			firstName: activeCustomer.firstName,
			id: activeCustomer.id,
			lastName: activeCustomer.lastName,
			emailAddress: activeCustomer.emailAddress,
			phoneNumber: activeCustomer.phoneNumber ?? '',
		};
		newEmail.value = activeCustomer?.emailAddress as string;
	});

	const updateCustomer = $(async (): Promise<void> => {
		await updateCustomerMutation(appState.customer);

		appState.customer.emailAddress !== newEmail.value
			? (showModal.value = true)
			: (isEditing.value = false);
	});

	const updateEmail = $(async (password: string, newEmail: string) => {
		const { requestUpdateCustomerEmailAddress } = await requestUpdateCustomerEmailAddressMutation(
			password,
			newEmail
		);
		if (requestUpdateCustomerEmailAddress.__typename === 'InvalidCredentialsError') {
			errorMessage.value = requestUpdateCustomerEmailAddress.message || '';
		} else {
			errorMessage.value = '';
			isEditing.value = false;
			showModal.value = false;
		}
	});

	return (
		<div>
			<div class="min-h-[24rem] max-w-6xl m-auto rounded-lg p-4 space-y-4 ">
				<div class="flex flex-col justify-center items-center">
					<div class="relative flex flex-col items-center rounded-[20px] w-[400px] mx-auto p-4 bg-white bg-clip-border shadow-xl hover:shadow-2xl">
						<div class="relative flex h-32 w-full justify-center rounded-xl bg-cover">
							<Image
								layout="fullWidth"
								src="/account-background.png"
								class="absolute flex h-32 w-full justify-center rounded-xl bg-cover"
								alt="background"
							/>
							<div class="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400">
								<Image
									layout="fullWidth"
									class="h-full w-full rounded-full"
									src="/user-icon.webp"
									alt="user icon"
								/>
							</div>
							<div class="absolute -bottom-12 right-0">
								<button
									class="hover:text-primary-700"
									onClick$={() => {
										isEditing.value = !isEditing.value;
										if (isBrowser) {
											window.scrollTo(0, 100);
										}
										if (!isEditing.value && isBrowser) {
											window.scrollTo(0, 0);
										}
									}}
								>
									<PencilSquareIcon />
								</button>
							</div>
						</div>
						<div class="mt-16 flex flex-col items-center pb-4">
							<h4 class="text-xl md:text-3xl font-bold">
								{appState.customer?.title && (
									<span class="text-base font-normal mr-1">{appState.customer?.title}</span>
								)}
								{appState.customer?.firstName} {appState.customer?.lastName}
							</h4>
						</div>
						<div class="flex flex-col items-center justify-center text-center">
							{appState.customer?.phoneNumber && (
								<div class="text-sm md:text-lg">
									Phone:
									<span class="font-bold px-2">{appState.customer?.phoneNumber}</span>
								</div>
							)}
							<div class="text-sm md:text-lg">
								Email:
								<span class="font-bold px-2">{appState.customer?.emailAddress}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="min-h-[24rem] rounded-lg p-4 space-y-4">
				<Modal
					open={showModal.value}
					title="Confirm E-Mail address change"
					onSubmit$={() => {
						updateEmail(currentPassword.value, newEmail.value);
					}}
					onCancel$={() => {
						showModal.value = false;
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
								onChange$={(_, el) => {
									currentPassword.value = el.value;
								}}
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
				{isEditing.value && (
					<div class="max-w-3xl m-auto">
						<div class="gap-4 grid grid-cols-1 md:grid-cols-2">
							<div class="md:col-span-2 md:w-1/4">
								<h3 class="text-sm text-gray-500">Title</h3>
								<input
									type="text"
									value={appState.customer?.title}
									onInput$={(_, el) => {
										update.customer.title = el.value;
									}}
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>

							<div>
								<label html-for="firstName" class="text-sm text-gray-500">
									First Name
								</label>
								<input
									type="text"
									value={appState.customer?.firstName}
									onChange$={(_, el) => {
										if (el.value !== '') {
											update.customer.firstName = el.value;
										}
									}}
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
									onChange$={(_, el) => {
										if (el.value !== '') {
											update.customer.lastName = el.value;
										}
									}}
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>
							<div>
								<h3 class="text-sm text-gray-500">E-Mail</h3>
								<input
									type="email"
									value={appState.customer?.emailAddress}
									onChange$={(_, el) => {
										if (el.value !== '') {
											newEmail.value = el.value;
										}
									}}
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>

							<div>
								<h3 class="text-sm text-gray-500">Phone Nr.</h3>
								<input
									type="tel"
									value={appState.customer?.phoneNumber}
									onChange$={(_, el) => {
										update.customer.phoneNumber = el.value;
									}}
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>
						</div>

						<div class="flex gap-x-4 mt-8">
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
					</div>
				)}
			</div>
		</div>
	);
});
