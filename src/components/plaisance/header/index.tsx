import { $, PropFunction, component$, useSignal } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { useCSSTransition } from 'qwik-transition';
import { TRANSITION_CONFIGS, TRANSITION_CONFIGS_APPEAR } from '~/constants';

interface HeaderProps {
	onClickCart$: PropFunction<() => void>;
	onClickMenu$: PropFunction<({ isShow }: { isShow: boolean }) => void>;
	totalItems: number;
}

export default component$(({ onClickCart$, totalItems, onClickMenu$ }: HeaderProps) => {
	const isSearch = useSignal(false);
	const isShowMenuButton = useSignal(true);
	const isShowCloseButton = useSignal(false);
	const isScrolled = useSignal(false);

	const loc = useLocation();

	const { stage: stageSearchInput, shouldMount: shouldMountSearchInput } = useCSSTransition(
		isSearch,
		TRANSITION_CONFIGS_APPEAR
	);
	const { stage: stageMenu, shouldMount: shouldMountMenu } = useCSSTransition(
		isShowMenuButton,
		TRANSITION_CONFIGS
	);
	const { stage: stageClose, shouldMount: shouldMountClose } = useCSSTransition(
		isShowCloseButton,
		TRANSITION_CONFIGS
	);

	const onScrollHeader$ = $(() => {
		isScrolled.value =
			(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0) >
			300;
	});

	return (
		<div>
			<header
				class={`fixed top-0 z-30 w-full px-5 py-6 transition-all duration-500 xs:px-10 lg:bg-transparent lg:py-10 ${
					isScrolled.value ? 'bg-dark-600' : ''
				}`}
				onScroll$={onScrollHeader$}
			>
				<nav class="flex items-center justify-between">
					<div class="relative mr-2 flex h-full flex-grow justify-between xs:mr-5">
						<div>
							{!isSearch.value && (
								<Link href="/" class="absolute left-0 transition sm:hidden">
									<img src="/img/logo.svg" width="100" alt="Logo" />
								</Link>
							)}
							<Link href="/" class="hidden sm:inline-block">
								<img src="/img/logo.svg" width="100" alt="Logo" />
							</Link>
						</div>
						<form
							action={`/${loc.params.lang}/search`}
							class="flex items-center"
							onBlur$={() => (isSearch.value = false)}
						>
							{shouldMountSearchInput.value && (
								<div>
									<input
										type="text"
										id="search-input"
										role="search"
										class={`absolute left-0 z-10 w-full border-0 border-b border-red-700 bg-transparent py-1 pl-0 pr-7
                text-white transition duration-500 ease-in focus:border-purple-700 focus:ring-0 sm:left-auto sm:right-6 sm:w-60 sm:pr-0
                ${
									stageSearchInput.value === 'enterFrom'
										? 'translate-x-full opacity-0 ease-out'
										: stageSearchInput.value === 'enterTo'
										? 'translate-x-0 opacity-100 ease-out'
										: stageSearchInput.value === 'leaveFrom'
										? 'translate-x-0 opacity-100 ease-in'
										: stageSearchInput.value === 'leaveTo'
										? 'translate-x-full opacity-0 ease-in'
										: ''
								}}`}
										placeholder="Search.."
									/>
								</div>
							)}
							<button
								type="button"
								onClick$={() => (isSearch.value = !isSearch.value)}
								aria-controls="search-input"
								aria-expanded={isSearch.value}
								aria-label={`${isSearch.value ? 'Close' : 'Open'} Search Box`}
								class="relative z-20 ml-2 block text-3xl text-gray-100 transition-all duration-200 hover:text-gray-400"
							>
								<img src="/img/icons/search.svg" width="20" alt="" />
							</button>
						</form>
					</div>
					<div class="flex items-center space-x-3 text-white xs:space-x-5">
						<button
							onClick$={onClickCart$}
							class="flex items-center transition-all duration-200 hover:brightness-75"
						>
							<img src="/img/icons/cart.svg" width="20" alt="" />
							<span class="ml-1 text-sm">{totalItems}</span>
						</button>
						{shouldMountClose.value}
						{shouldMountMenu.value}
						<div class="relative h-6 w-6">
							{shouldMountClose.value && (
								<button
									onClick$={() => {
										isShowMenuButton.value = true;
										isShowCloseButton.value = false;
										onClickMenu$?.({ isShow: isShowMenuButton.value });
									}}
									class={`absolute cursor-pointer space-y-1 text-xl transition duration-500 ease-in hover:brightness-75 ${
										stageClose.value === 'enterFrom'
											? 'translate-y-full opacity-0'
											: stageClose.value === 'enterTo'
											? 'translate-y-0 opacity-100'
											: stageClose.value === 'leaveFrom'
											? 'translate-y-0 opacity-100'
											: stageClose.value === 'leaveTo'
											? 'translate-y-full opacity-0'
											: ''
									}}`}
								>
									<img
										src="/img/icons/times.svg"
										width="25"
										height="25"
										loading="lazy"
										decoding="async"
										alt=""
									/>
								</button>
							)}
							{shouldMountMenu.value && (
								<div
									onClick$={() => {
										isShowMenuButton.value = false;
										isShowCloseButton.value = true;
										onClickMenu$?.({ isShow: isShowMenuButton.value });
									}}
									class={`absolute h-full transition duration-500 ${
										stageMenu.value === 'enterFrom'
											? 'translate-y-full opacity-100'
											: stageMenu.value === 'enterTo'
											? 'translate-y-0 opacity-100'
											: stageMenu.value === 'leaveFrom'
											? 'translate-y-0 opacity-100'
											: stageMenu.value === 'leaveTo'
											? 'translate-y-full opacity-0'
											: ''
									}`}
								>
									<div class="flex h-full cursor-pointer flex-col justify-center space-y-1">
										<div class="ml-auto h-[1px] w-4 bg-white"></div>
										<div class="h-[1px] w-6 bg-white"></div>
										<div class="mr-auto h-[1px] w-4 bg-white"></div>
									</div>
								</div>
							)}
						</div>
					</div>
				</nav>
			</header>
		</div>
	);
});
