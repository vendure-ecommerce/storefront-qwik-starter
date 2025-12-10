import { FilamentColor, FontMenu } from '~/generated/graphql-shop';
import { getFontInfoFromID } from './FontSelector';
import { buildDimsPX, CONSTRAINTS, px2mm } from './constants';

// drawing's top left position on the canvas for the margin
const TEXT_START_X = 50;
const START_Y = 20;

export interface NameTagBuildParams {
	text_top?: string;
	text_bottom?: string;
	font_id_top?: string;
	font_id_bottom?: string;
	primary_color_id: string;
	base_color_id: string;
	is_top_additive: boolean;
}

export type BuildProps = {
	font_menu: Pick<FontMenu, 'id' | 'name' | 'additiveFontId' | 'subtractiveFontId'>[];
	filament_color: Pick<FilamentColor, 'id' | 'name' | 'hexCode'>[];
	buildParams: NameTagBuildParams;
	build_top_plate: boolean;
	build_bottom_plate: boolean;
	canvas_top: HTMLCanvasElement;
	canvas_bottom: HTMLCanvasElement;
	canvas_stacked?: HTMLCanvasElement;
	// canvas_concatenate: Signal<HTMLCanvasElement | undefined>;
};

function getFontCanvasString(
	font: string, // font is in the format of "Crimson_Text__bold_italic"
	font_size_multiplier: number = 1.0
): string {
	let fontInfo = getFontInfoFromID(font);
	const font_option_text = `${fontInfo.fontStyle} normal normal ${buildDimsPX.font_size * font_size_multiplier}px ${fontInfo.fontFamily}`;
	return font_option_text;
}

type BboxInfo = {
	x: number;
	y: number;
	w: number;
	h: number;
	text_start_y: number;
	text_start_x_offset: number;
	font_string: string;
};

function getTextBoundingBox(
	raw_font_string: string, // e.g. crimson_text__bold_italic
	text: string, // e.g. 'Happy'
	ctx: CanvasRenderingContext2D,
	text_x: number,
	text_y: number
): BboxInfo {
	// get xywh of the text bounding box
	let font_string = getFontCanvasString(raw_font_string);
	ctx.font = font_string;
	let textMetrics_raw = ctx.measureText(text);
	let textHeight_raw =
		textMetrics_raw.actualBoundingBoxAscent + textMetrics_raw.actualBoundingBoxDescent;

	let font_string_adjusted = getFontCanvasString(
		raw_font_string,
		buildDimsPX.font_size / textHeight_raw
	);
	ctx.font = font_string_adjusted;
	let textMetrics = ctx.measureText(text);
	let textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

	let italic_adjustment =
		getFontInfoFromID(raw_font_string).fontStyle === 'italic'
			? buildDimsPX.text_extra_margin_right_for_italic
			: buildDimsPX.text_extra_margin_right;

	let x = text_x - textMetrics.actualBoundingBoxLeft;
	let y = text_y - textMetrics.actualBoundingBoxAscent;
	let w = textMetrics.width;
	let h = textHeight;
	return {
		x: x,
		y: y,
		w: w + italic_adjustment,
		h: h,
		text_start_y: text_y + textMetrics.actualBoundingBoxAscent,
		text_start_x_offset: italic_adjustment / 3,
		font_string: font_string_adjusted,
	};
}

