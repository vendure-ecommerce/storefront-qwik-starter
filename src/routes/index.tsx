import { component$, Host, useContext } from '@builder.io/qwik';
import CollectionCard from '~/components/collection-card/CollectionCard';
import { APP_STATE } from '~/constants';

export const headerImage =
	'https://readonlydemo.vendure.io/assets/preview/5b/jakob-owens-274337-unsplash__preview.jpg';

export default component$(() => {
	const collections = useContext(APP_STATE).collections;
	return (
		<Host>
			<div className="relative">
				{/* Decorative image and overlay */}
				<div aria-hidden="true" className="absolute inset-0 overflow-hidden">
					{headerImage && (
						<img className="absolute inset-0 w-full" src={headerImage + '?w=800'} alt="header" />
					)}
					<div className="absolute inset-0 bg-gradient-to-br from-zinc-400 to-black mix-blend-darken" />
				</div>
				<div aria-hidden="true" className="absolute inset-0 bg-gray-900 opacity-50" />
				<div className="relative max-w-3xl mx-auto py-32 px-6 flex flex-col items-center text-center sm:py-64 lg:px-0">
					<div className="relative bg-zinc-800 bg-opacity-0 rounded-lg p-0">
						<h1 className="text-6xl text-transparent bg-clip-text font-extrabold tracking-normal lg:text-6xl bg-gradient-to-r from-yellow-600 via-red-500 to-blue-600">
							Vendure Qwik Starter
						</h1>
					</div>

					<p className="mt-4 text-2xl text-white">
						A headless commerce storefront starter kit built with{' '}
						<a
							href="https://www.vendure.io"
							target="_blank"
							className="text-blue-300 hover:text-blue-500"
						>
							Vendure
						</a>{' '}
						&{' '}
						<a
							href="https://qwik.builder.io/"
							target="_blank"
							className="text-red-300 hover:text-red-500"
						>
							Qwik
						</a>
					</p>
					<p className="mt-4 text-gray-300 space-x-1 flex">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
							/>
						</svg>
						<span>Read more:</span>
						<a
							className="text-primary-200 hover:text-primary-400"
							target="_blank"
							href="https://t.co/fC1WeDISH0"
						>
							Lightning Fast Headless Commerce with Vendure and Qwik
						</a>
					</p>
				</div>
			</div>

			<section
				aria-labelledby="category-heading"
				className="pt-24 sm:pt-32 xl:max-w-7xl xl:mx-auto xl:px-8"
			>
				<div className="px-4 sm:px-6 lg:px-8 xl:px-0">
					<h2 className="text-2xl font-light tracking-tight text-gray-900">Shop by Category</h2>
				</div>

				<div className="mt-4 flow-root">
					<div className="-my-2">
						<div className="box-content py-2 px-2 relative overflow-x-auto xl:overflow-visible">
							<div className="grid justify-items-center grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:gap-x-8">
								{collections.map((collection) =>
									!!collection.featuredAsset ? (
										<CollectionCard key={collection.id} collection={collection} />
									) : null
								)}
							</div>
						</div>
					</div>
				</div>
			</section>
		</Host>
	);
});
