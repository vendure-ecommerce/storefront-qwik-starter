import { $, component$, useComputed$, useContext, useSignal } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { LuXCircle } from '@qwikest/icons/lucide';
import { PasswordInput } from '~/components/account/PasswordInput';
import SignInFormDialog from '~/components/account/SignInFormDialog/SignInFormDialog';
import GeneralInput from '~/components/common/GeneralInput';
import { APP_STATE } from '~/constants';
import { registerCustomerAccountMutation } from '~/providers/shop/account/account';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation

export default component$(() => {
	const email = useSignal('');
	const isEmailValid = useSignal(false);
	const firstName = useSignal('');
	const lastName = useSignal('');
	const isBasicInfoValid = useComputed$(() => {
		return firstName.value !== '' && lastName.value !== '' && isEmailValid.value;
	});
	const password = useSignal('');
	const isPasswordValid = useSignal(false);
	const confirmPassword = useSignal('');
	const isConfirmPasswordValid = useSignal(false);
	const successSignal = useSignal(false);
	const error = useSignal('');
	const openSignInForm = useSignal(false);
	const appState = useContext(APP_STATE);
	const navigate = useNavigate();

	const registerCustomer = $(async (): Promise<void> => {
		if (
			email.value === '' ||
			firstName.value === '' ||
			lastName.value === '' ||
			password.value === ''
		) {
			error.value = 'All fields are required';
		} else if (password.value !== confirmPassword.value) {
			error.value = 'Passwords do not match';
			isConfirmPasswordValid.value = false;
		} else {
			error.value = '';
			successSignal.value = false;

			const { registerCustomerAccount } = await registerCustomerAccountMutation({
				input: {
					emailAddress: email.value,
					firstName: firstName.value,
					lastName: lastName.value,
					password: password.value,
				},
			});
			if (registerCustomerAccount.__typename === 'Success') {
				successSignal.value = true;
			} else {
				error.value = registerCustomerAccount.message;
			}
		}
	});

	return (
		<div class="flex flex-col justify-center py-6 sm:px-6 lg:px-8 md:w-96 lg:w-1/2 mx-auto">
			<div class="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 class="mt-6 text-center text-3xl ">{$localize`Create a new account`}</h2>
			</div>

			<div class="mt-1 sm:mx-auto sm:w-full sm:max-w-md">
				<div class=" py-8 px-4 shadow sm:rounded-lg sm:px-10">
					{successSignal.value && (
						<div class="mb-6 border bg-success text-success-content rounded p-4 text-center text-sm">
							<p>
								Account registration successful! We sent email verification to {email.value}, you
								must verify before logging in.
							</p>
						</div>
					)}

					{error.value !== '' && (
						<div role="alert" class="alert alert-error flex">
							<LuXCircle class="w-6 h-6" />
							<span>{error.value}</span>
						</div>
					)}

					<div class="space-y-6">
						<GeneralInput
							label="Email address"
							type="email"
							fieldValue={email}
							completeSignal={isEmailValid}
							extraClass="w-full"
						/>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<GeneralInput
								label="First name"
								type="text"
								fieldValue={firstName}
								pattern={/.{1,30}/}
							/>

							<GeneralInput
								label="Last name"
								type="text"
								fieldValue={lastName}
								pattern={/.{1,30}/}
							/>
						</div>

						<PasswordInput
							label="Password"
							fieldValue={password}
							completeSignal={isPasswordValid}
							incompleteSignal={isConfirmPasswordValid}
							checkStrongPassword={true}
							extraClass="w-full"
						/>

						<PasswordInput
							label="Repeat Password"
							fieldValue={confirmPassword}
							completeSignal={isConfirmPasswordValid}
							passwordToBeRepeated={password}
							extraClass="w-full"
						/>

						<div>
							<button
								class="btn btn-accent w-full"
								disabled={
									!isBasicInfoValid.value || !isPasswordValid.value || !isConfirmPasswordValid.value
								}
								onClick$={registerCustomer}
							>
								Sign up
							</button>
						</div>
					</div>
				</div>
			</div>
			<div class="divider">OR</div>
			<div class="sm:mx-auto sm:w-full sm:max-w-md">
				<p class="mt-2 text-center text-sm ">{$localize`Already have an account?`}</p>
				<div class="text-center text-sm link" onClick$={() => (openSignInForm.value = true)}>
					{$localize`Sign In`}
				</div>
			</div>

			<SignInFormDialog
				open={openSignInForm}
				onSuccess$={async (customer) => {
					appState.customer = customer;
					navigate('/account');
				}}
			/>
		</div>
	);
});
