import { component$, useSignal, useVisibleTask$, type Signal } from '@builder.io/qwik';

interface Props {
	activeSection: Signal<string>;
}

export default component$(({ activeSection }: Props) => {
	const winIsAMixtureSection = useSignal<Element>();
	const slideUp = useSignal('');
	useVisibleTask$(() => {
		activeSection.value = 'winIsAMixture';
		if (activeSection.value === 'winIsAMixture') {
			slideUp.value = 'slide-up';
		} else {
			slideUp.value = '';
		}
	});

	return (
		<section
			ref={winIsAMixtureSection}
			id="winIsAMixture"
			class="relative h-screen w-screen max-w-[100vw] overflow-hidden bg-black"
		>
			<div
				class="banner-bg absolute inset-0 h-screen scale-125"
				x-intersect:enter="addClass('zoom-out');"
				x-intersect:leave="removeClass('zoom-out');"
			>
				<picture>
					<source
						media="(max-width: 640px)"
						type="image/webp"
						srcSet="/img/banners/banner_1_640.webp"
						width="640"
						height="426"
					/>
					<source
						media="(max-width: 640px)"
						srcSet="/img/banners/banner_1_640.jpeg"
						width="640"
						height="426"
					/>
					<source
						media="(max-width: 768px)"
						type="image/webp"
						srcSet="/img/banners/banner_1_768.webp"
						width="768"
						height="511"
					/>
					<source
						media="(max-width: 768px)"
						srcSet="/img/banners/banner_1_768.jpeg"
						width="768"
						height="511"
					/>
					<source
						media="(max-width: 1024px)"
						type="image/webp"
						srcSet="/img/banners/banner_1_1024.webp"
						width="1024"
						height="681"
					/>
					<source
						media="(max-width: 1024px)"
						srcSet="/img/banners/banner_1_1024.jpeg"
						width="1024"
						height="681"
					/>
					<source
						media="(max-width: 1280px)"
						type="image/webp"
						srcSet="/img/banners/banner_1_1280.webp"
						width="1280"
						height="852"
					/>
					<source
						media="(max-width: 1280px)"
						srcSet="/img/banners/banner_1_1280.jpeg"
						width="1280"
						height="852"
					/>
					<source
						media="(max-width: 1536px)"
						type="image/webp"
						srcSet="/img/banners/banner_1_1536.webp"
						width="1536"
						height="1022"
					/>
					<source
						media="(max-width: 1536px)"
						srcSet="/img/banners/banner_1_1536.jpeg"
						width="1536"
						height="1022"
					/>
					<img
						class="h-full w-full object-cover object-center"
						src="/img/banners/banner_1.jpeg"
						width="2000"
						height="1331"
					/>
				</picture>
			</div>
			<div class="absolute inset-0 bg-black/60"></div>
			<div class="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-8">
				<div class="overflow-hidden">
					<h2
						class={`hero-title opacity-0 ${slideUp.value}`}
						style="animation-delay: 200ms"
						// x-intersect:leave="removeClass('slide-up')"
					>
						WINE IS A MIXTURE
					</h2>
				</div>
				<div class="mt-4 overflow-hidden">
					<h2
						class={`hero-title opacity-0 delay-200 ${slideUp.value}`}
						style="animation-delay: 400ms"
						x-intersect:leave="removeClass('slide-up')"
					>
						OF HUMOR AND LIGHT.
					</h2>
				</div>
			</div>
		</section>
	);
});
