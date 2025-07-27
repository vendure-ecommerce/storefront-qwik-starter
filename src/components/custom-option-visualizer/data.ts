export type FILAMENT_COLOR = {
	name: string; // name of the color used in storing parameters
	displayName: string; // name of the color shown in the selector
	hexCode: string;
	isOutOfStock?: boolean; // if false, it will not be shown in the selector
};

export const FILAMENT_COLORS: FILAMENT_COLOR[] = [
	{
		name: 'lemon_yellow',
		displayName: 'Lemon Yellow',
		hexCode: '#F7D959',
		isOutOfStock: false,
	},
	{
		name: 'dark_red',
		displayName: 'Dark Red',
		hexCode: '#BB3D43',
		isOutOfStock: false,
	},
	{
		name: 'dark_brown',
		displayName: 'Dark Brown',
		hexCode: '#7D6556',
		isOutOfStock: false,
	},
	{
		name: 'dark_green',
		displayName: 'Dark Green',
		hexCode: '#68724D',
		isOutOfStock: false,
	},
	{
		name: 'dark_blue',
		displayName: 'Dark Blue',
		hexCode: '#042F56',
		isOutOfStock: false,
	},
	{
		name: 'jade_white',
		displayName: 'Jade White',
		hexCode: '#FFFFFF',
		isOutOfStock: false,
	},
	{
		name: 'beige',
		displayName: 'Beige',
		hexCode: '#F7E6DE',
		isOutOfStock: false,
	},
	{
		name: 'gray',
		displayName: 'Gray',
		hexCode: '#8E9089',
		isOutOfStock: false,
	},
	{
		name: 'bronze',
		displayName: 'Bronze',
		hexCode: '#847D48',
		isOutOfStock: false,
	},
	{
		name: 'brown',
		displayName: 'Brown',
		hexCode: '#9D432C',
		isOutOfStock: false,
	},
	{
		name: 'cocoa_brown',
		displayName: 'Cocoa Brown',
		hexCode: '#6F5034',
		isOutOfStock: false,
	},
	{
		name: 'maroon_red',
		displayName: 'Maroon Red',
		hexCode: '#9D2235',
		isOutOfStock: false,
	},
	{
		name: 'red',
		displayName: 'Red',
		hexCode: '#C12E1F',
		isOutOfStock: false,
	},
	{
		name: 'pink',
		displayName: 'Pink',
		hexCode: '#F55A74',
		isOutOfStock: false,
	},
	{
		name: 'hot_pink',
		displayName: 'Hot Pink',
		hexCode: '#F5547C',
		isOutOfStock: false,
	},
	{
		name: 'orange',
		displayName: 'Orange',
		hexCode: '#FF6A13',
		isOutOfStock: false,
	},
	{
		name: 'pumpkin_orange',
		displayName: 'Pumpkin Orange',
		hexCode: '#FF9016',
		isOutOfStock: false,
	},
	{
		name: 'yellow',
		displayName: 'Yellow',
		hexCode: '#F4EE2A',
		isOutOfStock: false,
	},
	{
		name: 'bright_green',
		displayName: 'Bright Green',
		hexCode: '#BECF00',
		isOutOfStock: false,
	},
	{
		name: 'bambu_green',
		displayName: 'Bambu Green',
		hexCode: '#00AE42',
		isOutOfStock: false,
	},
	{
		name: 'mistletoe_green',
		displayName: 'Mistletoe Green',
		hexCode: '#3F8E43',
		isOutOfStock: false,
	},
	{
		name: 'cyan',
		displayName: 'Cyan',
		hexCode: '#0086D6',
		isOutOfStock: false,
	},
	{
		name: 'blue',
		displayName: 'Blue',
		hexCode: '#0A2989',
		isOutOfStock: false,
	},
	{
		name: 'cobalt_blue',
		displayName: 'Cobalt Blue',
		hexCode: '#0056B8',
		isOutOfStock: false,
	},
	{
		name: 'purple',
		displayName: 'Purple',
		hexCode: '#5E43B7',
		isOutOfStock: false,
	},
	{
		name: 'indigo_purple',
		displayName: 'Indigo Purple',
		hexCode: '#482960',
		isOutOfStock: false,
	},
	{
		name: 'blue_gray',
		displayName: 'Blue Gray',
		hexCode: '#5B6579',
		isOutOfStock: false,
	},
	{
		name: 'light_gray',
		displayName: 'Light Gray',
		hexCode: '#D1D3D5',
		isOutOfStock: false,
	},
	{
		name: 'dark_gray',
		displayName: 'Dark Gray',
		hexCode: '#545454',
		isOutOfStock: false,
	},
	{
		name: 'black',
		displayName: 'Black',
		hexCode: '#000000',
		isOutOfStock: false,
	},
	{
		name: 'ivory_white',
		displayName: 'Ivory White',
		hexCode: '#FFFFFF',

		isOutOfStock: true,
	},
	{
		name: 'latte_brown',
		displayName: 'Latte Brown',
		hexCode: '#D3B7A7',

		isOutOfStock: true,
	},
	{
		name: 'desert_tan',
		displayName: 'Desert Tan',
		hexCode: '#E8DBB7',

		isOutOfStock: true,
	},
	{
		name: 'ash_gray',
		displayName: 'Ash Gray',
		hexCode: '#9B9EA0',

		isOutOfStock: true,
	},
	{
		name: 'lilac_purple',
		displayName: 'Lilac Purple',
		hexCode: '#AE96D4',

		isOutOfStock: true,
	},
	{
		name: 'sakura_pink',
		displayName: 'Sakura Pink',
		hexCode: '#E8AFCF',

		isOutOfStock: true,
	},
	{
		name: 'mandarin_orange',
		displayName: 'Mandarin Orange',
		hexCode: '#F99963',

		isOutOfStock: true,
	},
	{
		name: 'scarlet_red',
		displayName: 'Scarlet Red',
		hexCode: '#DE4343',

		isOutOfStock: true,
	},
	{
		name: 'grass_green',
		displayName: 'Grass Green',
		hexCode: '#61C680',

		isOutOfStock: true,
	},
	{
		name: 'ice_blue',
		displayName: 'Ice Blue',
		hexCode: '#A3D8E1',

		isOutOfStock: true,
	},
	{
		name: 'marine_blue',
		displayName: 'Marine Blue',
		hexCode: '#0078BF',

		isOutOfStock: true,
	},
	{
		name: 'charcoal',
		displayName: 'Charcoal',
		hexCode: '#000000',

		isOutOfStock: true,
	},
	{
		name: 'gold',
		displayName: 'Gold',
		hexCode: '#E4BD68',

		isOutOfStock: true,
	},
	{
		name: 'silver',
		displayName: 'Silver',
		hexCode: '#A6A9AA',
		isOutOfStock: false,
	},
	{
		name: 'sunflower_yellow',
		displayName: 'Sunflower Yellow',
		hexCode: '#FEC600',

		isOutOfStock: true,
	},
	{
		name: 'magenta',
		displayName: 'Magenta',
		hexCode: '#EC008C',

		isOutOfStock: true,
	},
	{
		name: 'turquoise',
		displayName: 'Turquoise',
		hexCode: '#00B1B7',

		isOutOfStock: true,
	},
];

