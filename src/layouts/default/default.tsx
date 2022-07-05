import { component$, Host, Slot } from '@builder.io/qwik';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';

const DefaultLayout = component$(() => {
	return (
		<Host>
			<Header />
			<main>
				<article>
					<Slot />
					<Footer />
				</article>
			</main>
		</Host>
	);
});

export default DefaultLayout;
