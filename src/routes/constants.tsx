import { createContextId } from '@qwik.dev/core';
import { FilamentColorFindSupportedQuery, FontMenuFindAllQuery } from '~/generated/graphql-shop';

export interface DefaultOptionsForNameTag {
	primaryColorId: string;
	baseColorId: string;
	fontId: string;
}

export const DEFAULT_OPTIONS_FOR_NAME_TAG = createContextId<DefaultOptionsForNameTag>(
	'default_options_for_name_tag' // A unique string to identify the context
);

export const DEFAULT_PRIMARY_COLOR_NAME = 'latte_brown';
export const DEFAULT_BASE_COLOR_NAME = 'ivory_white';
export const DEFAULT_FONT_NAME = 'Comic Neue';

export type FONT_MENU = FontMenuFindAllQuery['fontMenuFindAll'][number];

export type FILAMENT_COLOR = FilamentColorFindSupportedQuery['filamentColorFindSupported'][number];
