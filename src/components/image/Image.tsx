import {
	component$,
	createContextId,
	useContext,
	useContextProvider,
	useId,
	useTask$,
	useSignal,
} from '@builder.io/qwik';
import type { QwikIntrinsicElements, QRL } from '@builder.io/qwik';

export const DEFAULT_RESOLUTIONS = [3840, 1920, 1280, 960, 640];

type ImageAttributes = QwikIntrinsicElements['img'];

/**
 * @alpha
 */
export type ImageState = {
	resolutions?: number[];
	imageTransformer$?: QRL<(params: ImageTransformerProps) => string>;
};

/**
 * @alpha
 */
export type ImageTransformerProps = {
	src: string;
	width: number;
	height: number | undefined;
};

/**
 * @alpha
 */
export interface ImageProps extends ImageAttributes {
	style?: Record<string, string | number>;
	aspectRatio?: number;
	layout: 'fixed' | 'constrained' | 'fullWidth';
	objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' | 'inherit' | 'initial';
}

export const ImageContext = createContextId<ImageState>('ImageContext');

/**
 * @alpha
 */
export const useImageProvider = (state: ImageState) => {
	useContextProvider(ImageContext, state);
};

export const getStyles = ({
	width,
	height,
	aspectRatio,
	objectFit = 'cover',
	layout,
}: Pick<ImageProps, 'width' | 'height' | 'aspectRatio' | 'objectFit' | 'layout'>): Record<
	string,
	string | undefined
> => {
	const isValid = (value?: string | number) => value || value === 0;
	const objectFitStyle = { 'object-fit': objectFit };
	switch (layout) {
		case 'fixed':
			return {
				...objectFitStyle,
				width: isValid(width) ? `${width}px` : undefined,
				height: isValid(height) ? `${height}px` : undefined,
			};
		case 'constrained':
			return {
				...objectFitStyle,
				width: '100%',
				'max-width': isValid(width) ? `${width}px` : undefined,
				'max-height': isValid(height) ? `${height}px` : undefined,
				'aspect-ratio': isValid(aspectRatio) ? `${aspectRatio}` : undefined,
			};
		case 'fullWidth':
			return {
				...objectFitStyle,
				width: '100%',
				'aspect-ratio': isValid(aspectRatio) ? `${aspectRatio}` : undefined,
				height: isValid(height) ? `${height}px` : undefined,
			};
	}
};

export const getSizes = ({ width, layout }: Pick<ImageProps, 'width' | 'layout'>) => {
	if (!width || !layout) {
		return undefined;
	}
	switch (layout) {
		// If screen is wider than the max size, image width is the max size,
		// otherwise it's the width of the screen
		case `constrained`:
			return `(min-width: ${width}px) ${width}px, 100vw`;

		// Image is always the same width, whatever the size of the screen
		case `fixed`:
			return `${width}px`;

		// Image is always the width of the screen
		case `fullWidth`:
			return `100vw`;

		default:
			return undefined;
	}
};

export const getSrcSet = async ({
	src = '',
	width,
	height,
	aspectRatio,
	layout,
	resolutions,
	imageTransformer$,
}: Pick<ImageProps, 'src' | 'width' | 'height' | 'aspectRatio' | 'layout'> &
	ImageState): Promise<string> => {
	const breakpoints = getBreakpoints({
		width: typeof width === 'string' ? parseInt(width, 10) : width,
		layout,
		resolutions: resolutions || DEFAULT_RESOLUTIONS,
	});

	const srcSets = [];
	for await (const breakpoint of breakpoints.sort()) {
		let transformedHeight;
		if (height && aspectRatio) {
			transformedHeight = Math.round(breakpoint * aspectRatio);
		}

		if (!imageTransformer$) {
			srcSets.push(`${src} ${breakpoint}w`);
			continue;
		}

		const transformed = await imageTransformer$({
			src,
			width: breakpoint,
			height: transformedHeight,
		});

		srcSets.push(`${transformed} ${breakpoint}w`);
	}

	return srcSets.join(',\n');
};

export const getBreakpoints = ({
	width: widthAttribute,
	layout,
	resolutions = [],
}: Pick<ImageProps, 'width' | 'layout'> & Pick<ImageState, 'resolutions'>): number[] => {
	if (layout === 'fullWidth') {
		return resolutions;
	}
	if (!widthAttribute) {
		return [];
	}
	const width = typeof widthAttribute === 'string' ? parseInt(widthAttribute, 10) : widthAttribute;
	const doubleWidth = width * 2;
	if (layout === 'fixed') {
		return [width, doubleWidth];
	}
	if (layout === 'constrained') {
		return [
			// Always include the image at 1x and 2x the specified width
			width,
			doubleWidth,
			// Filter out any resolutions that are larger than the double-res image
			...resolutions.filter((w) => w < doubleWidth),
		];
	}

	return [];
};

/**
 * @alpha
 */
export const Image = component$<ImageProps>((props) => {
	const state = useContext(ImageContext);
	const { resolutions, imageTransformer$, ...imageAttributes } = {
		...state,
		...props,
	};
	const style = { ...props.style, ...getStyles(props) };
	const sizes = getSizes(props);
	const srcSetSignal = useSignal('');

	const { src, width, height, aspectRatio, layout } = props;
	useTask$(async () => {
		srcSetSignal.value = await getSrcSet({
			src,
			width,
			height,
			aspectRatio,
			layout,
			resolutions,
			imageTransformer$,
		});
	});

	return (
		<img
			id={useId()}
			decoding="async"
			{...imageAttributes}
			style={style}
			width={['fullWidth', 'constrained'].includes(layout) ? undefined : width}
			height={['fullWidth', 'constrained'].includes(layout) ? undefined : height}
			srcSet={srcSetSignal.value}
			sizes={sizes}
		/>
	);
});
