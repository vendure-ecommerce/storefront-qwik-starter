import { Slot, component$, useContext, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { TabsContainer } from '~/components/account/TabsContainer';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { fullNameWithTitle } from '~/utils';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const nav = useNavigate();

	useVisibleTask$(async () => {
		if (appState.customer.id === CUSTOMER_NOT_DEFINED_ID) {
			nav('/');
		}
	});

	return (
		<div class="px-4 min-h-screen">
			<div class="max-w-6xl m-auto flex items-baseline justify-between mb-8">
				<p class="text-2xl mt-8 mr-4">Welcome back, {fullNameWithTitle(appState.customer)}</p>
			</div>
			<div class="flex justify-center">
				<div class="w-full text-xl ">
					<TabsContainer>
						<Slot />
					</TabsContainer>
				</div>
			</div>
		</div>
	);
});
