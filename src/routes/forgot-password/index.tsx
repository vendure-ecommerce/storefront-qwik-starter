import { $, component$, useSignal } from '@builder.io/qwik';
import XCircleIcon from '~/components/icons/XCircleIcon';
import { requestPasswordResetMutation } from '~/providers/shop/account/account';

export default component$(() => {
	const email = useSignal('');
	const error = useSignal('');
	const success = useSignal(false);

	const reset = $(async () => {
		const requestPasswordReset = await requestPasswordResetMutation(email.value);
		requestPasswordReset?.__typename === 'Success'
			? (success.value = true)
			: (error.value = requestPasswordReset?.message ?? 'Reset password error');
	});
	return (
		<div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					{success.value && (
						<div class="mb-6 bg-yellow-50 border border-yellow-400 text-yellow-800 rounded p-4 text-center text-sm">
							<p>Password reset email sent to {email.value}</p>
						</div>
					)}
					<div class="space-y-6">
						<div>
							<label class="block text-sm font-medium text-gray-700">Email</label>
							<div class="mt-1">
								<input
									type="email"
									value={email.value}
									required
									onInput$={(ev) => (email.value = (ev.target as HTMLInputElement).value)}
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
							<div class="rounded-md bg-red-50 p-4">
								<div class="flex">
									<div class="flex-shrink-0">
										<XCircleIcon />
									</div>
									<div class="ml-3">
										<h3 class="text-sm font-medium text-red-800">
											We ran into a problem resetting your password!
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
		</div>
	);
});
