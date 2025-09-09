import { component$ } from '@qwik.dev/core';
import { Image } from 'qwik-image';
import { OrderLine } from '~/generated/graphql';
import { CustomizableEntityName, slugToCustomizableEntityName } from '~/utils';
import CustomNameTagCartDisplay from '../custom-option-visualizer/CustomNameTagCartDisplay';

interface ItemPreviewProps {
	filamentColorSignal: any; // Replace 'any' with the actual type if available
	fontMenuSignal: any; // Replace 'any' with the actual type if available
	line: OrderLine; // Replace 'any' with the actual type of 'line' if available
}

export default component$(({ filamentColorSignal, fontMenuSignal, line }: ItemPreviewProps) => {
	const slug = line.productVariant.product.slug;

	const customizableEntityName = slugToCustomizableEntityName(slug);
	return (
		<>
			{/* <p> {line.customFields?.customVariant.id} </p> */}
			{customizableEntityName === CustomizableEntityName.CustomNameTag && (
				<CustomNameTagCartDisplay
					filamentColorSignal={filamentColorSignal}
					fontMenuSignal={fontMenuSignal}
					customVariantId={line.customFields?.customVariant.id}
				/>
			)}

			{customizableEntityName === CustomizableEntityName.Default && (
				<Image
					layout="fixed"
					width="100"
					height="100"
					class="w-full h-full object-center object-cover"
					src={line.featuredAsset?.preview + '?preset=thumb'}
					alt={`Image of: ${line.productVariant.name}`}
				/>
			)}
		</>
	);
});
