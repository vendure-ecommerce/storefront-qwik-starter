import { component$, Signal, Slot, useVisibleTask$ } from '@qwik.dev/core';

interface CanvasInfo {
	id: string;
	canvasRef: Signal<HTMLCanvasElement>;
	skip: boolean;
}

interface BuildCanvasesProps {
	topCanvasInfo: CanvasInfo;
	bottomCanvasInfo: CanvasInfo;
	canvas_width_px?: number;
	concatenate_canvas_element_id?: string; // if defined, this will output a single stacked canvas, top and bottom canvas elements will be
}

export default component$(
	({
		topCanvasInfo,
		bottomCanvasInfo,
		concatenate_canvas_element_id,
		canvas_width_px = 250,
	}: BuildCanvasesProps) => {
		useVisibleTask$(() => {
			if (concatenate_canvas_element_id) {
				createFinalCanvas(topCanvasInfo, bottomCanvasInfo, concatenate_canvas_element_id);
			}
		});

		return (
			<>
				<div
					class={`bg-transparent h-fit ${concatenate_canvas_element_id ? 'hidden' : ''}`}
					style={{ width: `${canvas_width_px}px` }}
				>
					<canvas
						ref={topCanvasInfo.canvasRef}
						id={topCanvasInfo.id}
						class={`${topCanvasInfo.skip ? 'hidden' : 'block'}`}
						style={{
							width: `${canvas_width_px}px`,
							height: '100%',
						}}
					/>
					<canvas
						ref={bottomCanvasInfo.canvasRef}
						id={bottomCanvasInfo.id}
						class={`${bottomCanvasInfo.skip ? 'hidden' : 'block'}`}
						style={{
							width: `${canvas_width_px}px`,
							height: '100%',
						}}
					/>
					<Slot />
				</div>
				{concatenate_canvas_element_id && (
					<canvas
						id={concatenate_canvas_element_id}
						style={{
							width: `${canvas_width_px}px`,
						}}
					/>
				)}
			</>
		);
	}
);

const createFinalCanvas = (
	canvas_top_info: CanvasInfo,
	canvas_bottom_info: CanvasInfo,
	concatenate_canvas_element_id: string
): void => {
	if (canvas_top_info.skip && canvas_bottom_info.skip) {
		console.error('Both canvases are skipped, nothing to stack.');
		return;
	}

	const stackedCanvas = document.getElementById(concatenate_canvas_element_id) as HTMLCanvasElement;
	const context = stackedCanvas.getContext('2d');
	if (!context) {
		console.error('Failed to get 2D context for stacked canvas.');
		return;
	}

	if (!canvas_top_info.skip && !canvas_bottom_info.skip) {
		// Both canvases to draw, draw one on top of the other
		const canvas_top = canvas_top_info.canvasRef.value;
		const canvas_bottom = canvas_bottom_info.canvasRef.value;

		const width = Math.max(canvas_top.width, canvas_bottom.width);
		const height = canvas_top.height + canvas_bottom.height;
		stackedCanvas.width = width;
		stackedCanvas.height = height;

		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);

		context.drawImage(canvas_top, 0, 0);
		context.drawImage(canvas_bottom, 0, canvas_top.height);
		return;
	}
	if (!canvas_bottom_info.skip || !canvas_top_info.skip) {
		// Only one canvas to draw
		{
			const singleCanvasInfo = !canvas_top_info.skip ? canvas_top_info : canvas_bottom_info;
			const singleCanvas = singleCanvasInfo.canvasRef.value;

			stackedCanvas.width = singleCanvas.width;
			stackedCanvas.height = singleCanvas.height;
			context.fillStyle = 'white';
			context.fillRect(0, 0, singleCanvas.width, singleCanvas.height);
			context.drawImage(singleCanvas, 0, 0);
			return;
		}
	}
};
