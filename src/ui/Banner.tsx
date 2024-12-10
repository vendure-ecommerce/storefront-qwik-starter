import { component$, useSignal, useVisibleTask$, useOnWindow, $ } from '@builder.io/qwik';
import firstImage from './static/1.jpg';
import secondImage from './static/2.jpg';
import thirdImage from './static/3.jpg';
// import { Image } from 'qwik-image';//

const Carousel = component$(() => {
	const currentSlide = useSignal(0);
	const slides = [
		{ id: 1, imageUrl: firstImage },
		{ id: 2, imageUrl: secondImage },
		{ id: 3, imageUrl: thirdImage },
	];

	// Auto-advance slides
	useVisibleTask$(() => {
		const timer = setInterval(() => {
			currentSlide.value = (currentSlide.value + 1) % slides.length;
		}, 5000);

		return () => clearInterval(timer);
	});

	const goToSlide = $((index: number) => {
		currentSlide.value = index;
	});

	const nextSlide = $(() => {
		currentSlide.value = (currentSlide.value + 1) % slides.length;
	});

	const prevSlide = $(() => {
		currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
	});

	// Handle keyboard navigation
	useOnWindow(
		'keydown',
		$((event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft') {
				prevSlide();
			} else if (event.key === 'ArrowRight') {
				nextSlide();
			}
		})
	);

	return (
		<div class="px-2 sm:px-2 lg:px-2 py-1 w-full">
			<div class="relative max-w-[2000px] mx-auto rounded-xl overflow-hidden shadow-lg">
				{/* Main carousel container */}
				<div class="relative aspect-[16/7] sm:aspect-[16/6] md:aspect-[21/7] w-full">
					{slides.map((slide, index) => (
						<div
							key={slide.id}
							class={`absolute inset-0 transition-transform duration-500 ease-in-out`}
							style={{
								transform: `translateX(${(index - currentSlide.value) * 100}%)`,
							}}
						>
							<img
								src={slide.imageUrl}
								alt={`Banner ${index + 1}`}
								width="3840"
								height="1880"
								class="w-full h-full object-cover rounded-xl"
							/>
						</div>
					))}
				</div>

				{/* Navigation buttons */}
				<button
					onClick$={prevSlide}
					class="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-2 md:p-3 transition-all text-white"
					aria-label="Previous slide"
				>
					<svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				<button
					onClick$={nextSlide}
					class="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-2 md:p-3 transition-all text-white"
					aria-label="Next slide"
				>
					<svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>

				{/* Dot indicators */}
				<div class="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
					{slides.map((_, index) => (
						<button
							key={index}
							onClick$={() => goToSlide(index)}
							class={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
								index === currentSlide.value ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
							}`}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
});

export default Carousel;
