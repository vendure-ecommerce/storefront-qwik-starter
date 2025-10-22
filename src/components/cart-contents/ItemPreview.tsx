import { component$, useContext } from '@qwik.dev/core';
import { Image } from 'qwik-image';
import { OrderLine } from '~/generated/graphql';
import { CUSTOMIZABLE_CLASS_DEF_TAG } from '~/routes/constants';
import { CustomizableClassName, slugToCustomizableClass } from '~/utils';
import { genCustomizableOptionJsonHash } from '~/utils/customizable-order';
import CustomNameTagCartDisplay from '../custom-option-visualizer/CustomNameTagCartDisplay';

interface ItemPreviewProps {
	filamentColorSignal: any; // Replace 'any' with the actual type if available
	fontMenuSignal: any; // Replace 'any' with the actual type if available
	line: OrderLine; // Replace 'any' with the actual type of 'line' if available
}

export default component$(({ filamentColorSignal, fontMenuSignal, line }: ItemPreviewProps) => {
	const slug = line.productVariant.product.slug;

	const customizableEntityName = slugToCustomizableClass(slug);
	const customizableClassDef = useContext(CUSTOMIZABLE_CLASS_DEF_TAG);
	const customizableClassName = line.productVariant.product.customFields?.customizableClass; // can be null

	return (
		<>
			{/* <p> {line.customFields?.customVariant.id} </p> */}
			{customizableClassName === CustomizableClassName.CustomNameTag && (
				<CustomNameTagCartDisplay
					filamentColorSignal={filamentColorSignal}
					fontMenuSignal={fontMenuSignal}
					customizableOptionJson={line.customFields?.customizableOptionJson ?? '[]'}
					concatenate_canvas_element_id={genCustomizableOptionJsonHash(line)}
					classDef={
						customizableClassDef.find((def) => def.name === customizableClassName)
							?.optionDefinition ?? []
					}
				/>
			)}

			{customizableEntityName === CustomizableClassName.Default && (
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
