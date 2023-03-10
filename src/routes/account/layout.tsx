import {
	$,
	component$,
	Slot,
	useBrowserVisibleTask$,
	useContext,
	useSignal,
} from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { TabsContainer } from '~/components/account/TabsContainer';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { logoutMutation } from '~/graphql/mutations';
import { fullNameWithTitle } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const navigate = useNavigate();
	const appState = useContext(APP_STATE);
	const canBeVisible = useSignal(false);

	const logout = $(async () => {
		await execute(logoutMutation());
		// this force an hard refresh
		window.location.href = '/';
	});

	useBrowserVisibleTask$(() => {
		if (appState.customer.id === CUSTOMER_NOT_DEFINED_ID) {
			navigate('/');
		} else {
			canBeVisible.value = true;
		}
	});

	return (
		canBeVisible.value && (
			<div class="max-w-6xl xl:mx-auto px-4">
				<h2 class="text-3xl sm:text-5xl font-light text-gray-900 my-8">My Account</h2>
				<p class="text-gray-700 text-lg -mt-4">
					Welcome back, {fullNameWithTitle(appState.customer)}
				</p>
				<button onClick$={logout} class="underline my-4 text-primary-600 hover:text-primary-800">
					Sign out
				</button>
				<div class="flex justify-center">
					<div class="w-full text-xl text-gray-500">
						<TabsContainer>
							<Slot />
						</TabsContainer>
					</div>
				</div>
			</div>
		)
	);
});
