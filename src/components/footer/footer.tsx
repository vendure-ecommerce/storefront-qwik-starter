import { component$, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { APP_STATE } from '~/constants';
import GitIcon from '../icons/GitIcon';

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
export default component$(() => {
	const collections = useContext(APP_STATE).collections.filter(
		(item) => item.parent?.name === '__root_collection__' && !!item.featuredAsset
	);
	return (
		<footer className="pt-6 border-t bg-gray-50">
			<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 ">
				<div className="xl:grid xl:grid-cols-3 xl:gap-8">
					<div className="grid grid-cols-2 gap-8 xl:col-span-2">
						<div className="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
									Shop
								</h3>
								<ul className="mt-4 space-y-4">
									{collections.map((collection) => (
										<li key={collection.id}>
											<Link
												className="text-base text-gray-500 hover:text-gray-600"
												href={'/collections/' + collection.slug}
												key={collection.id}
											>
												{collection.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div className="mt-12 md:mt-0">
								<h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
									Support
								</h3>
								<ul className="mt-4 space-y-4">
									{navigation.support.map((item) => (
										<li key={item.name}>
											<Link
												href={item.href}
												className="text-base text-gray-500 hover:text-gray-600"
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
									Company
								</h3>
								<ul className="mt-4 space-y-4">
									{navigation.company.map((item) => (
										<li key={item.name}>
											<Link
												href={item.href}
												className="text-base text-gray-500 hover:text-gray-600"
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
					<div className="mt-8 xl:mt-0">
						<h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
							Subscribe to our newsletter
						</h3>
						<p className="mt-4 text-base text-gray-500">
							Be the first to know about exclusive offers & deals.
						</p>
						<form className="mt-4 sm:flex sm:max-w-md">
							<label htmlFor="email-address" className="sr-only">
								Email address
							</label>
							<input
								type="email"
								autoComplete="email"
								required
								className="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white focus:border-white focus:placeholder-gray-400"
								placeholder="Enter your email"
							/>
							<div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
								<button
									type="submit"
									className="w-full border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary-500"
								>
									Subscribe
								</button>
							</div>
						</form>
					</div>
				</div>
				<div className="mt-8 border-t pt-8">
					<a
						className="flex items-center space-x-4 font-medium text-gray-500 hover:text-gray-700"
						target="_blank"
						href="https://github.com/vendure-ecommerce/storefront-qwik-starter"
					>
						<GitIcon />
						<span>github.com/vendure-ecommerce/storefront-qwik-starter</span>
					</a>
				</div>
			</div>
		</footer>
	);
});
