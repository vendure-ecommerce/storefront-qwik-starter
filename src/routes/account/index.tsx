import {
	$,
	QwikChangeEvent,
	component$,
	useBrowserVisibleTask$,
	useContext,
	useSignal,
} from '@builder.io/qwik';
import TabsContainer from '~/components/account/TabsContainer';
import Button from '~/components/buttons/Button';
import HighlightedButton from '~/components/buttons/HighlightedButton';
import CheckIcon from '~/components/icons/CheckIcon';
import PencilIcon from '~/components/icons/PencilIcon';
import XMarkIcon from '~/components/icons/XMarkIcon';
import { APP_STATE } from '~/constants';
import { logoutMutation, updateCustomerMutation } from '~/graphql/mutations';
import { getActiveCustomerQuery } from '~/graphql/queries';
import { ActiveCustomer } from '~/types';
import { scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const isEditing = useSignal(false);
	const update = {
		customer: {},
		address: {},
	};

	useBrowserVisibleTask$(async () => {
		const { activeCustomer } = await execute<{ activeCustomer: ActiveCustomer }>(
			getActiveCustomerQuery()
		);
		appState.customer = activeCustomer;
		scrollToTop();
	});

	const fullNameWithTitle = (): string => {
		return [appState.customer?.title, appState.customer?.firstName, appState.customer?.lastName]
			.filter((x) => !!x)
			.join(' ');
	};

	const saveCustomer = $(async () => {
		const updateCustomer = await execute<{
			updateCustomer: ActiveCustomer;
		}>(updateCustomerMutation(appState.customer));
		// @ts-ignore-next-line
		console.log(updateCustomer.errorCode);
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
					<TabsContainer>
						<div q:slot="tabContent" class="min-h-[24rem] rounded-lg p-4 space-y-4">
							<div class="gap-4 grid grid-cols-1 md:grid-cols-2">
								{isEditing.value && (
									<div class="md:col-span-2 md:w-1/4">
										<h3 class="text-sm text-gray-500">Title</h3>
										<input
											type="text"
											value={appState.customer?.title}
											onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
												update.customer = {
													...appState.customer,
													title: event.target.value,
												};
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
													update.customer = {
														...appState.customer,
														firstName: event.target.value,
													};
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
													update.customer = {
														...appState.customer,
														lastName: event.target.value,
													};
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
												update.customer = {
													...appState.customer,
													emailAddress: event.target.value,
												};
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
												update.customer = {
													...appState.customer,
													phoneNumber: event.target.value,
												};
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
												saveCustomer();
												isEditing.value = false;
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
										isEditing.value = true;
										update.customer = { ...appState.customer };
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
