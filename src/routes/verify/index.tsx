import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import XCircleIcon from '~/components/icons/XCircleIcon';
import { verifyCustomerAccountMutation } from '~/providers/shop/account/account';

export default component$(() => {
	const error = useSignal('');
	const location = useLocation();
	const navigate = useNavigate();

	useVisibleTask$(async () => {
		const { verifyCustomerAccount } = await verifyCustomerAccountMutation(
			location.url.href.split('=')[1]
		);

		verifyCustomerAccount.__typename !== 'CurrentUser'
			? (error.value = verifyCustomerAccount.message)
			: navigate('/account');
	});

	return (
		<div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					{error.value !== '' && (
						<div class="rounded-md bg-red-50 p-4">
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
				</div>
			</div>
		</div>
	);
});
