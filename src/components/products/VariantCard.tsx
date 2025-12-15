import { component$ } from '@builder.io/qwik';
import { Image } from 'qwik-image';

interface VariantCardProps {
	variantName: string;
	preview: string;
	productName: string;
}

export default component$(({ variantName, preview, productName }: VariantCardProps) => {
	return (
		<>
			<Image
				layout="fixed"
				class="w-48 h-auto rounded-xl flex-grow object-cover shadow-xl hover:shadow-2xl"
				src={preview + '?w=200&h=200&format=webp'}
				alt={`Image of: ${productName}`}
			/>
			<h2 class="text-2xl font-semibold mt-5 mb-3">{productName}</h2>
			<h3 class="text-sm border rounded-md p-1 w-fit font-medium mb-4 ">{variantName}</h3>
		</>
	);
});
