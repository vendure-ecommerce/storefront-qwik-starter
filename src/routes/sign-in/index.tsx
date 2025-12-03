import { $, component$, useSignal } from '@qwik.dev/core';
import { Link, useNavigate } from '@qwik.dev/router';
import { PasswordInput } from '~/components/account/PasswordInput';
import XCircleIcon from '~/components/icons/XCircleIcon';
import { loginMutation } from '~/providers/shop/account/account';

import { GoogleSignInButton } from '~/components/account/GoogleSignIn';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import { GOOGLE_CLIENT_ID } from '~/constants';

export default component$(() => {
	const navigate = useNavigate();
	const email = useSignal('');
	const password = useSignal('');
	const setPasswordValid = useSignal(false);
	const rememberMe = useSignal(true);
	const error = useSignal('');

	const onLogin$ = $(async () => {
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
				<h2 class="mt-6 text-center text-3xl text-gray-900">{$localize`Sign in to your account`}</h2>
			</div>

			<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form
						preventdefault:submit
						onSubmit$={$(async () => {
							// Only submit when password and email are valid
							if (!setPasswordValid.value || email.value === '') return;
							await onLogin$();
						})}
						class="space-y-6"
					>
						<div>
							<label class="block text-sm font-medium text-gray-700">{$localize`Email address`}</label>
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
						<div class="flex items-center justify-between">
							<div class="flex items-center">
								<input
									type="checkbox"
									checked
									onChange$={(_, el) => (rememberMe.value = el.checked)}
									class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
								/>
								<label class="ml-2 block text-sm text-gray-900">{$localize`Remember me`}</label>
							</div>

							<div class="text-sm">
								<button
									onClick$={() => navigate('/forgot-password')}
									class="font-medium text-primary-600 hover:text-primary-500"
									type="button"
								>
									{$localize`Forgot your password?`}
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
											{$localize`We ran into a problem signing you in!`}
										</h3>
										<p class="text-sm text-red-700 mt-2">{error.value}</p>
									</div>
								</div>
							</div>
						)}
						<div>
							<HighlightedButton
								disabled={!setPasswordValid.value || email.value === ''}
								extraClass="w-full flex justify-center"
								type="submit"
							>
								{$localize`Sign in`}
							</HighlightedButton>
						</div>
					</form>
				</div>
				{/* horizontal line with "Or" in the middle */}
				<div class="mt-4 relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-gray-300"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="px-2 bg-white text-gray-500">{$localize`Or`}</span>
					</div>
				</div>
				<div class="mt-4">
					<div class="space-y-4">
						<p class="mt-1 text-center text-sm text-gray-600">
							<Link href="/sign-up" class="font-medium text-primary-600 hover:text-primary-500">
								{$localize`Register a new account`}
							</Link>
						</p>
						<GoogleSignInButton googleClientId={GOOGLE_CLIENT_ID} />
					</div>
				</div>
			</div>
		</div>
	);
});
