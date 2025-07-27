import { BUILD_DIMS, px2mm } from './constants';

import { component$, Signal, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { getFontInfoFromID } from './FontSelector';

// drawing's top left position on the canvas for the margin
const START_X = 50;
const START_Y = 30;

export type ItemOptions = {
	text_top: Signal<string>;
	text_bottom: Signal<string>;
	font_top: Signal<string>;
	font_bottom: Signal<string>;
	primary_color_hex: Signal<string>;
	base_color_hex: Signal<string>;
	is_top_additive: Signal<boolean>;
};

function getFontCanvasString(
	font: string, // font is in the format of "Crimson_Text__bold_italic"
	font_size_multiplier: number = 1.0
): string {
	let fontInfo = getFontInfoFromID(font);
	const font_option_text = `${fontInfo.fontStyle} normal normal ${BUILD_DIMS.font_size * font_size_multiplier}px ${fontInfo.fontFamily}`;
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
		BUILD_DIMS.font_size / textHeight_raw
	);
	ctx.font = font_string_adjusted;
	let textMetrics = ctx.measureText(text);
	let textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

	let italic_adjustment =
		getFontInfoFromID(raw_font_string).fontStyle === 'italic'
			? BUILD_DIMS.text_extra_margin_right_for_italic
			: BUILD_DIMS.text_extra_margin_right;

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

async function draw_a_blank_plate_v2(
	canvasElement: HTMLCanvasElement,
	primary_color_hex: string,
	base_color_hex: string,
	ctx: CanvasRenderingContext2D,
	text_width: number,
	is_subtractive = false
) {
	// clear the canvas
	ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
	ctx.lineWidth = 0;

	let text_padding = BUILD_DIMS.text_margin + BUILD_DIMS.boarder_width;
	let overall_height = BUILD_DIMS.font_size + 2 * text_padding;
	let overall_width = text_width + 2 * text_padding + BUILD_DIMS.ring_width;

	// set the canvas width to fit the plate
	ctx.canvas.width = overall_width + 20;

	ctx.fillStyle = primary_color_hex;
	ctx.strokeStyle = 'black';
	ctx.beginPath();
	// The overall outer shape
	ctx.roundRect(
		START_X - text_padding - BUILD_DIMS.ring_width,
		START_Y - text_padding,
		text_width + 2 * text_padding + BUILD_DIMS.ring_width,
		overall_height,
		8
	);

	// The ring hole
	ctx.roundRect(
		START_X - text_padding - BUILD_DIMS.ring_width + BUILD_DIMS.offset_ring_hole,
		START_Y - text_padding + BUILD_DIMS.offset_ring_hole,
		BUILD_DIMS.w_ring_hole,
		overall_height - BUILD_DIMS.offset_ring_hole * 2,
		5
	);
	ctx.stroke();
	ctx.fill('evenodd');

	ctx.lineWidth = BUILD_DIMS.back_skirt_channel_width;
	ctx.strokeStyle = base_color_hex;
	ctx.beginPath();
	ctx.roundRect(
		START_X - BUILD_DIMS.text_margin,
		START_Y - BUILD_DIMS.text_margin,
		text_width + 2 * BUILD_DIMS.text_margin,
		overall_height - 2 * BUILD_DIMS.boarder_width,
		3
	);
	ctx.stroke();
	if (!is_subtractive) {
		ctx.fillStyle = base_color_hex;
		ctx.fill();
	}
	// ctx.strokeStyle = 'black';
}

function draw_text(
	text: string,
	text_color_hex: string,
	ctx: CanvasRenderingContext2D,
	bbox: BboxInfo,
	base_width: number
) {
	ctx.fillStyle = text_color_hex;
	ctx.font = bbox.font_string;
	let x_offset = (base_width - bbox.w) / 2;
	ctx.fillText(text, START_X + x_offset + bbox.text_start_x_offset, bbox.text_start_y);
	ctx.stroke();
}

export const BuildPlateVisualizerV2 = component$((itemOptions: ItemOptions) => {
	const boardWidth_cm = useSignal<number>(0);
	useVisibleTask$(({ track }) => {
		track(() => itemOptions.text_top.value);
		track(() => itemOptions.text_bottom.value);
		track(() => itemOptions.font_top.value);
		track(() => itemOptions.font_bottom.value);
		track(() => itemOptions.primary_color_hex.value);
		track(() => itemOptions.base_color_hex.value);
		track(() => itemOptions.is_top_additive.value);

		console.log('BuildPlateVisualizerV2: re-rendering with itemOptions:', itemOptions);

		const canvas_top = document.getElementById('canvas_top') as HTMLCanvasElement;
		const canvas_bottom = document.getElementById('canvas_bottom') as HTMLCanvasElement;
		const canvas_stacked = document.getElementById('canvas_stacked') as HTMLCanvasElement;

		const ctx_t = canvas_top.getContext('2d');
		const ctx_b = canvas_bottom.getContext('2d');
		const ctx_stacked = canvas_stacked.getContext('2d');

		if (!ctx_t || !ctx_b || !ctx_stacked) {
			throw new Error('Failed to get 2D context');
		}

		const bbox_top = getTextBoundingBox(
			itemOptions.font_top.value,
			itemOptions.text_top.value,
			ctx_t,
			START_X,
			START_Y
		);

		const bbox_btm = getTextBoundingBox(
			itemOptions.font_bottom.value,
			itemOptions.text_bottom.value,
			ctx_b,
			START_X,
			START_Y
		);

		const text_width = Math.max(bbox_top.w, bbox_btm.w);

		// top blank plate: it can be either additive or subtractive
		draw_a_blank_plate_v2(
			canvas_top,
			itemOptions.primary_color_hex.value,
			itemOptions.base_color_hex.value,
			ctx_t,
			text_width,
			!itemOptions.is_top_additive.value
		);
		// bottom blank plate: it is always subtractive
		draw_a_blank_plate_v2(
			canvas_bottom,
			itemOptions.primary_color_hex.value,
			itemOptions.base_color_hex.value,
			ctx_b,
			text_width,
			true
		);

		// draw text on the top
		draw_text(
			itemOptions.text_top.value,
			itemOptions.is_top_additive.value
				? itemOptions.primary_color_hex.value
				: itemOptions.base_color_hex.value,
			ctx_t,
			bbox_top,
			text_width
		);

		// draw text on the bottom
		draw_text(
			itemOptions.text_bottom.value,
			itemOptions.base_color_hex.value,
			ctx_b,
			bbox_btm,
			text_width
		);

		const boardWidth =
			text_width + BUILD_DIMS.ring_width + 2 * (BUILD_DIMS.text_margin + BUILD_DIMS.boarder_width);

		ctx_stacked.clearRect(0, 0, canvas_stacked.width, canvas_stacked.height);

		canvas_stacked.height = 200;
		canvas_stacked.width = boardWidth + START_X;
		ctx_stacked.drawImage(canvas_top, 0, 0);
		ctx_stacked.drawImage(canvas_bottom, 0, 80);

		boardWidth_cm.value = parseFloat(((px2mm * boardWidth) / 10).toFixed(1));
	});

	return (
		<div class="overflow-auto p-0 bg-white">
			<div>
				<canvas id="canvas_top" class="w-400 h-auto hidden" />
				<canvas id="canvas_bottom" class="w-400 h-auto hidden" />
				<canvas id="canvas_stacked" class="w-400 h-800" />
			</div>
			<div class="text-center text-sm text-gray-500 mt-2">
				Board width (estimated): {boardWidth_cm.value} cm
			</div>

			{/* A button to save canvas_stacked */}
			<div class="text-center mt-4">
				<button
					class="bg-blue-500 text-white px-4 py-2 rounded"
					onClick$={() => {
						const canvas = document.getElementById('canvas_stacked') as HTMLCanvasElement;
						const link = document.createElement('a');
						link.download = 'canvas_stacked.jpg';
						link.href = canvas.toDataURL('image/jpeg', 0.5);
						link.click();
					}}
				>
					Save Canvas
				</button>
			</div>
		</div>
	);
});
