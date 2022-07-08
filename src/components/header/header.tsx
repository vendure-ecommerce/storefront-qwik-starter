import { component$, Host, useContext, useStore } from '@builder.io/qwik';
import { COLLECTIONS } from '../../constants';
import { SearchBar } from '../search-bar/search-bar';

export interface State {
	isScrollingUp: boolean;
	isSignedIn: boolean;
	cartQuantity: number;
}

export const Header = component$(() => {
	const collections = useContext(COLLECTIONS).collections.filter(
		(item) =>
			item.parent?.name === '__root_collection__' && !!item.featuredAsset
	);
	const state: State = useStore<State>({
		isScrollingUp: true,
		isSignedIn: false,
		cartQuantity: 0,
	});
	return (
		<Host>
			<header
				class={`bg-gradient-to-r from-zinc-700 to-gray-900 shadow-lg transform shadow-xl ${
					state.isScrollingUp ? 'sticky top-0 z-10 animate-dropIn' : ''
				}`}
			>
				<div className='bg-zinc-100 text-gray-600 shadow-inner text-center text-sm py-2 px-2 xl:px-0'>
					<div className='max-w-6xl mx-2 md:mx-auto flex items-center justify-between'>
						<div>
							<p className='hidden sm:block'>
								Exclusive: Get your own{' '}
								<a
									href='https://github.com/vendure-ecommerce/storefront-remix-starter'
									target='_blank'
									className='underline'
								>
									FREE storefront starter kit
								</a>
							</p>
						</div>
						<div>
							<a
								href={state.isSignedIn ? '/account' : '/sign-in'}
								className='flex space-x-1'
							>
								{/* <UserIcon className='w-4 h-4'></UserIcon> */}
								userIcon
								<span>{state.isSignedIn ? 'My Account' : 'Sign In'}</span>
							</a>
						</div>
					</div>
				</div>
				<div className='max-w-6xl mx-auto p-4 flex items-center space-x-4'>
					<h1 className='text-white w-10'>
						<a href='/'>
							<img
								src='public/cube-logo-small.webp'
								width={40}
								height={31}
								alt='Vendure logo'
							/>
						</a>
					</h1>
					<div className='flex space-x-4 hidden sm:block'>
						{collections.map((collection) => (
							<a
								className='text-sm md:text-base text-gray-200 hover:text-white'
								href={'/collections/' + collection.slug}
								key={collection.id}
							>
								{collection.name}
							</a>
						))}
					</div>
					<div className='flex-1 md:pr-8'>
						<SearchBar />
					</div>
					<div className=''>
						<button
							className='relative w-9 h-9 bg-white bg-opacity-20 rounded text-white p-1'
							// onClick={onCartIconClick}
							aria-label='Open cart tray'
						>
							{/* <ShoppingBagIcon></ShoppingBagIcon> */}
							ShoppingBagIcon
							{state.cartQuantity ? (
								<div className='absolute rounded-full -top-2 -right-2 bg-primary-600 w-6 h-6'>
									{state.cartQuantity}
								</div>
							) : (
								''
							)}
						</button>
					</div>
				</div>
			</header>
		</Host>
	);
});
