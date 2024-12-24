import { component$ } from '@qwik.dev/core';
import HomeIcon from '../icons/HomeIcon';
import SlashIcon from '../icons/SlashIcon';

export default component$<{ items: { name: string; slug: string; id: string }[] }>(({ items }) => {
	return (
		<nav class="flex">
			<ol class="flex items-center space-x-1 md:space-x-4">
				<li>
					<div>
						<a href="/" class="text-gray-400 hover:text-gray-500">
							<HomeIcon />
							<span class="sr-only">Home</span>
						</a>
					</div>
				</li>
				{items
					.filter((item) => item.name !== '__root_collection__')
					.map((item) => (
						<li key={item.name}>
							<div class="flex items-center">
								<SlashIcon />
								<a
									href={`/collections/${item.slug}`}
									class="ml-2 md:ml-4 text-xs md:text-sm font-medium text-gray-500 hover:text-gray-700"
								>
									{item.name}
								</a>
							</div>
						</li>
					))}
			</ol>
		</nav>
	);
});
