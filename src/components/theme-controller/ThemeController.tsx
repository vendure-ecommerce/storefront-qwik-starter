import { component$ } from '@builder.io/qwik';
import { LuChevronDown } from '@qwikest/icons/lucide';

const themes = [
	'default',
	'light',
	'dark',
	'nord',
	'cupcake',
	'dracula',
	'retro',
	'valentine',
	'synthwave',
	'aqua',
	'forest',
	'luxury',
	'coffee',
	'dim',
	'night',
	'caramellatte',
	'lemonade',
];

export default component$(() => {
	return (
		<div class="dropdown">
			<div tabIndex={0} role="button" class="btn m-1">
				Theme
				<LuChevronDown class="ml-2" />
			</div>
			<ul class="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
				{themes.map((theme) => (
					<li key={theme}>
						<input
							type="radio"
							name="theme-dropdown"
							class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
							aria-label={theme.charAt(0).toUpperCase() + theme.slice(1)}
							value={theme}
						/>
					</li>
				))}
			</ul>
		</div>
	);
});
