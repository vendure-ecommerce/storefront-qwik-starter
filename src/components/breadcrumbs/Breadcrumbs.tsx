import { component$ } from '@builder.io/qwik';
import HomeIcon from '../icons/HomeIcon';
import SlashIcon from '../icons/SlashIcon';

export default component$<{ items: { name: string; slug: string; id: string }[] }>(({ items }) => {
	return (
		<nav className="flex" aria-label="Breadcrumb">
			<ol role="list" className="flex items-center space-x-1 md:space-x-4">
				<li>
					<div>
						<a href="/" className="text-gray-400 hover:text-gray-500">
							<HomeIcon />
							<span className="sr-only">Home</span>
						</a>
					</div>
				</li>
				{items
					.filter((item) => item.name !== '__root_collection__')
					.map((item, index) => (
						<li key={item.name}>
							<div className="flex items-center">
								<SlashIcon />
								<a
									href={'/collections/' + item.slug}
									className="ml-2 md:ml-4 text-xs md:text-sm font-medium text-gray-500 hover:text-gray-700"
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
