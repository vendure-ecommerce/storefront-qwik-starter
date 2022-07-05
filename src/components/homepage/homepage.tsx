import {
	component$,
	Host,
	useMount$,
	useScopedStyles$,
	useStore,
} from '@builder.io/qwik';
import { collections } from '../../mock-data';
import { CollectionCard } from '../collection-card/collection-card';
import styles from './homepage.scss?inline';

export const headerImage =
	'https://readonlydemo.vendure.io/assets/preview/5b/jakob-owens-274337-unsplash__preview.jpg';

export const Homepage = component$(() => {
	const store = useStore<{ list: null | string[] }>({ list: null });
	useScopedStyles$(styles);
	useMount$(async () => {
		// const data = await fetch('https://swapi.dev/api/people/1/?format=json');
		// const json = data.json();

		store.list = ['aaa'];
	});

	return (
		<Host>
			<div className='relative'>
				{/* Decorative image and overlay */}
				<div aria-hidden='true' className='absolute inset-0 overflow-hidden'>
					{headerImage && (
						<img
							className='absolute inset-0 w-full'
							src={headerImage + '?w=800'}
							alt='header'
						/>
					)}
					<div className='absolute inset-0 bg-gradient-to-br from-zinc-400 to-black mix-blend-darken' />
				</div>
				<div
					aria-hidden='true'
					className='absolute inset-0 bg-gray-900 opacity-50'
				/>
				<div className='relative max-w-3xl mx-auto py-32 px-6 flex flex-col items-center text-center sm:py-64 lg:px-0'>
					<div className='relative bg-zinc-800 bg-opacity-0 rounded-lg p-0'>
						<h1 className='text-6xl text-transparent bg-clip-text font-extrabold tracking-normal lg:text-6xl bg-gradient-to-r from-yellow-600 via-red-500 to-blue-600'>
							Vendure Qwik Starter
						</h1>
					</div>

					<p className='mt-4 text-2xl text-white'>
						A headless commerce storefront starter kit built with{' '}
						<a
							href='https://www.vendure.io'
							className='text-blue-300 hover:text-blue-500'
						>
							Vendure
						</a>{' '}
						&{' '}
						<a
							href='~/routes/__cart/index'
							className='text-red-300 hover:text-red-500'
						>
							Remix
						</a>
					</p>
					<p className='mt-4 text-gray-300 space-x-1 flex'>
						<svg
							class='w-5 h-5 text-blue-500'
							width='24'
							height='24'
							viewBox='0 0 24 24'
							stroke-width='2'
							stroke='currentColor'
							fill='none'
							stroke-linecap='round'
							stroke-linejoin='round'
						>
							{' '}
							<path stroke='none' d='M0 0h24v24H0z' />{' '}
							<path d='M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0' />{' '}
							<path d='M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0' />{' '}
							<line x1='3' y1='6' x2='3' y2='19' />{' '}
							<line x1='12' y1='6' x2='12' y2='19' />{' '}
							<line x1='21' y1='6' x2='21' y2='19' />
						</svg>
						<span>Read more:</span>
						<a
							className='text-primary-200 hover:text-primary-400'
							href='https://www.vendure.io/blog/2022/05/lightning-fast-headless-commerce-with-vendure-and-remix'
						>
							Lightning Fast Headless Commerce with Vendure and Remix
						</a>
					</p>
				</div>
			</div>

			<section
				aria-labelledby='category-heading'
				className='pt-24 sm:pt-32 xl:max-w-7xl xl:mx-auto xl:px-8'
			>
				<div className='px-4 sm:px-6 lg:px-8 xl:px-0'>
					<h2
						id='category-heading'
						className='text-2xl font-light tracking-tight text-gray-900'
					>
						Shop by Category
					</h2>
				</div>

				<div className='mt-4 flow-root'>
					<div className='-my-2'>
						<div className='box-content py-2 px-2 relative overflow-x-auto xl:overflow-visible'>
							<div className='grid justify-items-center grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:gap-x-8'>
								{collections.map((collection) => (
									<CollectionCard key={collection.id} collection={collection} />
								))}
							</div>
						</div>
					</div>
				</div>

				<div className='mt-6 px-4 sm:hidden'>
					<a
						href='~/routes/__cart/index#'
						className='block text-sm font-semibold text-primary-600 hover:text-primary-500'
					>
						Browse all categories
						<span aria-hidden='true'> &rarr;</span>
					</a>
				</div>
			</section>
		</Host>
	);
});
