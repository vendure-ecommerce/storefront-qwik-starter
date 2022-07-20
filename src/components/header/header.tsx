import { component$, Host, mutable, useContext, useDocument, useStore } from '@builder.io/qwik';
import { APP_STATE } from '~/constants';
import Cart from '../cart/Cart';
import SearchBar from '../search-bar/SearchBar';

export default component$<{ totalQuantity: number }>(
	({ totalQuantity }) => {
		const collections = useContext(APP_STATE).collections.filter(
			(item) => item.parent?.name === '__root_collection__' && !!item.featuredAsset
		);
		const isScrollingUp = true;
		const isSignedIn = false;
		const doc = useDocument();
		const state = useStore<{ showCart: boolean }>({ showCart: false });
		return (
			<Host>
				<header
					class={`bg-gradient-to-r from-zinc-700 to-gray-900 shadow-lg transform shadow-xl ${
						isScrollingUp ? 'sticky top-0 z-10 animate-dropIn' : ''
					}`}
				>
					<div className="bg-zinc-100 text-gray-600 shadow-inner text-center text-sm py-2 px-2 xl:px-0">
						<div className="max-w-6xl mx-2 md:mx-auto flex items-center justify-between">
							<div>
								<p className="hidden sm:block">
									Exclusive: Get your own{' '}
									<a
										href="https://github.com/vendure-ecommerce/storefront-remix-starter"
										target="_blank"
										className="underline"
									>
										FREE storefront starter kit
									</a>
								</p>
							</div>
							<div>
								<a href={isSignedIn ? '/account' : '/sign-in'} className="flex space-x-1">
									{/* UserIcon */}
									<div className="mx-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											style="margin: auto"
											className="h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
									</div>
									<span className="mt-1">{isSignedIn ? 'My Account' : 'Sign In'}</span>
								</a>
							</div>
						</div>
					</div>
					<div className="max-w-6xl mx-auto p-4 flex items-center space-x-4">
						<h1 className="text-white w-10">
							<a href="/">
								<img
									src={`${doc.location.origin}/cube-logo-small.webp`}
									width={40}
									height={31}
									alt="Vendure logo"
								/>
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
								aria-label="Open cart tray"
								onClick$={() => {
									state.showCart = !state.showCart;
								}}
							>
								{/* ShoppingBagIcon */}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									style="margin: auto"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
									/>
								</svg>
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
				<Cart
					showCart={mutable(state.showCart)}
					onToggleCart$={async () => {
						state.showCart = !state.showCart;
					}}
				/>
			</Host>
		);
	},
	{
		tagName: 'header',
	}
);
