import {
	$,
	QwikChangeEvent,
	component$,
	useBrowserVisibleTask$,
	useContext,
	useSignal,
} from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { TabsContainer } from '~/components/account/TabsContainer';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import { ErrorMessage } from '~/components/error-message/ErrorMessage';
import CheckIcon from '~/components/icons/CheckIcon';
import { APP_STATE } from '~/constants';
import { logoutMutation, updateCustomerPasswordMutation } from '~/graphql/mutations';
import { getActiveCustomerQuery } from '~/graphql/queries';
import { ActiveCustomer } from '~/types';
import { scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const navigate = useNavigate();
	const appState = useContext(APP_STATE);
	const currentPassword = useSignal('');
	const newPassword = useSignal('');
	const confirmPassword = useSignal('');
	const errorMessage = useSignal('');

	useBrowserVisibleTask$(async () => {
		const { activeCustomer } = await execute<{ activeCustomer: ActiveCustomer }>(
			getActiveCustomerQuery()
		);
		if (!activeCustomer) {
			navigate('/sign-in');
		}
		appState.customer = activeCustomer;
		scrollToTop();
	});

	const fullNameWithTitle = (): string => {
		return [appState.customer?.title, appState.customer?.firstName, appState.customer?.lastName]
			.filter((x) => !!x)
			.join(' ');
	};

	const logout = $(async () => {
		await execute(logoutMutation());
		navigate('/');
	});

	const updatePassword = $(async () => {
		if (newPassword.value === confirmPassword.value) {
			const result = await execute<{
				currentPassword: string;
				newPassword: string;
			}>(updateCustomerPasswordMutation(currentPassword.value, newPassword.value));
			console.log(result);
		} else {
			errorMessage.value = 'Confirm password does not match!';
		}
	});

	return (
		<div class="max-w-6xl xl:mx-auto px-4">
			<h2 class="text-3xl sm:text-5xl font-light text-gray-900 my-8">My Account</h2>
			<p class="text-gray-700 text-lg -mt-4">Welcome back, {fullNameWithTitle()}</p>
			<button onClick$={logout} class="underline my-4 text-primary-600 hover:text-primary-800">
				Sign out
			</button>
			<div class="flex justify-center">
				<div class="w-full text-xl text-gray-500">
					<TabsContainer activeTab="password">
						<div q:slot="tabContent" class="min-h-[24rem] rounded-lg p-4 space-y-4">
							<div class="md:col-span-2 md:w-1/4">
								<h3 class="text-sm text-gray-500">Current Password</h3>
								<input
									type="password"
									onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
										currentPassword.value = event.target.value;
									})}
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>
							<div class="md:col-span-2 md:w-1/4">
								<h3 class="text-sm text-gray-500">New Password</h3>
								<input
									type="password"
									onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
										newPassword.value = event.target.value;
									})}
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>
							<div class="md:col-span-2 md:w-1/4">
								<h3 class="text-sm text-gray-500">Confirm Password</h3>
								<input
									type="password"
									onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
										confirmPassword.value = event.target.value;
									})}
									class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>
							<div class="flex gap-x-4">
								<HighlightedButton
									onClick$={() => {
										updatePassword();
									}}
								>
									<CheckIcon /> &nbsp; Save
								</HighlightedButton>
							</div>
							{errorMessage.value !== '' && (
								<ErrorMessage
									heading="We ran into a problem changing your password!"
									message={errorMessage.value}
								/>
							)}
						</div>
					</TabsContainer>
				</div>
			</div>
		</div>
	);
});
