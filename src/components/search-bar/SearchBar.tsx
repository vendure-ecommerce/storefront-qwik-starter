import { component$ } from '@qwik.dev/core';
import { _ } from 'compiled-i18n';

export default component$(() => {
	return (
		<form action="/search">
			<input
				type="search"
				name="q"
				default-value={''}
				placeholder={_`Search`}
				autoComplete="off"
				class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
			/>
		</form>
	);
});
