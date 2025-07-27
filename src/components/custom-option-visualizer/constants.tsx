const BUILD_DIMS_MM = {
	font_size: 12,
	text_margin: 1.5,
	text_extra_margin_right_for_italic: 4,
	text_extra_margin_right: 1.0,
	boarder_width: 1.6,
	ring_width: 8.6, // width of the ring hole
	offset_ring_hole: 2.6, // rim width around the ring hole
	w_ring_hole: 5,
	back_skirt_channel_width: 0.4,
};

// const px2mm = 0.264583;
export const px2mm = 0.2645;

const BUILD_DIMS_PX = Object.keys(BUILD_DIMS_MM).reduce(
	(acc: { [key: string]: number }, key: string) => {
		acc[key] = (BUILD_DIMS_MM as { [key: string]: number })[key] / px2mm;
		return acc;
	},
	{}
);
enum BuildUnit {
	MM = 'mm',
	PX = 'px',
}
class BuildDims {
	constructor(
		public font_size: number,
		public text_margin: number,
		public text_extra_margin_right_for_italic: number,
		public text_extra_margin_right: number,
		public boarder_width: number,
		public ring_width: number,
		public offset_ring_hole: number,
		public w_ring_hole: number,
		public back_skirt_channel_width: number
	) {}

	get text_padding() {
		return this.text_margin + this.boarder_width;
	}
	get overall_height() {
		return this.font_size + 2 * this.text_padding;
	}
}

export const buildDimsPX = new BuildDims(
	BUILD_DIMS_PX.font_size,
	BUILD_DIMS_PX.text_margin,
	BUILD_DIMS_PX.text_extra_margin_right_for_italic,
	BUILD_DIMS_PX.text_extra_margin_right,
	BUILD_DIMS_PX.boarder_width,
	BUILD_DIMS_PX.ring_width,
	BUILD_DIMS_PX.offset_ring_hole,
	BUILD_DIMS_PX.w_ring_hole,
	BUILD_DIMS_PX.back_skirt_channel_width
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
