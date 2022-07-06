import { component$, Host, useMount$, useStore } from '@builder.io/qwik';
import { getCollectionsQuery } from '../../graphql/queries';
import { ICollection } from '../../types';
import { sendQuery } from '../../utils/api';

export const navigation = {
	support: [
		{ name: 'Help', href: '#' },
		{ name: 'Track order', href: '#' },
		{ name: 'Shipping', href: '#' },
		{ name: 'Returns', href: '#' },
	],
	company: [
		{ name: 'About', href: '#' },
		{ name: 'Blog', href: '#' },
		{ name: 'Corporate responsibility', href: '#' },
		{ name: 'Press', href: '#' },
	],
};

export const Footer = component$(() => {
	const state = useStore<{ collections: ICollection[] }>({ collections: [] });
	useMount$(async () => {
		const data = await sendQuery<{ collections: { items: ICollection[] } }>(
			getCollectionsQuery
		);
		state.collections = data.collections.items.filter(
			(item) =>
				item.parent?.name === '__root_collection__' && !!item.featuredAsset
		);
	});
	return (
		<Host>
			<footer
				className='mt-24 border-t bg-gray-50'
				aria-labelledby='footer-heading'
			>
				<h2 id='footer-heading' className='sr-only'>
					Footer
				</h2>
				<div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 '>
					<div className='xl:grid xl:grid-cols-3 xl:gap-8'>
						<div className='grid grid-cols-2 gap-8 xl:col-span-2'>
							<div className='md:grid md:grid-cols-2 md:gap-8'>
								<div>
									<h3 className='text-sm font-semibold text-gray-500 tracking-wider uppercase'>
										Shop
									</h3>
									<ul role='list' className='mt-4 space-y-4'>
										{state.collections.map((collection) => (
											<li key={collection.id}>
												<a
													className='text-base text-gray-500 hover:text-gray-600'
													href={'/collections/' + collection.slug}
													key={collection.id}
												>
													{collection.name}
												</a>
											</li>
										))}
									</ul>
								</div>
								<div className='mt-12 md:mt-0'>
									<h3 className='text-sm font-semibold text-gray-500 tracking-wider uppercase'>
										Support
									</h3>
									<ul role='list' className='mt-4 space-y-4'>
										{navigation.support.map((item) => (
											<li key={item.name}>
												<a
													href={item.href}
													className='text-base text-gray-500 hover:text-gray-600'
												>
													{item.name}
												</a>
											</li>
										))}
									</ul>
								</div>
							</div>
							<div className='md:grid md:grid-cols-2 md:gap-8'>
								<div>
									<h3 className='text-sm font-semibold text-gray-500 tracking-wider uppercase'>
										Company
									</h3>
									<ul role='list' className='mt-4 space-y-4'>
										{navigation.company.map((item) => (
											<li key={item.name}>
												<a
													href={item.href}
													className='text-base text-gray-500 hover:text-gray-600'
												>
													{item.name}
												</a>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
						<div className='mt-8 xl:mt-0'>
							<h3 className='text-sm font-semibold text-gray-500 tracking-wider uppercase'>
								Subscribe to our newsletter
							</h3>
							<p className='mt-4 text-base text-gray-500'>
								Be the first to know about exclusive offers & deals.
							</p>
							<form className='mt-4 sm:flex sm:max-w-md'>
								<label htmlFor='email-address' className='sr-only'>
									Email address
								</label>
								<input
									type='email'
									name='email-address'
									id='email-address'
									autoComplete='email'
									required
									className='appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white focus:border-white focus:placeholder-gray-400'
									placeholder='Enter your email'
								/>
								<div className='mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0'>
									<button
										type='submit'
										className='w-full subscribe-bg-primary-500 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary-500'
									>
										Subscribe
									</button>
								</div>
							</form>
						</div>
					</div>
					<div className='mt-8 border-t pt-8'>
						<a
							className='flex items-center space-x-4 font-medium text-gray-500 hover:text-gray-700'
							href='https://github.com/vendure-ecommerce/storefront-qwik-starter'
						>
							<svg
								fill='currentColor'
								viewBox='0 0 24 24'
								className='h-6 w-6'
								aria-hidden='true'
							>
								<path
									fill-rule='evenodd'
									d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
									clip-rule='evenodd'
								/>
							</svg>
							<span>github.com/vendure-ecommerce/storefront-qwik-starter</span>
						</a>
					</div>
				</div>
			</footer>
		</Host>
	);
});
