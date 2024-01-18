import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import { ErrorMessage } from '~/components/error-message/ErrorMessage';
import CheckIcon from '~/components/icons/CheckIcon';
import EyeIcon from '~/components/icons/EyeIcon';
import EyeSlashIcon from '~/components/icons/EyeSlashIcon';
import { APP_STATE } from '~/constants';
import { updateCustomerPasswordMutation } from '~/providers/shop/customer/customer';

export default component$(() => {
	const navigate = useNavigate();
	const appState = useContext(APP_STATE);
	const currentPassword = useSignal('');
	const newPassword = useSignal('');
	const confirmPassword = useSignal('');
	const errorMessage = useSignal('');
	const showPasswordAsTextSignal = useSignal(false);

	const updatePassword = $(async () => {
		errorMessage.value = '';
		if (newPassword.value === confirmPassword.value) {
			const updateCustomerPassword = await updateCustomerPasswordMutation(
				currentPassword.value,
				newPassword.value
			);

			switch (updateCustomerPassword.__typename) {
				case 'PasswordValidationError':
					errorMessage.value = 'Please set a stronger new password!';
					break;
				case 'InvalidCredentialsError':
					errorMessage.value = 'Current password does not match!';
					break;
				case 'NativeAuthStrategyError':
					errorMessage.value = 'Login method mismatch!';
					break;
				default:
					navigate('/account');
					break;
			}
		} else {
			errorMessage.value = 'Confirm password does not match!';
		}
	});

	const togglePasswordFields = $(() => {
		showPasswordAsTextSignal.value = !showPasswordAsTextSignal.value;
		if (showPasswordAsTextSignal.value) {
			const hiddenInputs = document.querySelectorAll('input[type="password"]');
			hiddenInputs.forEach((input: any) => {
				input.type = 'text';
			});
		} else {
			const visibleInputs = document.querySelectorAll('input[type="text"]');
			visibleInputs.forEach((input: any) => {
				input.type = 'password';
			});
		}
	});

	return appState.customer ? (
		<div class="max-w-6xl m-auto rounded-lg p-4 space-y-4 flex justify-center">
			<form class="bg-white shadow-lg rounded-lg w-[20rem] py-4 px-6">
				<div class="p-4">
					<h3 class="text-sm text-gray-500">Current Password</h3>
					<input
						type="password"
						onChange$={(_, el) => {
							currentPassword.value = el.value;
						}}
						autoComplete="current-password"
						class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
					/>
				</div>
				<div class="p-4">
					<h3 class="text-sm text-gray-500">New Password</h3>
					<input
						type="password"
						onChange$={(_, el) => {
							newPassword.value = el.value;
						}}
						autoComplete="new-password"
						class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
					/>
				</div>
				<div class="p-4">
					<h3 class="text-sm text-gray-500">Confirm Password</h3>
					<input
						type="password"
						onChange$={(_, el) => {
							confirmPassword.value = el.value;
						}}
						autoComplete="new-password"
						class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
					/>
				</div>
				<div class="flex gap-x-4 p-4 justify-between">
					<HighlightedButton onClick$={updatePassword}>
						<CheckIcon /> &nbsp; Save
					</HighlightedButton>
					<div>
						<button preventdefault:click onClick$={togglePasswordFields}>
							{showPasswordAsTextSignal.value ? <EyeIcon /> : <EyeSlashIcon />}
						</button>
					</div>
				</div>
				{errorMessage.value !== '' && (
					<div class="p-4">
						<ErrorMessage
							heading="We ran into a problem changing your password!"
							message={errorMessage.value}
						/>
					</div>
				)}
			</form>
		</div>
	) : (
		<div class="h-[100vh]" />
	);
});
