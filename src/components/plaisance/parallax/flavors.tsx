import { component$, useSignal, useVisibleTask$, type Signal } from '@builder.io/qwik';

interface Props {
	activeSection: Signal<string>;
}

export default component$(({ activeSection }: Props) => {
	const slideUp = useSignal('');
	useVisibleTask$(() => {
		activeSection.value = 'flavors';
		if (activeSection.value === 'flavors') {
			slideUp.value = 'slide-up';
		} else {
			slideUp.value = '';
		}
	});
	return (
		<section id="flavors" class="relative h-screen w-screen max-w-[100vw] overflow-hidden bg-black">
			<div
				class="banner-bg absolute inset-0 scale-125 overflow-hidden bg-cover bg-fixed bg-center bg-no-repeat"
				x-intersect:enter="addClass('zoom-out')"
				x-intersect:leave="removeClass('zoom-out')"
			>
				<picture>
					<source
						media="(max-width: 640px)"
						type="image/webp"
						srcSet="/img/banners/banner_4_640.webp"
						width="640"
						height="426"
					/>
					<source
						media="(max-width: 640px)"
						srcSet="/img/banners/banner_4_640.jpeg"
						width="640"
						height="426"
					/>
					<source
						media="(max-width: 768px)"
						type="image/webp"
						srcSet="/img/banners/banner_4_768.webp"
						width="768"
						height="511"
					/>
					<source
						media="(max-width: 768px)"
						srcSet="/img/banners/banner_4_768.jpeg"
						width="768"
						height="511"
					/>
					<source
						media="(max-width: 1024px)"
						type="image/webp"
						srcSet="/img/banners/banner_4_1024.webp"
						width="1024"
						height="681"
					/>
					<source
						media="(max-width: 1024px)"
						srcSet="/img/banners/banner_4_1024.jpeg"
						width="1024"
						height="681"
					/>
					<source
						media="(max-width: 1280px)"
						type="image/webp"
						srcSet="/img/banners/banner_4_1280.webp"
						width="1280"
						height="852"
					/>
					<source
						media="(max-width: 1280px)"
						srcSet="/img/banners/banner_4_1280.jpeg"
						width="1280"
						height="852"
					/>
					<source
						media="(max-width: 1536px)"
						type="image/webp"
						srcSet="/img/banners/banner_4_1536.webp"
						width="1536"
						height="1022"
					/>
					<source
						media="(max-width: 1536px)"
						srcSet="/img/banners/banner_4_1536.jpeg"
						width="1536"
						height="1022"
					/>
					<img
						class="h-full w-full object-cover object-center"
						src="/img/banners/banner_4.jpeg"
						width="2000"
						height="1331"
						loading="lazy"
						decoding="async"
						alt="Flavors"
					/>
				</picture>
			</div>
			<div class="absolute inset-0 bg-black/60"></div>
			<div class="over absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-8 text-center">
				<div class="overflow-hidden">
					<h2
						class={`hero-title opacity-0 ${slideUp.value}`}
						x-intersect:leave="removeClass('slide-up');"
					>
						EXPERIENCE
					</h2>
				</div>
				<p
					class={`mx-auto mt-4 max-w-sm text-center text-lg text-white opacity-0 sm:text-2xl lg:max-w-xl ${slideUp.value}`}
					style="animation-delay: 400ms"
					x-intersect:leave="removeClass('slide-up')"
				>
					Sixty-eight years of Bordeaux wine history live within our vines at Château Plaisance.
					They give us the rich Merlots, sophisticated Cabernet Sauvignons and the powerful Cabernet
					Francs that enrich every bottle of Gran Cru we craft. Each one is the result of dedication
					to and respect for the land. Through our careful winemaking process, we express our love
					for the rolling hills and unique culture of our chosen home. Try our wines, visit our
					estate, and discover more.
				</p>
			</div>
		</section>
	);
});
