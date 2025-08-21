import { buildDimsPX, px2mm } from './constants';

import { component$, Signal, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { FILAMENT_COLOR } from './ColorSelector';
import { FONT_MENU, getFontInfoFromID } from './FontSelector';

// drawing's top left position on the canvas for the margin
const TEXT_START_X = 50;
const START_Y = 20;

export type BuildOptions = {
	font_menu: FONT_MENU[];
	filament_color: FILAMENT_COLOR[];
	text_top: Signal<string>;
	text_bottom: Signal<string>;
	font_id_top: Signal<string>;
	font_id_bottom: Signal<string>;
	primary_color_id: Signal<string>;
	base_color_id: Signal<string>;
	is_top_additive: Signal<boolean>;
	build_top_plate: boolean;
	build_bottom_plate: boolean;
	build_canvas_width_px?: number; // Optional: if provided, will set the canvas width to this value
	show_estimated_board_width?: boolean; // Optional: if true, will show the estimated board width
	output_top_canvas_element_id?: string; // Optional: if provided, will set the output canvas element ID
	output_bottom_canvas_element_id?: string; // Optional: if provided, will set the output canvas element ID
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

function color_id_2_hex(color_id: string, colorOptions: FILAMENT_COLOR[]): string {
	const color = colorOptions.find((c) => c.id === color_id);
	if (!color) {
		throw new Error(`Color with id ${color_id} not found`);
	}
	return color.hexCode;
}

function font_id_2_font_string(
	font_id: string,
	font_menu: FONT_MENU[],
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

export const BuildPlateVisualizerV3 = component$((buildOption: BuildOptions) => {
	const boardWidth_cm = useSignal<number>(0);
	useVisibleTask$(({ track }) => {
		track(() => buildOption.text_top.value);
		track(() => buildOption.text_bottom.value);
		track(() => buildOption.font_id_top.value);
		track(() => buildOption.font_id_bottom.value);
		track(() => buildOption.primary_color_id.value);
		track(() => buildOption.base_color_id.value);
		track(() => buildOption.is_top_additive.value);

		const primary_color_hex = color_id_2_hex(
			buildOption.primary_color_id.value,
			buildOption.filament_color
		);
		const base_color_hex = color_id_2_hex(
			buildOption.base_color_id.value,
			buildOption.filament_color
		);
		const font_top = font_id_2_font_string(
			buildOption.font_id_top.value,
			buildOption.font_menu,
			buildOption.is_top_additive.value
		);
		const font_bottom = font_id_2_font_string(
			buildOption.font_id_bottom.value,
			buildOption.font_menu,
			false // bottom plate is always subtractive
		);

		let bbox_top: BboxInfo | undefined;
		let bbox_btm: BboxInfo | undefined;
		let canvas_top: HTMLCanvasElement | undefined;
		let ctx_t: CanvasRenderingContext2D | null | undefined;
		let canvas_bottom: HTMLCanvasElement | undefined;
		let ctx_b: CanvasRenderingContext2D | null | undefined;
		let top_canvas_id = buildOption.output_top_canvas_element_id || 'canvas_top';
		let bottom_canvas_id = buildOption.output_bottom_canvas_element_id || 'canvas_bottom';

		if (buildOption.build_top_plate) {
			canvas_top = document.getElementById(top_canvas_id) as HTMLCanvasElement;
			ctx_t = canvas_top.getContext('2d');
			if (!ctx_t) throw new Error('Failed to get 2D context for top canvas');

			bbox_top = getTextBoundingBox(
				font_top,
				buildOption.text_top.value,
				ctx_t,
				TEXT_START_X,
				START_Y
			);
		}

		if (buildOption.build_bottom_plate) {
			canvas_bottom = document.getElementById(bottom_canvas_id) as HTMLCanvasElement;
			ctx_b = canvas_bottom.getContext('2d');
			if (!ctx_b) throw new Error('Failed to get 2D context for bottom canvas');

			bbox_btm = getTextBoundingBox(
				font_bottom,
				buildOption.text_bottom.value,
				ctx_b,
				TEXT_START_X,
				START_Y
			);
		}

		let text_width: number;
		if (buildOption.build_top_plate && buildOption.build_bottom_plate) {
			text_width = Math.max(bbox_top!.w, bbox_btm!.w);
		} else if (buildOption.build_top_plate) {
			text_width = bbox_top!.w;
		} else if (buildOption.build_bottom_plate) {
			text_width = bbox_btm!.w;
		} else {
			throw new Error('At least one plate must be built');
		}

		// top blank plate: it can be either additive or subtractive
		if (canvas_top && ctx_t && bbox_top) {
			draw_a_blank_plate_v3(
				canvas_top,
				primary_color_hex,
				base_color_hex,
				ctx_t,
				text_width,
				!buildOption.is_top_additive.value
			);

			// draw text on the top
			draw_text(
				buildOption.text_top.value,
				buildOption.is_top_additive.value ? primary_color_hex : base_color_hex,
				ctx_t,
				bbox_top,
				text_width
			);
		}

		// bottom blank plate: it is always subtractive
		if (canvas_bottom && ctx_b && bbox_btm) {
			draw_a_blank_plate_v3(
				canvas_bottom,
				primary_color_hex,
				base_color_hex,
				ctx_b,
				text_width,
				true,
				true
			);
			// draw text on the bottom
			draw_text(buildOption.text_bottom.value, base_color_hex, ctx_b, bbox_btm, text_width, true);
		}

		const boardWidth =
			text_width +
			buildDimsPX.ring_width +
			2 * (buildDimsPX.text_margin + buildDimsPX.boarder_width);
		boardWidth_cm.value = parseFloat(((px2mm * boardWidth) / 10).toFixed(1));

		// if (canvas_top && canvas_bottom) {
		// 	const canvas_stacked = document.getElementById(
		// 		buildOption.output_canvas_element_id || 'canvas_stacked'
		// 	) as HTMLCanvasElement;
		// 	const ctx_stacked = canvas_stacked.getContext('2d');
		// 	if (!ctx_stacked) throw new Error('Failed to get 2D context for stacked canvas');
		// 	ctx_stacked.clearRect(0, 0, canvas_stacked.width, canvas_stacked.height);

		// 	canvas_stacked.height = 200;
		// 	canvas_stacked.width = boardWidth + TEXT_START_X;
		// 	ctx_stacked.drawImage(canvas_top, 0, 0);
		// 	ctx_stacked.drawImage(canvas_bottom, 0, buildDimsPX.overall_height + START_Y / 2);
		// }
	});

	let build_canvas_width = buildOption.build_canvas_width_px || 100;

	let top_canvas_id = buildOption.output_top_canvas_element_id || 'canvas_top';
	let bottom_canvas_id = buildOption.output_bottom_canvas_element_id || 'canvas_bottom';
	// let output_canvas_element_id = buildOption.output_canvas_element_id || 'canvas_stacked';

	return (
		<div class="bg-transparent" style={{ width: `${build_canvas_width}px` }}>
			<div title="Plate Visualizer">
				<canvas
					id={top_canvas_id}
					class={`${buildOption.build_top_plate ? '' : 'hidden'}`}
					style={{
						width: `${build_canvas_width}px`,
						height: '100%',
					}}
				/>
				<canvas
					id={bottom_canvas_id}
					class={`${buildOption.build_bottom_plate ? '' : 'hidden'}`}
					style={{
						width: `${build_canvas_width}px`,
						height: '100%',
					}}
				/>
			</div>
			{buildOption.show_estimated_board_width && (
				<div class="text-center text-sm text-gray-500">
					Board width (estimated): {boardWidth_cm.value} cm
				</div>
			)}
		</div>
	);
});
