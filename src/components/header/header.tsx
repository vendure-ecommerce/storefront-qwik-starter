// header.tsx
import { $, component$, useContext, useVisibleTask$ } from '@builder.io/qwik';
import { LocalizedLink } from '~/components/LocalizedLink';
import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { getActiveCustomerQuery } from '~/providers/shop/customer/customer';
import MenuIcon from '../icons/MenuIcon';
import ShoppingBagIcon from '../icons/ShoppingBagIcon';
import SearchBar from '../search-bar/SearchBar';

const languages = [
	{ code: 'en', name: 'English', flag: '🇬🇧' },
	{ code: 'fr', name: 'Français', flag: '🇫🇷' },
	{ code: 'de', name: 'Deutsch', flag: '🇩🇪' },
	{ code: 'it', name: 'Italiano', flag: '🇮🇹' },
	{ code: 'es', name: 'Español', flag: '🇪🇸' },
] as const;

type LanguageCode = (typeof languages)[number]['code'];

export default component$(() => {
	const appState = useContext(APP_STATE);
	const currentLang = (appState.language || 'en') as LanguageCode;

	const collections = appState.collections.filter(
		(item) => item.parent?.name === '__root_collection__' && !!item.featuredAsset
	);

	const totalQuantity =
		appState.activeOrder?.state !== 'PaymentAuthorized'
			? appState.activeOrder?.totalQuantity || 0
			: 0;

	useVisibleTask$(async () => {
		// Fetch customer data if needed
		if (appState.customer.id === CUSTOMER_NOT_DEFINED_ID) {
			const activeCustomer = await getActiveCustomerQuery();
			if (activeCustomer) {
				appState.customer = {
					title: activeCustomer.title ?? '',
					firstName: activeCustomer.firstName,
					id: activeCustomer.id,
					lastName: activeCustomer.lastName,
					emailAddress: activeCustomer.emailAddress,
					phoneNumber: activeCustomer.phoneNumber ?? '',
				};
			}
		}

		// Handle language from URL path
		const urlLang = window.location.pathname.split('/')[1];
		if (urlLang && languages.some((l) => l.code === urlLang)) {
			appState.language = urlLang as LanguageCode;
			localStorage.setItem('lang', urlLang);
		} else {
			const storedLang = (localStorage.getItem('lang') as LanguageCode) || 'en';
			if (urlLang !== storedLang) {
				// Redirect to correct language path if needed
				const currentPath = window.location.pathname.replace(/^\/[a-z]{2}/, '');
				window.location.href = `/${storedLang}${currentPath || '/'}`;
			}
			appState.language = storedLang;
		}
	});

	const switchLanguage = $((lang: LanguageCode) => {
		if (lang === currentLang) return;

		appState.language = lang;
		localStorage.setItem('lang', lang);

		// Update Accept-Language header for API calls
		const headers = new Headers();
		headers.set('Accept-Language', lang);

		// Redirect to new language path
		const currentPath = window.location.pathname.replace(/^\/[a-z]{2}/, '');
		window.location.href = `/${lang}${currentPath || '/'}`;
	});

	return (
		<div class="bg-gradient-to-r from-blue-700 to-indigo-900 shadow-xl sticky top-0 z-10">
			<header class="max-w-6xl mx-auto">
				<div class="p-4 flex items-center space-x-4">
					{/* Mobile Menu Button */}
					<button
						class="block sm:hidden text-white hover:text-gray-200 transition-colors"
						onClick$={() => (appState.showMenu = !appState.showMenu)}
					>
						<MenuIcon />
					</button>

					{/* Logo */}
					<h1 class="text-white w-10">
						<LocalizedLink href="/" class="hover:opacity-90 transition-opacity">
							<img
								src="/cube-logo-small.webp"
								width={40}
								height={31}
								alt="Vendure logo"
								class="w-10 h-auto"
							/>
						</LocalizedLink>
					</h1>

					{/* Desktop Navigation */}
					<nav class="hidden sm:flex space-x-6">
						{collections.map((collection) => (
							<LocalizedLink
								className="text-sm md:text-base text-gray-200 hover:text-white transition-colors"
								href={`/collections/${collection.slug}`}
								key={collection.id}
							>
								{collection.name}
							</LocalizedLink>
						))}
					</nav>

					{/* Search Bar */}
					<div class="flex-1 block md:pr-8">
						<SearchBar />
					</div>

					{/* Right Side Controls */}
					<div class="flex items-center space-x-4">
						{/* Language Selector */}
						<div class="relative group">
							<div class="flex items-center gap-2 bg-white/10 text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-white/20 transition-all">
								<span class="text-xl">
									{languages.find((l) => l.code === currentLang)?.flag || languages[0].flag}
								</span>
								<span class="text-sm font-medium">{currentLang.toUpperCase()}</span>
							</div>

							<div class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
								<div class="py-1">
									{languages.map((lang) => (
										<button
											key={lang.code}
											onClick$={() => switchLanguage(lang.code)}
											class={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-100 transition-colors
                        ${currentLang === lang.code ? 'bg-gray-50 text-blue-600' : 'text-gray-700'}`}
										>
											<span class="text-xl">{lang.flag}</span>
											<span>{lang.name}</span>
										</button>
									))}
								</div>
							</div>
						</div>

						{/* Cart Button */}
						<button
							name="Cart"
							aria-label={`${totalQuantity} items in cart`}
							class="relative bg-white/10 rounded-lg p-2 text-white hover:bg-white/20 transition-all"
							onClick$={() => (appState.showCart = !appState.showCart)}
						>
							<ShoppingBagIcon />
							{totalQuantity > 0 && (
								<div class="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
									{totalQuantity}
								</div>
							)}
						</button>
					</div>
				</div>
			</header>
		</div>
	);
});
