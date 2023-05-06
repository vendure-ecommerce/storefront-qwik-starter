import { $, component$, useSignal, useStore } from '@builder.io/qwik';

import ProductsCarousel from '~/components/plaisance/carousel';
import CartModal, { type CartStore, type Product } from '~/components/plaisance/cart-modal';
import Footer from '~/components/plaisance/footer';
import Header from '~/components/plaisance/header';
import NewsletterForm from '~/components/plaisance/newsletter-form';
import OffCanvasMenu from '~/components/plaisance/off-canvas-menu';
import ParalaxSections from '~/components/plaisance/parallax';

export default component$(() => {
	const cartStore = useStore<CartStore>({
		collections: [],
		products: [],
	});

	const isShowShoppingCart = useSignal(false);
	const isShowMenu = useSignal(false);
	const isNewstLetterForm = useSignal(false);

	const onClickShoppingCart$ = $(() => {
		isShowShoppingCart.value = false;
	});

	const getTotalItems = () => {
		const totalProducts = cartStore.products.reduce(
			(accumulator: number, currentValue: Product) => {
				return accumulator + +currentValue.quantity;
			},
			0
		);
		const totalCollection = cartStore.collections.reduce((accumulator, currentValue) => {
			return accumulator + +currentValue.quantity;
		}, 0);

		return Math.floor(totalProducts + totalCollection);
	};

	return (
		<div class={`antialiased ${isNewstLetterForm.value ? 'overflow-hidden' : ''}`}>
			<CartModal
				cartStore={cartStore}
				totalItems={getTotalItems()}
				onClickShoppingCart$={onClickShoppingCart$}
				isShowShoppingCart={isShowShoppingCart}
			/>
			<Header
				totalItems={getTotalItems()}
				onClickCart$={() => {
					isShowShoppingCart.value = true;
				}}
				onClickMenu$={({ isShow }) => {
					isShowMenu.value = !isShow;
				}}
			/>
			<OffCanvasMenu isShowMenu={isShowMenu} />
			<ParalaxSections />
			<ProductsCarousel />
			<NewsletterForm />
			<Footer />
		</div>
	);
});