async function draw_a_blank_plate_v3(
	canvasElement: HTMLCanvasElement,
	primary_color_hex: string,
	base_color_hex: string,
	ctx: CanvasRenderingContext2D,
	text_width: number,
	is_subtractive = false,
	reversed = false
) {
	// clear the canvas
	ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
	ctx.lineWidth = 0;

	let text_padding = buildDimsPX.text_padding;
	let overall_height = buildDimsPX.overall_height;
	let overall_width = text_width + 2 * text_padding + buildDimsPX.ring_width;
	let plate_left_x = TEXT_START_X - text_padding - buildDimsPX.ring_width;

	// set the canvas width to fit the plate
	ctx.canvas.width = overall_width + 20;
	ctx.canvas.height = overall_height + START_Y;

	ctx.fillStyle = primary_color_hex;
	ctx.strokeStyle = 'black';
	ctx.beginPath();
	// The overall outer shape
	ctx.roundRect(plate_left_x, START_Y - text_padding, overall_width, overall_height, 8);

	// The ring hole
	let ring_left_x = reversed
		? plate_left_x + overall_width - buildDimsPX.offset_ring_hole - buildDimsPX.w_ring_hole
		: plate_left_x + buildDimsPX.offset_ring_hole;
	ctx.roundRect(
		ring_left_x,
		START_Y - text_padding + buildDimsPX.offset_ring_hole,
		buildDimsPX.w_ring_hole,
		overall_height - buildDimsPX.offset_ring_hole * 2,
		5
	);
	ctx.stroke();
	ctx.fill('evenodd');

	// draw the back skirt channel
	ctx.lineWidth = buildDimsPX.back_skirt_channel_width;
	ctx.strokeStyle = base_color_hex;
	ctx.beginPath();

	let skirt_left_x = reversed
		? plate_left_x + buildDimsPX.text_margin
		: TEXT_START_X - buildDimsPX.text_margin;

	ctx.roundRect(
		skirt_left_x,
		START_Y - buildDimsPX.text_margin,
		text_width + 2 * buildDimsPX.text_margin,
		overall_height - 2 * buildDimsPX.boarder_width,
		3
	);
	ctx.stroke();
	if (!is_subtractive) {
		ctx.fillStyle = base_color_hex;
		ctx.fill();
	}
	// ctx.strokeStyle = 'black';
}

function color_id_2_hex(
	color_id: string,
	colorOptions: Pick<FilamentColor, 'id' | 'name' | 'hexCode'>[]
): string {
	const color = colorOptions.find((c) => c.id === color_id);
	if (!color) {
		throw new Error(`Color with id ${color_id} not found`);
	}
	return color.hexCode;
}

function font_id_2_font_string(
	font_id: string,
	font_menu: Pick<FontMenu, 'id' | 'name' | 'additiveFontId' | 'subtractiveFontId'>[],
	is_additive: boolean = true
): string {
	const font = font_menu.find((f) => f.id === font_id);
	if (!font) {
		throw new Error(`Font with id ${font_id} not found`);
	}
	return is_additive ? font.additiveFontId : font.subtractiveFontId;
}

function draw_text(
	text: string,
	text_color_hex: string,
	ctx: CanvasRenderingContext2D,
	bbox: BboxInfo,
	base_width: number,
	reversed = false
) {
	ctx.fillStyle = text_color_hex;
	ctx.font = bbox.font_string;
	let reverse_shift = reversed ? buildDimsPX.ring_width : 0;
	let x_offset = (base_width - bbox.w) / 2 - reverse_shift;
	ctx.fillText(text, TEXT_START_X + x_offset + bbox.text_start_x_offset, bbox.text_start_y);
	ctx.stroke();
}

