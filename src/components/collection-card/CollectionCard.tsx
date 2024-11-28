import { component$ } from '@builder.io/qwik';
import { Image } from 'qwik-image';
import { LocalizedLink } from '~/components/LocalizedLink';
import { Collection } from '~/generated/graphql';

interface CollectionCardProps {
	collection: Collection;
	lang?: string; // Make language optional with a default in the component
}

export default component$<CollectionCardProps>(({ collection, lang = 'en' }) => {
	// Ensure collection has required properties
	if (!collection || !collection.slug) {
		return null;
	}

	const collectionLink = `/${lang}/collections/${collection.slug}`;
	const imageSrc = collection.featuredAsset?.preview || '/placeholder.jpg';
	const collectionName = collection.name || '';

	return (
		<LocalizedLink
			href={collectionLink}
			key={collection.id}
			class="block" // Added for better hover handling
		>
			<div class="max-w-[300px] relative rounded-lg overflow-hidden hover:opacity-75 xl:w-auto mx-auto group">
				<div class="w-full h-full object-center object-cover">
					<Image
						layout="fixed"
						width={300}
						height={300}
						src={imageSrc}
						alt={collectionName}
						loading="lazy"
						class="transition-transform duration-300 group-hover:scale-105"
					/>
				</div>
				<div class="absolute inset-0 flex flex-col justify-end">
					<div class="h-2/3 bg-gradient-to-t from-gray-800 opacity-50" />
					<div class="absolute bottom-0 w-full p-4">
						<h3 class="text-xl font-bold text-white text-center">{collectionName}</h3>
					</div>
				</div>
			</div>
		</LocalizedLink>
	);
});
