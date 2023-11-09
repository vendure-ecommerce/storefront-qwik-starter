import { component$, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { APP_STATE } from '~/constants';
import GitIcon from '../icons/GitIcon';

export default component$(() => {
	const collections = useContext(APP_STATE).collections.filter(
		(item) => item.parent?.name === '__root_collection__' && !!item.featuredAsset
	);

	const navigation = {
		support: [
			{ name: $localize`Help`, href: '#' },
			{ name: $localize`Track order`, href: '#' },
			{ name: $localize`Shipping`, href: '#' },
			{ name: $localize`Returns`, href: '#' },
		],
		company: [
			{ name: $localize`About`, href: '#' },
			{ name: $localize`Blog`, href: '#' },
			{ name: $localize`Corporate responsibility`, href: '#' },
			{ name: $localize`Press`, href: '#' },
		],
	};

	return (
		<footer class="pt-6 border-t bg-gray-50">
			<div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 ">
				<div class="xl:grid xl:grid-cols-3 xl:gap-8">
					<div class="grid grid-cols-2 gap-8 xl:col-span-2">
						<div class="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3 class="text-sm font-semibold text-gray-500 tracking-wider uppercase">{$localize`Shop`}</h3>
								<ul class="mt-4 space-y-4">
									{collections.map((collection) => (
										<li key={collection.id}>
											<Link
												class="text-base text-gray-500 hover:text-gray-600"
												href={`/collections/${collection.slug}`}
												key={collection.id}
											>
												{collection.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div class="mt-12 md:mt-0">
								<h3 class="text-sm font-semibold text-gray-500 tracking-wider uppercase">
									{$localize`Support`}
								</h3>
								<ul class="mt-4 space-y-4">
									{navigation.support.map((item) => (
										<li key={item.name}>
											<Link href={item.href} class="text-base text-gray-500 hover:text-gray-600">
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div class="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3 class="text-sm font-semibold text-gray-500 tracking-wider uppercase">
									{$localize`Company`}
								</h3>
								<ul class="mt-4 space-y-4">
									{navigation.company.map((item) => (
										<li key={item.name}>
											<Link href={item.href} class="text-base text-gray-500 hover:text-gray-600">
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
					<div class="mt-8 xl:mt-0">
						<h3 class="text-sm font-semibold text-gray-500 tracking-wider uppercase">
							{$localize`Subscribe to our newsletter`}
						</h3>
						<p class="mt-4 text-base text-gray-500">
							{$localize`Be the first to know about exclusive offers & deals.`}
						</p>
						<div class="mt-4 sm:flex sm:max-w-md">
							<label id="email-subscription" class="sr-only">
								Email address
							</label>
							<input
								type="email"
								autoComplete="email"
								required
								class="input-text"
								placeholder={$localize`Enter your email`}
								aria-labelledby="email-subscription"
							/>
							<div class="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
								<button class="btn-primary" onClick$={() => {}}>
									{$localize`Subscribe`}
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="mt-8 border-t pt-8">
					<a
						class="flex items-center space-x-4 font-medium text-gray-500 hover:text-gray-700"
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
