import { component$ } from '@builder.io/qwik';

export default component$(() => {
	return (
		<form action="/search">
			<input
				type="search"
				name="q"
				default-value={''}
				placeholder="Search"
				autoComplete="off"
				class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
			/>
		</form>
	);
});
