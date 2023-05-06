import { component$, useSignal, useVisibleTask$, type Signal } from '@builder.io/qwik';

interface Props {
	activeSection: Signal<string>;
}

export default component$(({ activeSection }: Props) => {
	const slideUp = useSignal('');
	useVisibleTask$(() => {
		activeSection.value = 'identity';
		if (activeSection.value === 'identity') {
			slideUp.value = 'slide-up';
		} else {
			slideUp.value = '';
		}
	});
	return (
		<section
			id="identity"
			class="relative h-screen w-screen max-w-[100vw] overflow-hidden bg-black"
		>
			<div
				class="banner-bg absolute inset-0 scale-125"
				x-intersect:enter="addClass('zoom-out')"
				x-intersect:leave="removeClass('zoom-out');"
			>
				<picture>
					<source
						media="(max-width: 640px)"
						type="image/webp"
						srcSet="/img/banners/banner_3_640.webp"
						width="640"
						height="426"
					/>
					<source
						media="(max-width: 640px)"
						srcSet="/img/banners/banner_3_640.jpeg"
						width="640"
						height="426"
					/>
					<source
						media="(max-width: 768px)"
						type="image/webp"
						srcSet="/img/banners/banner_3_768.webp"
						width="768"
						height="511"
					/>
					<source
						media="(max-width: 768px)"
						srcSet="/img/banners/banner_3_768.jpeg"
						width="768"
						height="511"
					/>
					<source
						media="(max-width: 1024px)"
						type="image/webp"
						srcSet="/img/banners/banner_3_1024.webp"
						width="1024"
						height="681"
					/>
					<source
						media="(max-width: 1024px)"
						srcSet="/img/banners/banner_3_1024.jpeg"
						width="1024"
						height="681"
					/>
					<source
						media="(max-width: 1280px)"
						type="image/webp"
						srcSet="/img/banners/banner_3_1280.webp"
						width="1280"
						height="852"
					/>
					<source
						media="(max-width: 1280px)"
						srcSet="/img/banners/banner_3_1280.jpeg"
						width="1280"
						height="852"
					/>
					<source
						media="(max-width: 1536px)"
						type="image/webp"
						srcSet="/img/banners/banner_3_1536.webp"
						width="1536"
						height="1022"
					/>
					<source
						media="(max-width: 1536px)"
						srcSet="/img/banners/banner_3_1536.jpeg"
						width="1536"
						height="1022"
					/>
					<img
						class="h-full w-full object-cover object-center"
						src="/img/banners/banner_3.jpeg"
						width="1536"
						height="1022"
						loading="lazy"
						decoding="async"
						alt="Identity"
					/>
				</picture>
			</div>
			<div class="absolute inset-0 bg-black/60"></div>
			<div class="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-8 text-center">
				<div class="overflow-hidden">
					<h2
						class={`hero-title opacity-0 ${slideUp.value}`}
						x-intersect:leave="removeClass('slide-up')"
					>
						IDENTITY
					</h2>
				</div>
				<p
					class={`mx-auto mt-4 max-w-sm text-center text-lg text-white opacity-0 sm:text-2xl lg:max-w-xl ${slideUp.value}`}
					style="animation-delay: 400ms"
					x-intersect:leave="removeClass('slide-up')"
				>
					In the charming village of Saint-Emilion, named for an 8th-century monk whose following
					began wine production within the village, wine is still an important part of everyday
					life. Nestled on the slopes of this emerald region, with cobblestone streets, and
					charismatic cottages, we knew this village was the ideal place for our family to come and
					start working towards our dream of owning a vineyard in France.
				</p>
			</div>
		</section>
	);
});
