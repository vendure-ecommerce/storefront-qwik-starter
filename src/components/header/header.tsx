import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { LuShoppingCart, LuUser } from '@qwikest/icons/lucide';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { logoutMutation } from '~/providers/shop/account/account';
import SignInFormDialog from '../account/SignInFormDialog/SignInFormDialog';
import LogoutIcon from '../icons/LogoutIcon';
import MenuIcon from '../icons/MenuIcon';
import UserIcon from '../icons/UserIcon';
import SearchBar from '../search-bar/SearchBar';
import ThemeController from '../theme-controller/ThemeController';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const collections = useContext(APP_STATE).collections.filter(
		(item) => item.parent?.name === '__root_collection__' && !!item.featuredAsset
	);
	const openSignInForm = useSignal(false);

	const totalQuantity =
		appState.activeOrder?.state !== 'PaymentAuthorized'
			? appState.activeOrder?.totalQuantity || 0
			: 0;

	const logout = $(async () => {
		await logoutMutation();
		// force hard refresh
		window.location.href = '/';
	});

	return (
		<div
			class={`bg-gradient-to-r from-primary to-secondary transform shadow-xl sticky top-0 z-10 animate-dropIn`}
		>
			<header>
				<div class=" shadow-inner text-center text-sm py-1 px-2 xl:px-0">
					<div class="max-w-6xl mx-2 h-5 min-h-full md:mx-auto flex items-center justify-between my-1">
						<div class="flex justify-between items-center w-full">
							<div>{/* Add your promotion message here, e.g. free shipping over $50 */}</div>
							<div class="flex mr-15 2xl:mr-0">
								{appState.customer.id !== CUSTOMER_NOT_DEFINED_ID ? (
									<>
										<Link href="/account" class="flex items-center space-x-1 pb-1 pr-2 mr-5">
											<UserIcon />
											<span class="mt-1 text-base-content">
												{appState.customer.firstName || appState.customer.lastName
													? appState.customer.firstName + ' ' + appState.customer.lastName
													: $localize`Account`}
											</span>
										</Link>
										<button onClick$={logout} class="btn btn-ghost p-0">
											<div class="flex items-center cursor-pointer">
												<span class="mr-2">{$localize`Logout`}</span>
												<LogoutIcon />
											</div>
										</button>
									</>
								) : (
									<div
										class="flex items-center space-x-1 pb-1 pr-2 mr-5 cursor-pointer gap"
										onClick$={() => (openSignInForm.value = true)}
									>
										<LuUser class="w-6 h-6" />
										<span class="mt-1 text-base-content">{$localize`Sign In`}</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div class="max-w-6xl mx-auto p-4 flex items-center space-x-4">
					<button
						class="btn btn-ghost block sm:hidden"
						onClick$={() => (appState.showMenu = !appState.showMenu)}
					>
						<span class="sr-only">Menu</span>
						<MenuIcon />
					</button>
					<h1 class="text-white w-10">
						<Link href="/">
							<img src={`/cube-logo-small.webp`} width={40} height={31} alt="Vendure logo" />
						</Link>
					</h1>
					<div class="hidden space-x-4 sm:block">
						{collections.map((collection) => (
							<Link
								class="text-base-content text-sm"
								href={`/collections/${collection.slug}`}
								key={collection.id}
							>
								{collection.name}
							</Link>
						))}
					</div>
					<div class="flex-1 block md:pr-8">
						<SearchBar />
					</div>
					<div class="indicator">
						{totalQuantity && (
							<span class="indicator-item badge badge-primary">{totalQuantity}</span>
						)}
						<button
							name="Cart"
							aria-label={`${totalQuantity} items in cart`}
							class="btn btn-md relative w-9 h-9 p-1"
							onClick$={() => (appState.showCart = !appState.showCart)}
						>
							<LuShoppingCart class="w-6 h-6" />
						</button>
					</div>
					<ThemeController />
				</div>
			</header>
			<SignInFormDialog open={openSignInForm} />
		</div>
	);
});
