import { component$, Signal, Slot } from '@qwik.dev/core';

interface CanvasInfo {
	id: string;
	canvasRef: Signal<HTMLCanvasElement>;
	hidden: boolean;
}

interface BuildCanvasesProps {
	topCanvasInfo: CanvasInfo;
	bottomCanvasInfo: CanvasInfo;
	stackedCanvasInfo?: CanvasInfo;
	canvas_width_px?: number;
}

export default component$(
	({
		topCanvasInfo,
		bottomCanvasInfo,
		stackedCanvasInfo,
		canvas_width_px = 250,
	}: BuildCanvasesProps) => {
		return (
			<div class="bg-transparent h-fit" style={{ width: `${canvas_width_px}px` }}>
				<canvas
					ref={topCanvasInfo.canvasRef}
					id={topCanvasInfo.id}
					class={`${topCanvasInfo.hidden ? 'hidden' : 'block'}`}
					style={{
						width: `${canvas_width_px}px`,
						height: '100%',
					}}
				/>
				<canvas
					ref={bottomCanvasInfo.canvasRef}
					id={bottomCanvasInfo.id}
					class={`${bottomCanvasInfo.hidden ? 'hidden' : 'block'}`}
					style={{
						width: `${canvas_width_px}px`,
						height: '100%',
					}}
				/>
				{stackedCanvasInfo && (
					<canvas
						ref={stackedCanvasInfo.canvasRef}
						id={stackedCanvasInfo.id}
						class={`${stackedCanvasInfo.hidden ? 'hidden' : 'block'}`}
						style={{
							width: `${canvas_width_px}px`,
							height: '100%',
						}}
					/>
				)}
				<Slot />
			</div>
		);
	}
);

// const stackTwoCanvases = (
//   canvas_top: HTMLCanvasElement,
//   canvas_bottom: HTMLCanvasElement
// ): HTMLCanvasElement => {
//   const stackedCanvas = document.createElement('canvas');
//   const context = stackedCanvas.getContext('2d');

//   if (context) {
//     const width = Math.max(canvas_top.width, canvas_bottom.width);
//     const height = canvas_top.height + canvas_bottom.height;

//     stackedCanvas.width = width;
//     stackedCanvas.height = height;

//     context.fillStyle = 'white';
//     context.fillRect(0, 0, width, height);

//     context.drawImage(canvas_top, 0, 0);
//     context.drawImage(canvas_bottom, 0, canvas_top.height);
//   }

//   return stackedCanvas;
// };
