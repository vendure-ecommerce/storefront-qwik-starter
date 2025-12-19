import { component$ } from '@builder.io/qwik';
import { Image } from 'qwik-image';

interface Props {
	previews: string[];
	maxShown?: number;
	size?: number; // px
	altPrefix?: string;
	class?: string;
}

export default component$<Props>(
	({ previews, maxShown = 2, size = 100, altPrefix = '', class: className }: Props) => {
		const images = (previews || []).filter(Boolean);
		const shown = images.slice(0, maxShown);
		const moreCount = images.length - shown.length;

		const w = size;
		const h = size;

		return (
			<div
				class={`flex relative overflow-y-auto ${className}`}
				// style={{ height: `${h}px`, width: `${w + (shown.length - 1) * (w / 2)}px` }}
			>
				{shown.map((src, idx) => (
					<Image
						key={idx}
						layout="fixed"
						width={`${w}`}
						height={`${h}`}
						aspectRatio={1}
						// class={`absolute ${idx === 0 ? '' : `left-${Math.floor((w / 2) * idx)}`} rounded-lg border-2 border-white shadow object-cover`}
						src={src}
						alt={`${altPrefix} ${idx + 1}`}
					/>
				))}
				{moreCount > 0 && (
					<div class="absolute bottom-0 right-0 text-xs bg-base-300/80 px-2 py-1 rounded">
						... and {moreCount} more
					</div>
				)}
			</div>
		);
	}
);
