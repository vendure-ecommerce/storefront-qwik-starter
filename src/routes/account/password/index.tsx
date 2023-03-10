import {
	$,
	QwikChangeEvent,
	component$,
	useBrowserVisibleTask$,
	useContext,
	useSignal,
} from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import { ErrorMessage } from '~/components/error-message/ErrorMessage';
import CheckIcon from '~/components/icons/CheckIcon';
import { APP_STATE } from '~/constants';
import { updateCustomerPasswordMutation } from '~/graphql/mutations';
import { getActiveCustomerQuery } from '~/graphql/queries';
import { ActiveCustomer } from '~/types';
import { scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const navigate = useNavigate();
	const appState = useContext(APP_STATE);
	const currentPassword = useSignal('');
	const newPassword = useSignal('');
	const confirmPassword = useSignal('');
	const errorMessage = useSignal('');

	useBrowserVisibleTask$(async () => {
		const { activeCustomer } = await execute<{ activeCustomer: ActiveCustomer }>(
			getActiveCustomerQuery()
		);
		if (!activeCustomer) {
			navigate('/sign-in');
		}
		appState.customer = activeCustomer;
		scrollToTop();
	});

	const updatePassword = $(async () => {
		if (newPassword.value === confirmPassword.value) {
			const result = await execute<{
				currentPassword: string;
				newPassword: string;
			}>(updateCustomerPasswordMutation(currentPassword.value, newPassword.value));
			console.log(result);
		} else {
			errorMessage.value = 'Confirm password does not match!';
		}
	});

	return appState.customer ? (
		<div class="min-h-[24rem] rounded-lg p-4 space-y-4">
			<div class="md:col-span-2 md:w-1/4">
				<h3 class="text-sm text-gray-500">Current Password</h3>
				<input
					type="password"
					onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
						currentPassword.value = event.target.value;
					})}
					class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
				/>
			</div>
			<div class="md:col-span-2 md:w-1/4">
				<h3 class="text-sm text-gray-500">New Password</h3>
				<input
					type="password"
					onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
						newPassword.value = event.target.value;
					})}
					class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
				/>
			</div>
			<div class="md:col-span-2 md:w-1/4">
				<h3 class="text-sm text-gray-500">Confirm Password</h3>
				<input
					type="password"
					onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => {
						confirmPassword.value = event.target.value;
					})}
					class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
				/>
			</div>
			<div class="flex gap-x-4">
				<HighlightedButton
					onClick$={() => {
						updatePassword();
					}}
				>
					<CheckIcon /> &nbsp; Save
				</HighlightedButton>
			</div>
			{errorMessage.value !== '' && (
				<ErrorMessage
					heading="We ran into a problem changing your password!"
					message={errorMessage.value}
				/>
			)}
		</div>
	) : (
		<div class="h-[100vh]" />
	);
});
