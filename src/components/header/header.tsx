import { component$, useClientEffect$, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { getActiveCustomerQuery, getActiveOrderQuery } from '~/graphql/queries';
import { ActiveCustomer, ActiveOrder } from '~/types';
import { execute } from '~/utils/api';
import Cart from '../cart/Cart';
import ShoppingBagIcon from '../icons/ShoppingBagIcon';
import UserIcon from '../icons/UserIcon';
import SearchBar from '../search-bar/SearchBar';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const collections = useContext(APP_STATE).collections.filter(
		(item) => item.parent?.name === '__root_collection__' && !!item.featuredAsset
	);

	const totalQuantity =
		appState.activeOrder?.state !== 'PaymentAuthorized'
			? appState.activeOrder?.totalQuantity || 0
			: 0;

	useClientEffect$(async () => {
		const { activeOrder } = await execute<{ activeOrder: ActiveOrder }>(getActiveOrderQuery());
		if (activeOrder.customer) {
			appState.customer = activeOrder?.customer;
		}
		if (appState.customer.id === CUSTOMER_NOT_DEFINED_ID) {
			const { activeCustomer } = await execute<{ activeCustomer: ActiveCustomer }>(
				getActiveCustomerQuery()
			);
			if (activeOrder.customer) {
				appState.customer = activeCustomer;
			}
		}
	});

	return (
		<div>
			<header
				class={`bg-gradient-to-r from-blue-700 to-indigo-900 shadow-lg transform shadow-xl sticky top-0 z-10 animate-dropIn`}
			>
				<div class="bg-zinc-100 text-gray-600 shadow-inner text-center text-sm py-1 px-2 xl:px-0">
					<div class="max-w-6xl mx-2 h-5 min-h-full md:mx-auto flex items-center justify-between">
						<div>
							<p class="hidden sm:block">
								Exclusive: Get your own{' '}
								<a
									href="https://github.com/vendure-ecommerce/storefront-qwik-starter"
									target="_blank"
									class="underline"
								>
									FREE storefront starter kit
								</a>
							</p>
						</div>
						{!!appState.customer && (
							<Link
								href={appState.customer.id !== CUSTOMER_NOT_DEFINED_ID ? '/account' : '/sign-in'}
								class="flex space-x-1"
							>
								<UserIcon />
								<span class="mt-1">
									{appState.customer.id !== CUSTOMER_NOT_DEFINED_ID ? 'My Account' : 'Sign In'}
								</span>
							</Link>
						)}
					</div>
				</div>
				<div class="max-w-6xl mx-auto p-4 flex items-center space-x-4">
					<h1 class="text-white w-10">
						<Link href="/">
							<img src={`/cube-logo-small.webp`} width={40} height={31} alt="Vendure logo" />
						</Link>
					</h1>
					<div class="flex space-x-4 hidden sm:block">
						{collections.map((collection) => (
							<Link
								class="text-sm md:text-base text-gray-200 hover:text-white"
								href={'/collections/' + collection.slug}
								key={collection.id}
							>
								{collection.name}
							</Link>
						))}
					</div>
					<div class="flex-1 md:pr-8">
						<SearchBar />
					</div>
					<div class="">
						<button
							name="Cart"
							aria-label={`${totalQuantity} items in cart`}
							class="relative w-9 h-9 bg-white bg-opacity-20 rounded text-white p-1"
							onClick$={() => (appState.showCart = !appState.showCart)}
						>
							<ShoppingBagIcon />
							{totalQuantity ? (
								<div class="absolute rounded-full -top-2 -right-2 bg-primary-600 w-6 h-6">
									{totalQuantity}
								</div>
							) : (
								''
							)}
						</button>
					</div>
				</div>
			</header>
			<Cart />
		</div>
	);
});
