import { component$, useSignal } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';

export default component$(() => {
	const isShow = useSignal(false);
	const loc = useLocation();
	return (
		<footer class="py-12">
			<div class="container lg:max-w-screen-xl">
				<div class="mb-4 lg:px-10">
					<ul class="items-center space-y-4 sm:flex sm:space-x-4 sm:space-y-0 lg:space-x-8">
						<li>
							<Link
								href={`/${loc.params.lang}/about`}
								class="text-base uppercase text-gray-300 transition duration-200 hover:text-red-700"
							>
								About
							</Link>
						</li>
						<li>
							<Link
								href={`/${loc.params.lang}/news`}
								class="text-base uppercase text-gray-300 transition duration-200 hover:text-red-700"
							>
								News
							</Link>
						</li>
						<li>
							<Link
								href={`/${loc.params.lang}/shop`}
								class="text-base uppercase text-gray-300 transition duration-200 hover:text-red-700"
							>
								Shop
							</Link>
						</li>
						<li>
							<Link
								href={`/${loc.params.lang}/faq`}
								class="text-base uppercase text-gray-300 transition duration-200 hover:text-red-700"
							>
								Faq
							</Link>
						</li>
						<li>
							<Link
								href={`/${loc.params.lang}/contact`}
								class="text-base uppercase text-gray-300 transition duration-200 hover:text-red-700"
							>
								Contact
							</Link>
						</li>
					</ul>
				</div>
				<div class="items-center justify-between border-t border-gray-600 pt-8 sm:flex">
					<div class="relative sm:order-2">
						{isShow.value && (
							<div
								onBlur$={() => {
									isShow.value = false;
								}}
								class="absolute bottom-full left-0 mb-2 h-60 w-52 overflow-y-auto rounded-md bg-gray-800 transition-opacity"
							>
								<ul>
									<li>
										<Link
											href="#"
											class="inline-block w-full cursor-pointer px-4 py-3 text-white transition hover:bg-gray-600 hover:underline"
										>
											Us(English)
										</Link>
									</li>
									<li>
										<Link
											href="#"
											class="inline-block w-full cursor-pointer px-4 py-3 text-white transition hover:bg-gray-600 hover:underline"
										>
											Uk(English)
										</Link>
									</li>
									<li>
										<Link
											href="#"
											class="inline-block w-full cursor-pointer px-4 py-3 text-white transition hover:bg-gray-600 hover:underline"
										>
											Us(English)
										</Link>
									</li>
									<li>
										<Link
											href="#"
											class="inline-block w-full cursor-pointer px-4 py-3 text-white transition hover:bg-gray-600 hover:underline"
										>
											Uk(English)
										</Link>
									</li>
									<li>
										<Link
											href="#"
											class="inline-block w-full cursor-pointer px-4 py-3 text-white transition hover:bg-gray-600 hover:underline"
										>
											Us(English)
										</Link>
									</li>
									<li>
										<Link
											href="#"
											class="inline-block w-full cursor-pointer px-4 py-3 text-white transition hover:bg-gray-600 hover:underline"
										>
											Uk(English)
										</Link>
									</li>
								</ul>
							</div>
						)}

						<button
							onClick$={() => {
								isShow.value = !isShow.value;
							}}
							class="inline-flex items-end text-base text-gray-100"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
								/>
							</svg>
							<span> Glob(English) </span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class={`h-5 w-5 transition ${isShow.value ? 'rotate-180' : ''}`}
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					</div>
					<div class="text-gray-400">
						<Link
							class="inline-block text-xs text-gray-400 hover:underline"
							href={`/${loc.params.lang}/privacy-policy`}
						>
							Privacy
						</Link>
						.
						<Link
							class="inline-block text-xs text-gray-400 hover:underline"
							href={`/${loc.params.lang}/cookie-policy`}
						>
							Cookies
						</Link>
						.
						<Link
							class="inline-block text-xs text-gray-400 hover:underline"
							href={`/${loc.params.lang}/privacy-policy`}
						>
							Disclaimer
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
});
