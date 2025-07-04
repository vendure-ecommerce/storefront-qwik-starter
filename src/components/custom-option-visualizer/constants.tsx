const BUILD_DIMS_MM = {
	font_size: 12,
	text_margin: 1.5,
	text_extra_margin_right_for_italic: 4,
	text_extra_margin_right: 1.0,
	boarder_width: 1.6,
	ring_width: 8.6,
	offset_ring_hole: 2.6,
	w_ring_hole: 5,
	back_skirt_channel_width: 0.4,
};

// const px2mm = 0.264583;
export const px2mm = 0.2645;

export const BUILD_DIMS = Object.keys(BUILD_DIMS_MM).reduce(
	(acc: { [key: string]: number }, key: string) => {
		acc[key] = (BUILD_DIMS_MM as { [key: string]: number })[key] / px2mm;
		return acc;
	},
	{}
);

export const DEFAULT_DISPLAY = {
	text: 'DetailDiligence',
	font_top: 'Charm__bold',
	font_bottom: 'Charm__regular',
	primary_color: 'sunflower_yellow',
	base_color: 'charcoal',
};

export const maxWidth = 8; // cm

export const CONSTRAINTS = {
	maxTextLength: 16,
	maxPlateWidth: 8, // cm
	validSpecialChars: '\\sA-Za-z0-9:;,.-_!?><@^`#$&%+=~*(){}[\\]|/"\'',
};