export type FontMenuItem = {
	fm_name: string;
	additive_font_id: string;
	subtractive_font_id: string;
};

export const FONT_MENU: FontMenuItem[] = [
	{
		fm_name: 'Caveat',
		additive_font_id: 'Caveat__medium',
		subtractive_font_id: 'Caveat__medium',
	},
	{
		fm_name: 'Charm',
		additive_font_id: 'Charm__bold',
		subtractive_font_id: 'Charm__regular',
	},
	{
		fm_name: 'Comic Neue',
		additive_font_id: 'Comic_Neue__bold',
		subtractive_font_id: 'Comic_Neue__bold',
	},
	{
		fm_name: 'Crimson Text',
		additive_font_id: 'Crimson_Text__bold',
		subtractive_font_id: 'Crimson_Text__semibold',
	},
	{
		fm_name: 'Crimson Text (Italic)',
		additive_font_id: 'Crimson_Text__bold_italic',
		subtractive_font_id: 'Crimson_Text__semibold_italic',
	},
	{
		fm_name: 'Fuzzy Bubbles',
		additive_font_id: 'Fuzzy_Bubbles__bold',
		subtractive_font_id: 'Fuzzy_Bubbles__regular',
	},
	{
		fm_name: 'Gluten',
		additive_font_id: 'Gluten__semibold',
		subtractive_font_id: 'Gluten__regular',
	},
	{
		fm_name: 'Gorditas',
		additive_font_id: 'Gorditas__bold',
		subtractive_font_id: 'Gorditas__regular',
	},
	{
		fm_name: 'Kalam',
		additive_font_id: 'Kalam__bold',
		subtractive_font_id: 'Kalam__regular',
	},
	{
		fm_name: 'Kodchasan',
		additive_font_id: 'Kodchasan__bold',
		subtractive_font_id: 'Kodchasan__medium',
	},
	{
		fm_name: 'Kodchasan (Italic)',
		additive_font_id: 'Kodchasan__bold_italic',
		subtractive_font_id: 'Kodchasan__medium_italic',
	},
	{
		fm_name: 'Mitr',
		additive_font_id: 'Mitr__bold',
		subtractive_font_id: 'Mitr__regular',
	},
	{
		fm_name: 'Noto Serif',
		additive_font_id: 'Noto_Serif__black',
		subtractive_font_id: 'Noto_Serif__medium',
	},
	{
		fm_name: 'Noto Serif (Italic)',
		additive_font_id: 'Noto_Serif__extrabold_italic',
		subtractive_font_id: 'Noto_Serif__medium_italic',
	},
	{
		fm_name: 'Oleo Script',
		additive_font_id: 'Oleo_Script__bold',
		subtractive_font_id: 'Oleo_Script__regular',
	},
	{
		fm_name: 'Oleo Script Swash Caps',
		additive_font_id: 'Oleo_Script_Swash_Caps__bold',
		subtractive_font_id: 'Oleo_Script_Swash_Caps__regular',
	},
	{
		fm_name: 'Roboto',
		additive_font_id: 'Roboto__black',
		subtractive_font_id: 'Roboto__medium',
	},
	{
		fm_name: 'Roboto (Italic)',
		additive_font_id: 'Roboto__black_italic',
		subtractive_font_id: 'Roboto__medium_italic',
	},
	{
		fm_name: 'Tillana',
		additive_font_id: 'Tillana__extrabold',
		subtractive_font_id: 'Tillana__regular',
	},
	{
		fm_name: 'Ubuntu Mono',
		additive_font_id: 'Ubuntu_Mono__bold',
		subtractive_font_id: 'Ubuntu_Mono__regular',
	},
];