export function BuildPlateVisualizerV4(args: BuildProps): {
	boardWidth_cm: number;
	valid: boolean;
} {
	const params = args.buildParams;
	// export const BuildPlateVisualizerV4 = component$((args: BuildProps): number => {
	if (!args.build_top_plate && !args.build_bottom_plate) {
		throw new Error('At least one plate must be built');
	}

	params.is_top_additive = params.is_top_additive ?? true;

	const primary_color_hex = color_id_2_hex(params.primary_color_id, args.filament_color);
	const base_color_hex = color_id_2_hex(params.base_color_id, args.filament_color);

	let bbox_top: BboxInfo | undefined;
	let ctx_t: CanvasRenderingContext2D | null | undefined;

	let bbox_btm: BboxInfo | undefined;
	let ctx_b: CanvasRenderingContext2D | null | undefined;

	if (args.build_top_plate) {
		if (!params.text_top || !params.font_id_top) {
			throw new Error('text_top and font_id_top must be provided for the top plate.');
		}
		ctx_t = args.canvas_top.getContext('2d');
		if (!ctx_t) throw new Error('Failed to get 2D context for top canvas');

		const font_top = font_id_2_font_string(
			params.font_id_top,
			args.font_menu,
			params.is_top_additive
		);

		bbox_top = getTextBoundingBox(font_top, params.text_top, ctx_t, TEXT_START_X, START_Y);
	}

	if (args.build_bottom_plate) {
		if (!params.text_bottom || !params.font_id_bottom) {
			throw new Error('text_bottom and font_id_bottom must be provided for the bottom plate.');
		}
		ctx_b = args.canvas_bottom.getContext('2d');
		if (!ctx_b) throw new Error('Failed to get 2D context for bottom canvas');

		const font_bottom = font_id_2_font_string(
			params.font_id_bottom,
			args.font_menu,
			false // bottom plate is always subtractive
		);
		bbox_btm = getTextBoundingBox(font_bottom, params.text_bottom, ctx_b, TEXT_START_X, START_Y);
	}

	let text_width: number;
	if (args.build_top_plate && args.build_bottom_plate) {
		text_width = Math.max(bbox_top!.w, bbox_btm!.w);
	} else if (args.build_top_plate) {
		text_width = bbox_top!.w;
	} else if (args.build_bottom_plate) {
		text_width = bbox_btm!.w;
	} else {
		throw new Error('At least one plate must be built');
	}

	// top blank plate: it can be either additive or subtractive
	if (args.build_top_plate && args.canvas_top && ctx_t && bbox_top && params.text_top) {
		draw_a_blank_plate_v3(
			args.canvas_top,
			primary_color_hex,
			base_color_hex,
			ctx_t,
			text_width,
			!params.is_top_additive
		);

		// draw text on the top
		draw_text(
			params.text_top,
			params.is_top_additive ? primary_color_hex : base_color_hex,
			ctx_t,
			bbox_top,
			text_width
		);
	}

	// bottom blank plate: it is always subtractive
	if (args.build_bottom_plate && args.canvas_bottom && ctx_b && bbox_btm && params.text_bottom) {
		draw_a_blank_plate_v3(
			args.canvas_bottom,
			primary_color_hex,
			base_color_hex,
			ctx_b,
			text_width,
			true,
			true
		);
		// draw text on the bottom
		draw_text(params.text_bottom, base_color_hex, ctx_b, bbox_btm, text_width, true);
	}

	const boardWidth =
		text_width + buildDimsPX.ring_width + 2 * (buildDimsPX.text_margin + buildDimsPX.boarder_width);
	const boardWidth_cm = parseFloat(((px2mm * boardWidth) / 10).toFixed(1));

	if (args.canvas_stacked) {
		const ctx_stacked = args.canvas_stacked.getContext('2d');
		if (!ctx_stacked) throw new Error('Failed to get 2D context for stacked canvas');
		ctx_stacked.clearRect(0, 0, args.canvas_stacked.width, args.canvas_stacked.height);
		args.canvas_stacked.width =
			boardWidth + TEXT_START_X - buildDimsPX.text_padding - buildDimsPX.ring_width + 5;
		const single_canvas_height = buildDimsPX.overall_height + START_Y / 2;
		if (args.canvas_top && args.canvas_bottom) {
			args.canvas_stacked.height = single_canvas_height * 2;
			ctx_stacked.drawImage(args.canvas_top, 0, 0);
			ctx_stacked.drawImage(args.canvas_bottom, 0, single_canvas_height);
		} else {
			// filter out the case where none of the canvases are built
			if (!ctx_stacked) throw new Error('Failed to get 2D context for stacked canvas');
			const singleCanvas = args.canvas_top ?? args.canvas_bottom;
			if (singleCanvas) {
				args.canvas_stacked.height = single_canvas_height;
				ctx_stacked.drawImage(singleCanvas, 0, 0);
			}
		}
	}

	return { boardWidth_cm: boardWidth_cm, valid: boardWidth_cm <= CONSTRAINTS.maxPlateWidth };
}
