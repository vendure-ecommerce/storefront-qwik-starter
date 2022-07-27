import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import HomeIcon from '../icons/HomeIcon';
import SlashIcon from '../icons/SlashIcon';

export default component$<{ items: { name: string; slug: string; id: string }[] }>(({ items }) => {
	return (
		<nav className="flex">
			<ol className="flex items-center space-x-1 md:space-x-4">
				<li>
					<div>
						<Link href="/" className="text-gray-400 hover:text-gray-500">
							<HomeIcon />
							<span className="sr-only">Home</span>
						</Link>
					</div>
				</li>
				{items
					.filter((item) => item.name !== '__root_collection__')
					.map((item, index) => (
						<li key={item.name}>
							<div className="flex items-center">
								<SlashIcon />
								<Link
									href={'/collections/' + item.slug}
									className="ml-2 md:ml-4 text-xs md:text-sm font-medium text-gray-500 hover:text-gray-700"
								>
									{item.name}
								</Link>
							</div>
						</li>
					))}
			</ol>
		</nav>
	);
});
