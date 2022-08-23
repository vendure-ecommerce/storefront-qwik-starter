import { component$ } from '@builder.io/qwik';

export default component$(() => {
	return (
		<input
			type="search"
			name="q"
			default-value={''}
			placeholder="Search"
			className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
			onKeyUp$={async (e: any) => {
				if (e.key === 'Enter' && !!e.target.value) {
					window.location.href = '/search?q=' + e.target.value;
				}
			}}
		/>
	);
});
