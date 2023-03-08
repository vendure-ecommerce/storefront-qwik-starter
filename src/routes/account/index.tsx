import {
	$,
	QwikChangeEvent,
	component$,
	useBrowserVisibleTask$,
	useContext,
	useSignal,
} from '@builder.io/qwik';
import { TabsContainer } from '~/components/account/TabsContainer';
import { Button } from '~/components/buttons/Button';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import { ErrorMessage } from '~/components/error-message/ErrorMessage';
import CheckIcon from '~/components/icons/CheckIcon';
import PencilIcon from '~/components/icons/PencilIcon';
import XMarkIcon from '~/components/icons/XMarkIcon';
import { Modal } from '~/components/modal/Modal';
import { APP_STATE } from '~/constants';
import {
	logoutMutation,
	requestUpdateCustomerEmailAddressMutation,
	updateCustomerMutation,
} from '~/graphql/mutations';
import { getActiveCustomerQuery } from '~/graphql/queries';
import { ActiveCustomer } from '~/types';
import { scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

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

	useBrowserVisibleTask$(async () => {
		const { activeCustomer } = await execute<{ activeCustomer: ActiveCustomer }>(
			getActiveCustomerQuery()
		);
		if (!activeCustomer) {
			window.location.href = '/sign-in';
		}
		appState.customer = activeCustomer;
		newEmail.value = activeCustomer.emailAddress as string;
		scrollToTop();
	});

	const fullNameWithTitle = (): string => {
		return [appState.customer?.title, appState.customer?.firstName, appState.customer?.lastName]
			.filter((x) => !!x)
			.join(' ');
	};

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
		const result = await execute<{
			password: string;
			newEmail: string;
		}>(requestUpdateCustomerEmailAddressMutation(password, newEmail));
		// @ts-ignore
		if (result.requestUpdateCustomerEmailAddress.__typename === 'InvalidCredentialsError') {
			// @ts-ignore
			errorMessage.value = result.requestUpdateCustomerEmailAddress.message;
		} else {
			errorMessage.value = '';
			isEditing.value = false;
			showModal.value = false;
		}
	});

	const logout = $(async () => {
		await execute(logoutMutation());
		window.location.href = '/';
	});
	return (
		<div class="max-w-6xl xl:mx-auto px-4">
			<h2 class="text-3xl sm:text-5xl font-light text-gray-900 my-8">My Account</h2>
			<p class="text-gray-700 text-lg -mt-4">Welcome back, {fullNameWithTitle()}</p>
			<button onClick$={logout} class="underline my-4 text-primary-600 hover:text-primary-800">
				Sign out
			</button>
			<div class="h-96 flex justify-center">
				<div class="w-full text-xl text-gray-500">
					<TabsContainer activeTab="details">
						<div q:slot="tabContent" class="min-h-[24rem] rounded-lg p-4 space-y-4">
							<Modal
								open={showModal.value}
								title="Confirm E-Mail address change"
								//! FIX instance of "JSXNodeImpl" / You might need to use 'noSerialize()' or use an object literal instead.
								// icon={<ShieldCheckIcon forcedClass="h-10 w-10 text-primary-500" />}
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
										{fullNameWithTitle()}
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
										appState.customer?.emailAddress
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
										appState.customer?.phoneNumber
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
											<CheckIcon /> Save
										</HighlightedButton>

										<Button
											onClick$={() => {
												isEditing.value = false;
											}}
										>
											<XMarkIcon forcedClass="w-4 h-4" /> Cancel
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
									<PencilIcon /> Edit
								</HighlightedButton>
							)}
						</div>
					</TabsContainer>
				</div>
			</div>
		</div>
	);
});
