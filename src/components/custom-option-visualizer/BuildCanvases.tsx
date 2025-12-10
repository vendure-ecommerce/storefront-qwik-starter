import { component$, Signal, Slot } from '@qwik.dev/core';

interface CanvasInfo {
	id: string;
	canvasRef: Signal<HTMLCanvasElement>;
	hidden: boolean;
}

interface BuildCanvasesProps {
	topCanvasInfo: CanvasInfo;
	bottomCanvasInfo: CanvasInfo;
	stackedHiddenCanvasInfo?: CanvasInfo;
	canvas_width_px?: number;
}

export default component$(
	({
		topCanvasInfo,
		bottomCanvasInfo,
		stackedHiddenCanvasInfo,
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
				{stackedHiddenCanvasInfo && (
					<canvas
						ref={stackedHiddenCanvasInfo.canvasRef}
						id={stackedHiddenCanvasInfo.id}
						class="hidden"
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
