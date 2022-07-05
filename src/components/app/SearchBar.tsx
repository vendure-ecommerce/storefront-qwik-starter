import { component$, Host } from '@builder.io/qwik';

export const SearchBar = component$(() => {
	return (
		<Host>
			<form method='get' action='/search' key={'initialQuery'}>
				<input
					type='search'
					name='q'
					default-value={''}
					placeholder='Search'
					className='search'
				/>
			</form>
		</Host>
	);
});
