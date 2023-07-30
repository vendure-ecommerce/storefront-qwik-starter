import { $, component$, useSignal } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import XCircleIcon from '~/components/icons/XCircleIcon';
import { resetPasswordMutation } from '~/providers/shop/account/account';

export default component$(() => {
	const password = useSignal('');
	const error = useSignal('');
	const location = useLocation();
	const navigate = useNavigate();

	const reset = $(async () => {
		const resetPassword = await resetPasswordMutation(
			location.url.href.split('=')[1],
			password.value
		);

		resetPassword.__typename !== 'CurrentUser'
			? (error.value = resetPassword.message)
			: navigate('/account');
	});

	return (
		<div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<h2 class="mt-6 text-center text-3xl text-gray-900">Reset password</h2>
					<p class="mt-2 text-center text-sm text-gray-600">Choose a new password</p>
					<div>
						<div class="mt-1 mb-8">
							<input
								type="password"
								value={password.value}
								required
								onInput$={(ev) => (password.value = (ev.target as HTMLInputElement).value)}
								onKeyUp$={(ev) => {
									error.value = '';
									if (ev.key === 'Enter' && !!(ev.target as HTMLInputElement).value) {
										reset();
									}
								}}
								class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							/>
						</div>
					</div>
					{error.value !== '' && (
						<div class="rounded-md bg-red-50 p-4 mb-8">
							<div class="flex">
								<div class="flex-shrink-0">
									<XCircleIcon />
								</div>
								<div class="ml-3">
									<h3 class="text-sm font-medium text-red-800">
										We ran into a problem verifying your account!
									</h3>
									<p class="text-sm text-red-700 mt-2">{error.value}</p>
								</div>
							</div>
						</div>
					)}
					<div>
						<button
							class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
							onClick$={reset}
						>
							Reset password
						</button>
					</div>
				</div>
			</div>
		</div>
	);
});
