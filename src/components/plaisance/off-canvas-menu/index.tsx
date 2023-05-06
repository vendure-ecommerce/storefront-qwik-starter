import { Signal, component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { useCSSTransition } from 'qwik-transition';
import { TRANSITION_CONFIGS_APPEAR } from '~/constants';

interface OverlayNavProps {
	isShowMenu: Signal<boolean>;
}

const getStageTransitionInit = (stage: Signal<string>) => {
	return stage.value === 'enterFrom'
		? 'translate-y-full'
		: stage.value === 'enterTo'
		? 'translate-y-0'
		: stage.value === 'leaveFrom'
		? 'translate-y-0 delay-500'
		: stage.value === 'leaveTo'
		? 'translate-y-full '
		: '';
};

const getStageTransition = (stage: Signal<string>) => {
	return stage.value === 'enterFrom'
		? 'translate-y-full delay-500'
		: stage.value === 'enterTo'
		? 'translate-y-0'
		: stage.value === 'leaveFrom'
		? 'translate-y-0 delay-75'
		: stage.value === 'leaveTo'
		? 'translate-y-full '
		: '';
};
export default component$(({ isShowMenu }: OverlayNavProps) => {
	const loc = useLocation();
	const { stage, shouldMount } = useCSSTransition(isShowMenu, TRANSITION_CONFIGS_APPEAR);
	const { stage: stageTitle, shouldMount: shouldMountTitle } = useCSSTransition(
		isShowMenu,
		TRANSITION_CONFIGS_APPEAR
	);
	if (!shouldMount.value) return null;
	const stageTransition = getStageTransitionInit(stage);
	const stageTitleTransition = getStageTransition(stageTitle);

	return (
		<div
			class={`fixed inset-0 z-20 bg-dark-600 text-white transition duration-500 ease-out ${stageTransition}`}
		>
			<div class="h-full w-full pt-40 lg:flex lg:pt-0">
				<div class="hidden border-r border-gray-700 lg:block lg:flex-1">
					<div class="flex h-full flex-col justify-center px-4 font-heading text-white lg:px-8">
						<div class="relative overflow-hidden">
							{shouldMountTitle.value && (
								<h2
									class={`text-xl leading-[1] transition duration-500 ease-out lg:text-[20vh] ${stageTitleTransition}`}
								>
									WINE
								</h2>
							)}
						</div>
						<div class="relative overflow-hidden">
							<h2
								class={`text-xl leading-[1] transition duration-500 ease-out lg:text-[20vh] ${stageTransition}`}
							>
								&
							</h2>
						</div>
						<div class="relative overflow-hidden">
							<h2
								class={`text-xl leading-[1] transition duration-500 ease-out lg:text-[20vh] ${stageTransition}`}
							>
								FOOD
							</h2>
						</div>
					</div>
				</div>
				<div class="px-5 lg:flex-1 lg:px-20">
					<div class="flex h-full flex-col lg:py-40">
						<div class="flex flex-1 flex-col space-y-5">
							<div>
								<Link
									href={`/${loc.params.lang}/about`}
									class="group relative inline-block overflow-visible"
								>
									<picture>
										<source type="image/webp" srcSet="/img/menu/about_640.webp" />
										<img
											src="/img/menu/about_640.jpg"
											class="absolute left-1/2 top-1/2 w-28 -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 md:w-40 lg:w-52"
											alt="About"
											loading="lazy"
											decoding="async"
										/>
									</picture>
									<div class="relative overflow-hidden px-5 xs:px-0">
										<h2
											class={`relative inline-block font-heading text-[5vh] !leading-none 
                        text-white transition-all duration-500 ease-out 
                        group-hover:text-red-700 xs:text-[10vh] lg:text-[9vh]
                        xl:text-8xl ${stageTransition}`}
										>
											About
										</h2>
									</div>
									<div class="absolute inset-0 z-10"></div>
								</Link>
							</div>
							<div>
								<Link
									href={`/${loc.params.lang}/news`}
									class="group relative inline-block overflow-visible"
								>
									<picture>
										<source type="image/webp" srcSet="/img/menu/news_640.webp" />
										<img
											src="/img/menu/news_640.jpg"
											class="absolute left-1/2 top-1/2 w-28 -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 md:w-40 lg:w-52"
											alt="News"
											loading="lazy"
											decoding="async"
										/>
									</picture>
									<div class="relative overflow-hidden px-5 xs:px-0">
										<h2
											class={`relative inline-block font-heading text-[5vh] !leading-none text-white 
                      transition-all duration-500 ease-out group-hover:text-red-700 xs:text-[10vh] 
                      lg:text-[9vh] xl:text-8xl ${stageTransition}`}
										>
											News
										</h2>
									</div>
									<div class="absolute inset-0 z-10"></div>
								</Link>
							</div>
							<div>
								<Link
									href={`/${loc.params.lang}/shop`}
									class="group relative inline-block overflow-visible"
								>
									<picture>
										<source type="image/webp" srcSet="/img/menu/shop_640.webp" />
										<img
											src="/img/menu/shop_640.jpg"
											class="absolute left-1/2 top-1/2 w-28 -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 md:w-40 lg:w-52"
											alt="Shop"
											loading="lazy"
											decoding="async"
										/>
									</picture>
									<div class="relative overflow-hidden px-5 xs:px-0">
										<h2
											class={`relative inline-block font-heading text-[5vh] !leading-none 
                      text-white transition-all duration-500 ease-out 
                      group-hover:text-red-700 xs:text-[10vh] lg:text-[9vh] xl:text-8xl ${stageTransition}`}
										>
											Shop
										</h2>
									</div>
									<div class="absolute inset-0 z-10"></div>
								</Link>
							</div>
						</div>
						<div class="mt-3 lg:flex">
							<div class="flex flex-col space-y-3">
								<Link
									href={`/${loc.params.lang}/faq`}
									class="inline-block font-heading text-xl font-bold uppercase text-white transition duration-500 hover:text-red-800 lg:text-lg"
								>
									Faq
								</Link>
								<Link
									href={`/${loc.params.lang}/contact`}
									class="inline-block font-heading text-xl font-bold uppercase text-white transition duration-500 hover:text-red-800 lg:text-lg"
								>
									Contact
								</Link>
							</div>
							<div class="mt-5 flex space-x-10 xs:space-x-5 lg:ml-14 lg:mt-0 lg:flex-col lg:space-x-0 lg:space-y-3">
								<Link href="#">
									<img
										src="/img/icons/instagram.svg"
										width="25"
										loading="lazy"
										decoding="async"
										alt=""
									/>
								</Link>
								<Link href="#">
									<img
										src="/img/icons/instagram.svg"
										width="25"
										loading="lazy"
										decoding="async"
										alt=""
									/>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
