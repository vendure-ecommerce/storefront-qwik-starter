import { component$, Host } from '@builder.io/qwik';

export default component$(() => {
	return (
		<Host>
			<input
				type="search"
				name="q"
				default-value={''}
				placeholder="Search"
				className="search"
				onKeyUp$={async (e: any) => {
					if (e.key === 'Enter' && !!e.target.value) {
						window.location.href = '/search?q=' + e.target.value;
					}
				}}
			/>
		</Host>
	);
});
