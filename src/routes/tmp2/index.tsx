import { $, component$, useComputed$, useContext, useSignal } from '@qwik.dev/core';
import BuildCustomNameTag from '~/components/custom-option-visualizer/BuildCustomNameTag';
import { getCustomizableOptionArray } from '~/utils/customizable-order';
import { CUSTOMIZABLE_CLASS_DEF_TAG } from '../constants';
import { DEFAULT_OPTIONS_FOR_NAME_TAG, useFilamentColor, useFontMenu } from '../tmp2/layout';

import { gql } from 'graphql-tag';
import { createCustomizedImageAssetMutation } from '~/providers/shop/orders/customizable-order';

const createAssetMutation = gql`
	mutation createCustomizedImageAsset($file: Upload!) {
		createCustomizedImageAsset(file: $file) {
			... on CreateAssetSuccess {
				assetId
			}
			... on CreateCustomizedImageAssetError {
				errorCode
				message
			}
		}
	}
`;

async function uploadCanvasImageV2(
	canvasElementId: string,
	filename: string,
	mutate: any
): Promise<string | null> {
	const canvas = document.getElementById(canvasElementId) as HTMLCanvasElement;
	if (!canvas) {
		throw new Error(`Canvas with id ${canvasElementId} not found`);
	}

	return new Promise((resolve, reject) => {
		canvas.toBlob(
			async (blob) => {
				if (!blob) {
					reject(new Error('Failed to create blob from canvas'));
					return;
				}
				const file = new File([blob], filename, { type: 'image/jpeg' });

				try {
					const result = await mutate({
						variables: {
							file: file,
						},
					});
					if (result.data?.createCustomizedImageAsset.assetId) {
						resolve(result.data.createCustomizedImageAsset.assetId);
					} else {
						reject(new Error('Failed to create asset'));
					}
				} catch (error) {
					console.error('Upload error:', error);
					reject(error);
				}
			},
			'image/jpeg',
			0.6
		);
	});
}

const CONCATENATE_CANVAS_ELEMENT_ID = 'custom-name-tag-preview-canvas';

export default component$(() => {
	const FilamentColorSignal = useFilamentColor(); // Load the Filament_Color from db
	const FontMenuSignal = useFontMenu(); // Load the Font_Menu from db

	const defaultOptionsForNameTag = useContext(DEFAULT_OPTIONS_FOR_NAME_TAG);

	const build_top_plate = useSignal<boolean>(true);
	const build_bottom_plate = useSignal<boolean>(true);

	const text_top = useSignal<string>('Happy');
	const text_bottom = useSignal<string>('Day');
	const font_id_top = useSignal<string>(defaultOptionsForNameTag.fontId);
	const font_id_bottom = useSignal<string>(defaultOptionsForNameTag.fontId);
	const primary_color_id = useSignal<string>(defaultOptionsForNameTag.primaryColorId);
	const base_color_id = useSignal<string>(defaultOptionsForNameTag.baseColorId);
	const is_build_valid = useSignal<boolean>(true);
	const atc_disabled_reason = useSignal<string>('None');
	const is_top_additive = useSignal<boolean>(true);
	const custom_name_tag_asset_id = useSignal<string>('');

	const customizableClassDef = useContext(CUSTOMIZABLE_CLASS_DEF_TAG);
	const customizedImageFilename = `custom-name-tag-${Date.now()}.jpg`;

	const currentClassDef = customizableClassDef.find((def) => def.name === 'CustomNameTag');

	if (!currentClassDef) {
		throw new Error(`Customizable class definition not found for class name: CustomNameTag`);
	}

	const is_atc_allowed = useComputed$(() => {
		if (!is_build_valid.value) {
			return false;
		}
		return true;
	});

	// const [mutate] = useMutation<
	// 	{
	// 		createCustomizedImageAsset: {
	// 			assetId: string;
	// 		};
	// 	},
	// 	{
	// 		file: File;
	// 	}
	// >(createAssetMutation);

	const handleAddToCart = $(
		async (
			canvasElementId: string,
			filename: string,
			inputArr: any,
			selectedVariantId: string,
			addItemToOrderErrorSignal: any
		) => {
			try {
				// Upload canvas image first
				const canvas = document.getElementById(CONCATENATE_CANVAS_ELEMENT_ID) as HTMLCanvasElement;
				if (!canvas) {
					throw new Error(`Canvas with id ${canvasElementId} not found`);
				}

				canvas.toBlob(
					async (blob) => {
						if (!blob) {
							throw new Error('Failed to create blob from canvas');
						}
						const file = new File([blob], filename, { type: 'image/jpeg' });

						// error check if file = {} or null
						if (!file || !(file instanceof File) || file.size === 0) {
							throw new Error(
								`Failed to create valid file from blob. Size: ${file?.size || 0} bytes`
							);
						}

						// look into the file object, type, name, size
						console.log('Uploading file:', {
							name: file.name,
							type: file.type,
							size: file.size,
						});

						try {
							const result = await createCustomizedImageAssetMutation(file);
							if (result && result.assetId) {
								custom_name_tag_asset_id.value = result.assetId;
							} else {
								throw new Error('Failed to create asset');
							}
						} catch (error) {
							console.error('Upload error:', error);
						}
					},
					'image/jpeg',
					0.5
				);
			} catch (error) {
				console.error('Error adding to cart:', error);
				addItemToOrderErrorSignal.value = 'Failed to add item to cart';
			}
		}
	);

	return (
		<>
			<BuildCustomNameTag
				FilamentColorSignal={FilamentColorSignal}
				FontMenuSignal={FontMenuSignal}
				primary_color_id={primary_color_id}
				is_atc_allowed={is_build_valid}
				atc_disabled_reason={atc_disabled_reason}
				base_color_id={base_color_id}
				canvas_width_px={250}
				text_top={text_top}
				text_bottom={text_bottom}
				font_id_top={font_id_top}
				font_id_bottom={font_id_bottom}
				is_top_additive={is_top_additive}
				build_top_plate={build_top_plate}
				build_bottom_plate={build_bottom_plate}
				show_estimated_board_width={true}
				output_concatenated_canvas_element_id={CONCATENATE_CANVAS_ELEMENT_ID}
			/>
			<p>{is_atc_allowed.value ? 'Build is valid, ATC allowed' : atc_disabled_reason.value}</p>

			<div class="text-center mt-4">
				{/* A button to create or retrieve custom name tag */}
				<button
					onClick$={async () => {
						const input = {
							textTop: build_top_plate.value ? text_top.value : null,
							textBottom: build_bottom_plate.value ? text_bottom.value : null,
							fontMenuIdTop: build_top_plate.value ? font_id_top.value : null,
							fontMenuIdBottom: build_bottom_plate.value ? font_id_bottom.value : null,
							filamentColorIdPrimary: primary_color_id.value,
							filamentColorIdBase: base_color_id.value,
							isTopAdditive: is_top_additive.value,
						};
						try {
							const inputArr = getCustomizableOptionArray(input, currentClassDef.optionDefinition);

							// Call the extracted async function
							handleAddToCart(
								CONCATENATE_CANVAS_ELEMENT_ID,
								customizedImageFilename,
								inputArr,
								'',
								''
							);
						} catch (error) {
							console.error('Error creating or retrieving custom name tag:', error);
						}
					}}
					class="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Create Custom Name Tag Asset
				</button>
				<p> Custom Name Tag Asset ID: {custom_name_tag_asset_id.value}</p>
			</div>
		</>
	);
});
