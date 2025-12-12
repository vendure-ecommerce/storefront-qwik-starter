import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { Link } from '@qwik.dev/router';
import { PasswordInput } from '~/components/account/PasswordInput';
import { ErrorMessage } from '~/components/error-message/ErrorMessage';
import { APP_STATE } from '~/constants';
import { updateCustomerPasswordMutation } from '~/providers/shop/customer/customer';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const currentPassword = useSignal('');
	const isCurrentPasswordValid = useSignal(false);
	const newPassword = useSignal('');
	const confirmPassword = useSignal('');
	const errorMessage = useSignal('');
	const isNewPasswordValid = useSignal(false);
	const isConfirmPasswordValid = useSignal(false);
	const successSignal = useSignal(false);

	const updatePassword = $(async () => {
		errorMessage.value = '';
		if (newPassword.value === confirmPassword.value) {
			const updateCustomerPassword = await updateCustomerPasswordMutation({
				currentPassword: currentPassword.value,
				newPassword: newPassword.value,
			});
			console.log(updateCustomerPassword);

			if (updateCustomerPassword.__typename === 'Success') {
				successSignal.value = true;
				isConfirmPasswordValid.value = false;
				return;
			}

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
			}
		} else {
			errorMessage.value = 'Confirm password does not match!';
		}
	});

	return appState.customer ? (
		<div class="max-w-6xl m-auto rounded-lg p-4 space-y-4 flex justify-center">
			<form class="bg-white shadow-lg rounded-lg w-[20rem] py-4 px-6 text-sm text-gray-500 space-y-6 mt-1 relative">
				{successSignal.value && (
					<div class="mb-6 bg-yellow-50 border border-yellow-400 text-yellow-800 rounded p-4 text-center text-sm">
						<p>
							Password Changed successfully! You can now &nbsp;
							<Link href="/account" class="font-medium text-primary-600 hover:text-primary-500">
								return to your account
							</Link>
							.
						</p>
					</div>
				)}
				<PasswordInput
					label="Current Password"
					fieldValue={currentPassword}
					completeSignal={isCurrentPasswordValid}
				/>
				<PasswordInput
					label="New Password"
					fieldValue={newPassword}
					completeSignal={isNewPasswordValid}
					incompleteSignal={isConfirmPasswordValid}
					checkStrongPassword={true}
				/>
				<PasswordInput
					label="Repeat Password"
					fieldValue={confirmPassword}
					completeSignal={isConfirmPasswordValid}
					passwordToBeRepeated={newPassword}
				/>
				<button
					type="button"
					onClick$={updatePassword}
					class={`w-full bg-primary-500 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-4 py-2
						${
							!isCurrentPasswordValid.value ||
							!isNewPasswordValid.value ||
							!isConfirmPasswordValid.value
								? 'opacity-50 cursor-not-allowed'
								: ''
						}`}
				>
					Change Password
				</button>
				{errorMessage.value !== '' && !successSignal.value && (
					<div class="p-4">
						<ErrorMessage heading="Oops!" message={errorMessage.value} />
					</div>
				)}
			</form>
		</div>
	) : (
		<div class="h-[100vh]" />
	);
});
