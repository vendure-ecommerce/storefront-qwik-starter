import { $, component$, useBrowserVisibleTask$, useContext, useSignal } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import OrderCard from '~/components/account/OrderCard';
import { TabsContainer } from '~/components/account/TabsContainer';
import { APP_STATE } from '~/constants';
import { logoutMutation } from '~/graphql/mutations';
import { getActiveCustomerOrdersQuery } from '~/graphql/queries';
import { ActiveCustomerOrders } from '~/types';
import { scrollToTop } from '~/utils';
import { execute } from '~/utils/api';

export default component$(() => {
	const navigate = useNavigate();
	const appState = useContext(APP_STATE);
	const activeCustomerOrdersSignal = useSignal<ActiveCustomerOrders>();

	useBrowserVisibleTask$(async () => {
		const { activeCustomer: activeCustomerOrders } = await execute<{
			activeCustomer: ActiveCustomerOrders;
		}>(getActiveCustomerOrdersQuery());
		activeCustomerOrdersSignal.value = activeCustomerOrders;
		scrollToTop();
	});

	const fullNameWithTitle = (): string => {
		return [appState.customer?.title, appState.customer?.firstName, appState.customer?.lastName]
			.filter((x) => !!x)
			.join(' ');
	};

	const logout = $(async () => {
		await execute(logoutMutation());
		navigate('/');
	});

	return activeCustomerOrdersSignal.value ? (
		<div class="max-w-6xl xl:mx-auto px-4">
			<h2 class="text-3xl sm:text-5xl font-light text-gray-900 my-8">My Account</h2>
			<p class="text-gray-700 text-lg -mt-4">Welcome back, {fullNameWithTitle()}</p>
			<button onClick$={logout} class="underline my-4 text-primary-600 hover:text-primary-800">
				Sign out
			</button>
			<div class="flex justify-center">
				<div class="w-full text-xl text-gray-500">
					<TabsContainer activeTab="orders">
						<div q:slot="tabContent" class="min-h-[24rem] rounded-lg p-4 space-y-4">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md md:max-w-6xl mx-auto">
								{(activeCustomerOrdersSignal.value?.orders?.items || []).map((order) => (
									<div key={order.id}>
										<OrderCard order={order} />
									</div>
								))}
							</div>
						</div>
					</TabsContainer>
				</div>
			</div>
		</div>
	) : (
		<div style="height: 100vh" />
	);
});
