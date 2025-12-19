import { component$ } from '@builder.io/qwik';
import { Image } from 'qwik-image';
import { OrderLine } from '~/generated/graphql';
import { CustomizableClassName, slugToCustomizableClass } from '~/utils';
import { genCustomizableOptionJsonHash } from '~/utils/customizable-order';
import CustomNameTagCartDisplayV4 from '../custom-option-visualizer/custom-name-tag-cart-display/CustomNameTagCartDisplayV4';

interface ItemPreviewProps {
	line: Pick<OrderLine, 'productVariant' | 'customFields' | 'featuredAsset'>; // Replace 'any' with the actual type of 'line' if available
}

export default component$(({ line }: ItemPreviewProps) => {
	const slug = line.productVariant.product.slug;

	const customizableEntityName = slugToCustomizableClass(slug);
	const customizableClassName = line.productVariant.product.customFields?.customizableClass; // can be null

	return (
		<>
			{/* <p> {line.customFields?.customVariant.id} </p> */}
			{customizableClassName === CustomizableClassName.CustomNameTag && (
				<CustomNameTagCartDisplayV4
					customizableOptionJson={line.customFields?.customizableOptionJson ?? '[]'}
					concatenate_canvas_element_id={genCustomizableOptionJsonHash(line)}
				/>
			)}

			{customizableEntityName === CustomizableClassName.Default && (
				<Image
					layout="fixed"
					src={line.featuredAsset?.preview + '?w=150&h=150&format=webp'}
					alt={`Image of: ${line.productVariant.name}`}
				/>
			)}
		</>
	);
});
