import { component$ } from '@builder.io/qwik';
import { Collection } from '../../types';

interface IProps {
	collection: Collection;
}

export default component$(({ collection }: IProps) => {
	return (
		<a href={'/collections/' + collection.slug} key={collection.id}>
			<div class="max-w-[300px] relative rounded-lg overflow-hidden hover:opacity-75 xl:w-auto">
				<span class="">
					<div class="w-full h-full object-center object-cover">
						<img
							src={collection.featuredAsset?.preview + '?w=300&h=300'}
							width="300"
							height="300"
							alt={collection.name}
						/>
					</div>
				</span>
				<span class="absolute w-full bottom-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50" />
				<span class="absolute w-full bottom-2 mt-auto text-center text-xl font-bold text-white">
					{collection.name}
				</span>
			</div>
		</a>
	);
});
