import { component$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { useContext } from '@builder.io/qwik';
import { APP_STATE } from '~/constants';

export default component$(() => {
	const nav = useNavigate();
	const appState = useContext(APP_STATE);
	const currentLanguage = appState.language || 'en';

	return (
		<form
			preventdefault:submit
			onSubmit$={async (event) => {
				const formData = new FormData(event.target as HTMLFormElement);
				const searchQuery = formData.get('q');
				const searchPath = `/${currentLanguage}/search${searchQuery ? `?q=${encodeURIComponent(searchQuery.toString())}` : ''}`;
				await nav(searchPath);
			}}
		>
			<input
				type="search"
				name="q"
				default-value={''}
				placeholder={$localize`Search`}
				autoComplete="off"
				class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
			/>
		</form>
	);
});
