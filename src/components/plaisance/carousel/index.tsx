import { component$ } from '@builder.io/qwik';

export default component$(() => {
	return (
		<section class="py-12">
			<div class="hidden lg:block">
				<div x-data="bottleSlider" class="relative w-full" x-ref="root">
					<div class="sticky left-0 top-0 h-screen w-full overflow-x-hidden">
						<div x-ref="slider" class="absolute left-0 top-0 h-full w-[4400px]">
							<div class="absolute top-[15%] flex h-[60%] w-full justify-between 2xl:h-[70%]">
								<div class="slide-item h-full w-[400px] shrink-0">
									<a
										href="/en/product/refined-granite-fish.html"
										x-data="followMouse"
										class="group relative block p-0 text-center brightness-75 transition duration-500 hover:brightness-100"
									>
										<picture>
											<source type="image/webp" srcSet="/img/bottles/bottle_1.webp" />
											<img
												src="/img/bottles/bottle_1.png"
												class="mx-auto w-full max-w-[288px]"
												alt="Cabernet Savignon Black Image"
												width="893"
												height="1383"
												loading="lazy"
												decoding="async"
											/>
										</picture>
										<h3 class="font-heading text-2xl text-gray-200 sm:mt-4">
											Cabernet Savignon Black
										</h3>
										<div class="mt-2 text-lg text-red-700">$ 22.70 USD</div>
										<div class="hidden md:block">
											<div
												x-ref="ball"
												class="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full bg-red-700/70 opacity-0 group-hover:scale-100 group-hover:opacity-100"
											>
												<span class="font-heading text-xl text-white">Buy</span>
											</div>
											<div class="absolute inset-0 z-10" x-ref="main"></div>
										</div>
										<div class="md:hidden">
											<button class="mt-4 bg-red-700 px-4 py-2 font-semibold text-gray-300">
												View More
											</button>
										</div>
									</a>
								</div>
								<div class="slide-item h-full w-[400px] shrink-0">
									<a
										href="/en/product/refined-granite-fish.html"
										x-data="followMouse"
										class="group relative block p-0 text-center brightness-75 transition duration-500 hover:brightness-100"
									>
										<picture>
											<source type="image/webp" srcSet="/img/bottles/bottle_2.webp" />
											<img
												src="/img/bottles/bottle_2.png"
												class="mx-auto w-full max-w-[288px]"
												alt="Pinot Noir Rose Image"
												width="893"
												height="1383"
												loading="lazy"
												decoding="async"
											/>
										</picture>
										<h3 class="mt-4 font-heading text-2xl text-gray-200">Pinot Noir Rose</h3>
										<div class="mt-2 text-lg text-red-700">$ 18.54 USD</div>
										<div class="hidden md:block">
											<div
												x-ref="ball"
												class="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full bg-red-700/70 opacity-0 group-hover:scale-100 group-hover:opacity-100"
											>
												<span class="font-heading text-xl text-white">Buy</span>
											</div>
											<div class="absolute inset-0 z-10" x-ref="main"></div>
										</div>
										<div class="md:hidden">
											<button class="mt-4 bg-red-700 px-4 py-2 font-semibold text-gray-300">
												View More
											</button>
										</div>
									</a>
								</div>
								<div class="slide-item h-full w-[400px] shrink-0">
									<a
										href="/en/product/refined-granite-fish.html"
										x-data="followMouse"
										class="group relative block p-0 text-center brightness-75 transition duration-500 hover:brightness-100"
									>
										<picture>
											<source type="image/webp" srcSet="/img/bottles/bottle_3.webp" />
											<img
												src="/img/bottles/bottle_3.png"
												class="mx-auto w-full max-w-[288px]"
												alt="Savignon Blanc Image"
												width="646"
												height="1000"
												loading="lazy"
												decoding="async"
											/>
										</picture>
										<h3 class="mt-4 font-heading text-2xl text-gray-200">Savignon Blanc</h3>
										<div class="mt-2 text-lg text-red-700">$ 32.59 USD</div>
										<div class="hidden md:block">
											<div
												x-ref="ball"
												class="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full bg-red-700/70 opacity-0 group-hover:scale-100 group-hover:opacity-100"
											>
												<span class="font-heading text-xl text-white">Buy</span>
											</div>
											<div class="absolute inset-0 z-10" x-ref="main"></div>
										</div>
										<div class="md:hidden">
											<button class="mt-4 bg-red-700 px-4 py-2 font-semibold text-gray-300">
												View More
											</button>
										</div>
									</a>
								</div>
								<div class="slide-item h-full w-[400px] shrink-0">
									<a
										href="/en/product/refined-granite-fish.html"
										x-data="followMouse"
										class="group relative block p-0 text-center brightness-75 transition duration-500 hover:brightness-100"
									>
										<picture>
											<source type="image/webp" srcSet="/img/bottles/bottle_4.webp" />
											<img
												src="/img/bottles/bottle_4.png"
												class="mx-auto w-full max-w-[288px]"
												alt="Cabernet Savignon Image"
												width="646"
												height="1000"
												loading="lazy"
												decoding="async"
											/>
										</picture>
										<h3 class="mt-4 font-heading text-2xl text-gray-200">Cabernet Savignon</h3>
										<div class="mt-2 text-lg text-red-700">$ 49.92 USD</div>
										<div class="hidden md:block">
											<div
												x-ref="ball"
												class="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full bg-red-700/70 opacity-0 group-hover:scale-100 group-hover:opacity-100"
											>
												<span class="font-heading text-xl text-white">Buy</span>
											</div>
											<div class="absolute inset-0 z-10" x-ref="main"></div>
										</div>
										<div class="md:hidden">
											<button class="mt-4 bg-red-700 px-4 py-2 font-semibold text-gray-300">
												View More
											</button>
										</div>
									</a>
								</div>
								<div class="slide-item h-full w-[400px] shrink-0">
									<a
										href="/en/product/refined-granite-fish.html"
										x-data="followMouse"
										class="group relative block p-0 text-center brightness-75 transition duration-500 hover:brightness-100"
									>
										<picture>
											<source type="image/webp" srcSet="/img/bottles/bottle_5.webp" />
											<img
												src="/img/bottles/bottle_5.png"
												class="mx-auto w-full max-w-[288px]"
												alt="Cabernet Savignon Black Image"
												width="893"
												height="1383"
												loading="lazy"
												decoding="async"
											/>
										</picture>
										<h3 class="mt-4 font-heading text-2xl text-gray-200">
											Cabernet Savignon Black
										</h3>
										<div class="mt-2 text-lg text-red-700">$ 22.70 USD</div>
										<div class="hidden md:block">
											<div
												x-ref="ball"
												class="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full bg-red-700/70 opacity-0 group-hover:scale-100 group-hover:opacity-100"
											>
												<span class="font-heading text-xl text-white">Buy</span>
											</div>
											<div class="absolute inset-0 z-10" x-ref="main"></div>
										</div>
										<div class="md:hidden">
											<button class="mt-4 bg-red-700 px-4 py-2 font-semibold text-gray-300">
												View More
											</button>
										</div>
									</a>
								</div>
								<div class="slide-item h-full w-[400px] shrink-0">
									<a
										href="/en/product/refined-granite-fish.html"
										x-data="followMouse"
										class="group relative block p-0 text-center brightness-75 transition duration-500 hover:brightness-100"
									>
										<picture>
											<source type="image/webp" srcSet="/img/bottles/bottle_6.webp" />
											<img
												src="/img/bottles/bottle_6.png"
												class="mx-auto w-full max-w-[288px]"
												alt="Cabernet Savignon Green Image"
												width="646"
												height="1000"
												loading="lazy"
												decoding="async"
											/>
										</picture>
										<h3 class="mt-4 font-heading text-2xl text-gray-200">
											Cabernet Savignon Green
										</h3>
										<div class="mt-2 text-lg text-red-700">$ 92.28 USD</div>
										<div class="hidden md:block">
											<div
												x-ref="ball"
												class="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full bg-red-700/70 opacity-0 group-hover:scale-100 group-hover:opacity-100"
											>
												<span class="font-heading text-xl text-white">Buy</span>
											</div>
											<div class="absolute inset-0 z-10" x-ref="main"></div>
										</div>
										<div class="md:hidden">
											<button class="mt-4 bg-red-700 px-4 py-2 font-semibold text-gray-300">
												View More
											</button>
										</div>
									</a>
								</div>
								<div class="slide-item h-full w-[600px] shrink-0">
									<div class="bg-black px-1 py-32 text-center">
										<div class="space-y-3 text-red-700">
											<h2 class="font-heading text-3xl font-semibold">Exclusive offer</h2>
											<p class="font-heading text-7xl">
												15% off, online <br />
												only
											</p>
											<a
												href="#"
												class="mt-4 inline-block text-xl text-white transition duration-200 hover:text-red-700"
											>
												Visit Our Store
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="absolute bottom-10 left-1/2 mx-auto w-[90%] -translate-x-1/2 items-center lg:flex lg:w-[80%]">
							<div class="mr-4 hidden font-heading text-2xl font-semibold text-white lg:block">
								Scroll & Discover
							</div>
							<div class="mx-auto h-[1.5px] w-9/12 overflow-hidden bg-gray-500/50 lg:mx-0">
								<div x-ref="progress" class="h-[1.5px] bg-white" style="width: 0%"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="container lg:hidden">
				<div class="flex flex-col items-center space-y-12">
					<a
						href="/en/product/refined-granite-fish.html"
						class="group relative block p-0 text-center brightness-75 transition duration-500 hover:brightness-100"
					>
						<picture>
							<source type="image/webp" srcSet="/img/bottles/bottle_1.webp" />
							<img
								src="/img/bottles/bottle_1.png"
								class="mx-auto w-64"
								alt="Cabernet Savignon Black Image"
								width="893"
								height="1383"
								loading="lazy"
								decoding="async"
							/>
						</picture>
						<h3 class="font-heading text-2xl text-gray-200 sm:mt-4">Cabernet Savignon Black</h3>
						<div class="mt-2 text-lg text-red-700">$ 22.70 USD</div>
						<button class="mt-4 bg-red-700 px-4 py-2 font-semibold text-gray-300">View More</button>
					</a>
					<a
						href="/en/product/refined-granite-fish.html"
						class="group relative block p-0 text-center brightness-75 transition duration-500 hover:brightness-100"
					>
						<picture>
							<source type="image/webp" srcSet="/img/bottles/bottle_2.webp" />
							<img
								src="/img/bottles/bottle_2.png"
								class="mx-auto w-64"
								alt="Pinot Noir Rose Image"
								width="893"
								height="1383"
								loading="lazy"
								decoding="async"
							/>
						</picture>
						<h3 class="mt-4 font-heading text-2xl text-gray-200">Pinot Noir Rose</h3>
						<div class="mt-2 text-lg text-red-700">$ 18.54 USD</div>
						<button class="mt-4 bg-red-700 px-4 py-2 font-semibold text-gray-300">View More</button>
					</a>
					<a
						href="/en/product/refined-granite-fish.html"
						x-data="followMouse"
						class="group relative block p-0 text-center brightness-75 transition duration-500 hover:brightness-100"
					>
						<picture>
							<source type="image/webp" srcSet="/img/bottles/bottle_3.webp" />
							<img
								src="/img/bottles/bottle_3.png"
								class="mx-auto w-64"
								alt="Savignon Blanc Image"
								width="646"
								height="1000"
								loading="lazy"
								decoding="async"
							/>
						</picture>
						<h3 class="mt-4 font-heading text-2xl text-gray-200">Savignon Blanc</h3>
						<div class="mt-2 text-lg text-red-700">$ 32.59 USD</div>
						<button class="mt-4 bg-red-700 px-4 py-2 font-semibold text-gray-300">View More</button>
					</a>
					<a
						href="/en/product/refined-granite-fish.html"
						class="group relative block p-0 text-center brightness-75 transition duration-500 hover:brightness-100"
					>
						<picture>
							<source type="image/webp" srcSet="/img/bottles/bottle_4.webp" />
							<img
								src="/img/bottles/bottle_4.png"
								class="mx-auto w-64"
								alt="Cabernet Savignon Image"
								width="646"
								height="1000"
								loading="lazy"
								decoding="async"
							/>
						</picture>
						<h3 class="mt-4 font-heading text-2xl text-gray-200">Cabernet Savignon</h3>
						<div class="mt-2 text-lg text-red-700">$ 49.92 USD</div>
						<button class="mt-4 bg-red-700 px-4 py-2 font-semibold text-gray-300">View More</button>
					</a>
					<a
						href="/en/product/refined-granite-fish.html"
						x-data="followMouse"
						class="group relative block p-0 text-center brightness-75 transition duration-500 hover:brightness-100"
					>
						<picture>
							<source type="image/webp" srcSet="/img/bottles/bottle_5.webp" />
							<img
								src="/img/bottles/bottle_5.png"
								class="mx-auto w-64"
								alt="Cabernet Savignon Black Image"
								width="893"
								height="1383"
								loading="lazy"
								decoding="async"
							/>
						</picture>
						<h3 class="mt-4 font-heading text-2xl text-gray-200">Cabernet Savignon Black</h3>
						<div class="mt-2 text-lg text-red-700">$ 22.70 USD</div>
						<button class="mt-4 bg-red-700 px-4 py-2 font-semibold text-gray-300">View More</button>
					</a>
					<a
						href="/en/product/refined-granite-fish.html"
						class="group relative block p-0 text-center brightness-75 transition duration-500 hover:brightness-100"
					>
						<picture>
							<source type="image/webp" srcSet="/img/bottles/bottle_6.webp" />
							<img
								src="/img/bottles/bottle_6.png"
								class="mx-auto w-64"
								alt="Cabernet Savignon Green Image"
								width="646"
								height="1000"
								loading="lazy"
								decoding="async"
							/>
						</picture>
						<h3 class="mt-4 font-heading text-2xl text-gray-200">Cabernet Savignon Green</h3>
						<div class="mt-2 text-lg text-red-700">$ 92.28 USD</div>
						<button class="mt-4 bg-red-700 px-4 py-2 font-semibold text-gray-300">View More</button>
					</a>
				</div>
			</div>
		</section>
	);
});
