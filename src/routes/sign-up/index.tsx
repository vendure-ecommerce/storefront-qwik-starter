import { $, component$, useSignal } from '@qwik.dev/core';
import { PasswordInput } from '~/components/account/PasswordInput';
import CheckIcon from '~/components/icons/CheckIcon';
import XCircleIcon from '~/components/icons/XCircleIcon';
import { registerCustomerAccountMutation } from '~/providers/shop/account/account';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation

export default component$(() => {
	const email = useSignal('');
	const isEmailValid = useSignal(false);
	const firstName = useSignal('');
	const lastName = useSignal('');
	const isBasicInfoValid = useSignal(false);
	const password = useSignal('');
	const isPasswordValid = useSignal(false);
	const confirmPassword = useSignal('');
	const isConfirmPasswordValid = useSignal(false);
	const successSignal = useSignal(false);
	const error = useSignal('');

	const validateEmail = $(() => {
		isEmailValid.value = emailRegex.test(email.value);
	});

	const validateBasicInfo = $(() => {
		isBasicInfoValid.value = firstName.value !== '' && lastName.value !== '' && isEmailValid.value;
	});

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
		<div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div class="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 class="mt-6 text-center text-3xl text-gray-900">Create a new account</h2>
				<p class="mt-2 text-center text-sm text-gray-600">
					Or{' '}
					<a href="/sign-in" class="font-medium text-primary-600 hover:text-primary-500">
						login to your existing account
					</a>
				</p>
			</div>

			<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					{successSignal.value && (
						<div class="mb-6 bg-yellow-50 border border-yellow-400 text-yellow-800 rounded p-4 text-center text-sm">
							<p>
								Account registration successful! We sent email verification to {email.value}, you
								must verify before logging in.
							</p>
						</div>
					)}

					<div class="space-y-6">
						<div>
							<label class="block text-sm font-medium text-gray-700">Email address</label>
							<div class="mt-1 relative">
								<input
									type="email"
									autoComplete="email"
									value={email.value}
									required
									onInput$={(_, el) => {
										email.value = el.value;
										validateEmail();
										validateBasicInfo();
									}}
									class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
								{isEmailValid.value && (
									<div class="absolute inset-y-0 right-0 pr-3 flex items-center">
										<CheckIcon forcedClass="text-green-600 w-6 h-6" />
									</div>
								)}
							</div>
							{!isEmailValid.value && <p class="text-sm text-red-600 mt-2">*required</p>}
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700">First name</label>
							<div class="mt-1 relative">
								<input
									type="text"
									value={firstName.value}
									required
									onInput$={(_, el) => {
										firstName.value = el.value;
										validateBasicInfo();
									}}
									class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
								{firstName.value !== '' && (
									<div class="absolute inset-y-0 right-0 pr-3 flex items-center">
										<CheckIcon forcedClass="text-green-600 w-6 h-6" />
									</div>
								)}
							</div>
							{firstName.value === '' && <p class="text-sm text-red-600 mt-2">*required.</p>}
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700">Last name</label>
							<div class="mt-1 relative">
								<input
									type="text"
									value={lastName.value}
									required
									onInput$={(_, el) => {
										lastName.value = el.value;
										validateBasicInfo();
									}}
									class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
								{lastName.value !== '' && (
									<div class="absolute inset-y-0 right-0 pr-3 flex items-center">
										<CheckIcon forcedClass="text-green-600 w-6 h-6" />
									</div>
								)}
							</div>
							{lastName.value === '' && <p class="text-sm text-red-600 mt-2">*required.</p>}
						</div>

						<PasswordInput
							label="Password"
							fieldValue={password}
							completeSignal={isPasswordValid}
							incompleteSignal={isConfirmPasswordValid}
							checkStrongPassword={true}
						/>

						<PasswordInput
							label="Repeat Password"
							fieldValue={confirmPassword}
							completeSignal={isConfirmPasswordValid}
							passwordToBeRepeated={password}
						/>

						{error.value !== '' && (
							<div class="rounded-md bg-red-50 p-4">
								<div class="flex">
									<div class="flex-shrink-0">
										<XCircleIcon />
									</div>
									<div class="ml-3">
										<h3 class="text-sm font-medium text-red-800">
											We ran into a problem signing you up!
										</h3>
										<p class="text-sm text-red-700 mt-2">{error.value}</p>
									</div>
								</div>
							</div>
						)}
						<div>
							<button
								class={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
									!isBasicInfoValid.value || !isPasswordValid.value || !isConfirmPasswordValid.value
										? 'opacity-50 cursor-not-allowed'
										: ''
								}`}
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
		</div>
	);
});
