import { $, component$ } from '@builder.io/qwik';
// import { APP_STATE } from '~/constants';
import { loginMutation } from '~/graphql/mutations';
import { ActiveCustomer } from '~/types';
import { execute } from '~/utils/api';

export default component$(() => {
	// const appState = useContext(APP_STATE);
	const email = 'test@vendure.io';
	const password = 'test';
	const rememberMe = false;
	const login = $(async () => {
		await execute<{ login: ActiveCustomer }>(loginMutation(email, password, rememberMe));
		window.location.href = '/account';
	});
	return (
		<>
			<div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<h2 className="mt-6 text-center text-3xl text-gray-900">Sign in to your account</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{' '}
						<a href="#" className="font-medium text-primary-600 hover:text-primary-500">
							register a new account
						</a>
					</p>
				</div>

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
						<div className="bg-yellow-50 border border-yellow-400 text-yellow-800 rounded p-4 text-center text-sm">
							<p>Demo credentials</p>
							<p>
								Email address: <span className="font-bold">test@vendure.io</span>
							</p>
							<p>
								Password: <span className="font-bold">test</span>
							</p>
						</div>
						<div className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-700">Email address</label>
								<div className="mt-1">
									<input
										type="email"
										autoComplete="email"
										value="test@vendure.io"
										disabled
										required
										className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">Password</label>
								<div className="mt-1">
									<input
										type="password"
										value="test"
										disabled
										required
										className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
									/>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<input
										type="checkbox"
										disabled
										className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
									/>
									<label className="ml-2 block text-sm text-gray-900">Remember me</label>
								</div>

								<div className="text-sm">
									<span className="font-medium text-primary-600 hover:text-primary-500">
										Forgot your password?
									</span>
								</div>
							</div>

							<div>
								<button
									className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
									onClick$={login}
								>
									Sign in
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
});
