import { Html } from '@builder.io/qwik-city';
import { Body } from './components/body/body';
import { Head } from './components/head/head';

import { useClientEffect$ } from '@builder.io/qwik';
import './global.css';

export default () => {
	return (
		<Html lang="en">
			<Head />
			<Body />
		</Html>
	);
};
