import { component$, Host, useScopedStyles$ } from '@builder.io/qwik';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import styles from './not-found.css?inline';

const NotFound = component$(() => {
	useScopedStyles$(styles);

	return (
		<Host>
			<Header />
			<main>Not Found</main>
			<Footer />
		</Host>
	);
});

export default NotFound;
