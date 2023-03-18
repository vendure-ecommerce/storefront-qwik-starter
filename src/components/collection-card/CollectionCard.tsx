import { component$ } from '@builder.io/qwik';
import { IMAGE_PLACEHOLDER_BACKGROUND } from '~/constants';
import { Image } from '../image/Image';
import { Collection } from '~/generated/graphql';

interface IProps {
	collection: Collection;
}

export default component$(({ collection }: IProps) => {
	return (
		<a href={'/collections/' + collection.slug} key={collection.id}>
			<div class="max-w-[300px] relative rounded-lg overflow-hidden hover:opacity-75 xl:w-auto mx-auto">
				<div class="w-full h-full object-center object-cover">
					<Image
						layout="fixed"
						width="300"
						height="300"
						src={collection.featuredAsset?.preview}
						alt={collection.name}
						placeholder={IMAGE_PLACEHOLDER_BACKGROUND}
					/>
				</div>
				<span class="absolute w-full bottom-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50" />
				<span class="absolute w-full bottom-2 mt-auto text-center text-xl font-bold text-white">
					{collection.name}
				</span>
			</div>
		</a>
	);
});
