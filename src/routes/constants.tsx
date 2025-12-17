import { createContextId } from '@builder.io/qwik';
import { FilamentColorFindSupportedQuery, FontMenuFindAllQuery } from '~/generated/graphql-shop';

export interface DefaultOptionsForNameTag {
	primaryColorId: string;
	baseColorId: string;
	fontId: string;
	textTop: string;
	textBottom: string;
}

export type FONT_MENU = FontMenuFindAllQuery['fontMenuFindAll'][number];
export type FILAMENT_COLOR = FilamentColorFindSupportedQuery['filamentColorFindSupported'][number];

export type EXTRA_DATA = {
	fontMenus: FONT_MENU[];
	filamentColors: FILAMENT_COLOR[];
};

export interface CustomizableClassDefTag {
	name: string;
	optionDefinition: { field: string; type: string }[];
}

export const CUSTOMIZABLE_CLASS_DEF_TAG = createContextId<CustomizableClassDefTag[]>(
	'customizable_class_name_tag'
);

export const EXTRA_DATA = createContextId<EXTRA_DATA>('extra_data');
