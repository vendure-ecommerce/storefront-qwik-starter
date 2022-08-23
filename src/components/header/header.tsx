import { component$, useClientEffect$, useContext } from '@builder.io/qwik';
import { APP_STATE } from '~/constants';
import { getActiveCustomerQuery } from '~/graphql/queries';
import { ActiveCustomer } from '~/types';
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
		const data = await execute<{ activeCustomer: ActiveCustomer }>(getActiveCustomerQuery());
		appState.customer =
			data.activeCustomer || ({ id: '-1', firstName: '', lastName: '' } as ActiveCustomer);
	});
	return (
		<>
			<header
				class={`bg-gradient-to-r from-blue-700 to-indigo-900 shadow-lg transform shadow-xl sticky top-0 z-10 animate-dropIn`}
			>
				<div className="bg-zinc-100 text-gray-600 shadow-inner text-center text-sm py-1 px-2 xl:px-0">
					<div className="max-w-6xl mx-2 md:mx-auto flex items-center justify-between">
						<div>
							<p className="hidden sm:block">
								Exclusive: Get your own{' '}
								<a
									href="https://github.com/vendure-ecommerce/storefront-qwik-starter"
									target="_blank"
									className="underline"
								>
									FREE storefront starter kit
								</a>
							</p>
						</div>
						{!!appState.customer && (
							<a
								href={appState.customer.id !== '-1' ? '/account' : '/sign-in'}
								className="flex space-x-1"
							>
								<UserIcon />
								<span className="mt-1">
									{appState.customer.id !== '-1' ? 'My Account' : 'Sign In'}
								</span>
							</a>
						)}
					</div>
				</div>
				<div className="max-w-6xl mx-auto p-4 flex items-center space-x-4">
					<h1 className="text-white w-10">
						<a href="/">
							<img src={`/cube-logo-small.webp`} width={40} height={31} alt="Vendure logo" />
						</a>
					</h1>
					<div className="flex space-x-4 hidden sm:block">
						{collections.map((collection) => (
							<a
								className="text-sm md:text-base text-gray-200 hover:text-white"
								href={'/collections/' + collection.slug}
								key={collection.id}
							>
								{collection.name}
							</a>
						))}
					</div>
					<div className="flex-1 md:pr-8">
						<SearchBar />
					</div>
					<div className="">
						<button
							className="relative w-9 h-9 bg-white bg-opacity-20 rounded text-white p-1"
							onClick$={() => (appState.showCart = !appState.showCart)}
						>
							<ShoppingBagIcon />
							{totalQuantity ? (
								<div className="absolute rounded-full -top-2 -right-2 bg-primary-600 w-6 h-6">
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
		</>
	);
});
