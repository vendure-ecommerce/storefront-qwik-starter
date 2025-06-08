import { $, component$, useSignal } from '@qwik.dev/core';
import { useNavigate } from '@qwik.dev/router';
import { PasswordInput } from '~/components/account/PasswordInput';
import XCircleIcon from '~/components/icons/XCircleIcon';
import { loginMutation } from '~/providers/shop/account/account';

import { GoogleSignInButton } from '~/components/account/GoogleSignIn';
import { GOOGLE_CLIENT_ID } from '~/constants';

export default component$(() => {
	const navigate = useNavigate();
	const email = useSignal('');
	const password = useSignal('');
	const setPasswordValid = useSignal(false);
	const rememberMe = useSignal(true);
	const error = useSignal('');

	const login = $(async () => {
		const { login } = await loginMutation(email.value, password.value, rememberMe.value);
		if (login.__typename === 'CurrentUser') {
			navigate('/account');
		} else {
			error.value = login.message;
		}
	});

	return (
		<div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div class="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 class="mt-6 text-center text-3xl text-gray-900">Sign in to your account</h2>
			</div>

			<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<div class="space-y-6">
						<div>
							<label class="block text-sm font-medium text-gray-700">Email address</label>
							<div class="mt-1">
								<input
									type="email"
									autoComplete="email"
									value={email.value}
									required
									onInput$={(_, el) => (email.value = el.value)}
									class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>
						</div>
						<PasswordInput
							label="Password"
							fieldValue={password}
							completeSignal={setPasswordValid}
							withoutCompleteMark={true}
						/>

						{/* <div>
							<label class="block text-sm font-medium text-gray-700">Password</label>
							<div class="mt-1">
								<input
									type="password"
									value={password.value}
									required
									onInput$={(_, el) => (password.value = el.value)}
									onKeyUp$={(ev, el) => {
										if (ev.key === 'Enter' && !!el.value) {
											login();
										}
									}}
									class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>
						</div> */}

						<div class="flex items-center justify-between">
							<div class="flex items-center">
								<input
									type="checkbox"
									checked
									onChange$={(_, el) => (rememberMe.value = el.checked)}
									class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
								/>
								<label class="ml-2 block text-sm text-gray-900">Remember me</label>
							</div>

							<div class="text-sm">
								<button
									onClick$={() => navigate('/forgot-password')}
									class="font-medium text-primary-600 hover:text-primary-500"
								>
									Forgot your password?
								</button>
							</div>
						</div>

						{error.value !== '' && (
							<div class="rounded-md bg-red-50 p-4">
								<div class="flex">
									<div class="flex-shrink-0">
										<XCircleIcon />
									</div>
									<div class="ml-3">
										<h3 class="text-sm font-medium text-red-800">
											We ran into a problem signing you in!
										</h3>
										<p class="text-sm text-red-700 mt-2">{error.value}</p>
									</div>
								</div>
							</div>
						)}
						<div>
							<button
								class={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
									${!setPasswordValid.value || email.value === '' ? 'opacity-50 cursor-not-allowed' : ''}
								`}
								disabled={!setPasswordValid.value || email.value === ''}
								onClick$={login}
							>
								Sign in
							</button>
						</div>
					</div>
				</div>
				{/* horizontal line with "Or" in the middle */}
				<div class="mt-4 relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-gray-300"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="px-2 bg-white text-gray-500">Or</span>
					</div>
				</div>
				<div class="mt-4">
					<div class="space-y-4">
						<p class="mt-1 text-center text-sm text-gray-600">
							<a href="/sign-up" class="font-medium text-primary-600 hover:text-primary-500">
								Register a new account
							</a>
						</p>
						<GoogleSignInButton googleClientId={GOOGLE_CLIENT_ID} />
					</div>
				</div>
			</div>
		</div>
	);
});
