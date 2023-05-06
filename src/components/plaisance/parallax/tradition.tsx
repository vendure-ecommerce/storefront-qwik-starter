import { component$, useSignal, useVisibleTask$, type Signal } from '@builder.io/qwik';

interface Props {
	activeSection: Signal<string>;
}

export default component$(({ activeSection }: Props) => {
	const traditionSection = useSignal<Element>();
	const slideUp = useSignal('');
	useVisibleTask$(() => {
		activeSection.value = 'tradition';
		if (activeSection.value === 'tradition') {
			slideUp.value = 'slide-up';
		} else {
			slideUp.value = '';
		}
	});
	return (
		<section
			id="tradition"
			ref={traditionSection}
			class="relative h-screen w-screen max-w-[100vw] overflow-hidden bg-black"
		>
			<div
				class="banner-bg absolute inset-0 scale-125"
				x-ref="bgImageTrandition"
				x-intersect:leave="removeClass('zoom-out', $refs.bgImageTrandition)"
			>
				<picture>
					<source
						media="(max-width: 640px)"
						type="image/webp"
						srcSet="/img/banners/banner_2_640.webp"
						width="640"
						height="426"
					/>
					<source
						media="(max-width: 640px)"
						srcSet="/img/banners/banner_2_640.jpeg"
						width="640"
						height="426"
					/>
					<source
						media="(max-width: 768px)"
						type="image/webp"
						srcSet="/img/banners/banner_2_768.webp"
						width="768"
						height="511"
					/>
					<source
						media="(max-width: 768px)"
						srcSet="/img/banners/banner_2_768.jpeg"
						width="768"
						height="511"
					/>
					<source
						media="(max-width: 1024px)"
						type="image/webp"
						srcSet="/img/banners/banner_2_1024.webp"
						width="1024"
						height="681"
					/>
					<source
						media="(max-width: 1024px)"
						srcSet="/img/banners/banner_2_1024.jpeg"
						width="1024"
						height="681"
					/>
					<source
						media="(max-width: 1280px)"
						type="image/webp"
						srcSet="/img/banners/banner_2_1280.webp"
						width="1280"
						height="852"
					/>
					<source
						media="(max-width: 1280px)"
						srcSet="/img/banners/banner_2_1280.jpeg"
						width="1280"
						height="852"
					/>
					<source
						media="(max-width: 1536px)"
						type="image/webp"
						srcSet="/img/banners/banner_2_1536.webp"
						width="1536"
						height="1022"
					/>
					<source
						media="(max-width: 1536px)"
						srcSet="/img/banners/banner_2_1536.jpeg"
						width="1536"
						height="1022"
					/>
					<img
						class="h-full w-full object-cover object-center"
						src="/img/banners/banner_2.jpeg"
						width="2000"
						height="1331"
						loading="lazy"
						decoding="async"
						alt="Tradition"
					/>
				</picture>
			</div>
			<div class="absolute inset-0 bg-black/60"></div>
			<div class="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-8 text-center">
				<div class="overflow-hidden">
					<h2
						class={`hero-title opacity-0 ${slideUp.value}`}
						x-intersect:enter="addClass('slide-up');addClass('zoom-out', $refs.bgImageTrandition);"
						x-intersect:leave="removeClass('slide-up');"
					>
						TRADITION
					</h2>
				</div>
				<p
					class={`mx-auto mt-4 max-w-sm text-center text-lg text-white opacity-0 sm:text-2xl lg:max-w-xl ${slideUp.value}`}
					style="animation-delay: 400ms"
					x-intersect:enter="addClass('slide-up')"
					x-intersect:leave="removeClass('slide-up')"
				>
					Here in the heart of the Saint-Emilion appellation of Bordeaux, known as the world capital
					of fine wine, our family works the land just like the generations of winemakers that came
					before us. Together we honor the winemaking tradition of Château Plaisance, founded in
					1881, and the rich history of Bordeaux wine, which is woven into the rolling green hills
					and valleys that surround us. The first wines were cultivated here by the Romans. Much may
					have changed since then, but our dedication to the land and the vines remains the same.
				</p>
			</div>
		</section>
	);
});
