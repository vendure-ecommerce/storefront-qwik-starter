import { $, component$, useSignal } from '@qwik.dev/core';
import { LuX } from '@qwikest/icons/lucide';

interface ReviewAsset {
	id: string;
	preview: string;
}

interface ImageGalleryProps {
	assets: ReviewAsset[];
}

export default component$<ImageGalleryProps>(({ assets }) => {
	const selectedImageIndex = useSignal<number | null>(null);
	const selectedImage = useSignal<ReviewAsset | null>(null);

	const openImage = $((index: number) => {
		selectedImageIndex.value = index;
		selectedImage.value = assets[index];
	});

	const closeImage = $(() => {
		selectedImageIndex.value = null;
		selectedImage.value = null;
	});

	const nextImage = $(() => {
		if (selectedImageIndex.value !== null && selectedImageIndex.value < assets.length - 1) {
			selectedImageIndex.value++;
			selectedImage.value = assets[selectedImageIndex.value];
		}
	});

	const prevImage = $(() => {
		if (selectedImageIndex.value !== null && selectedImageIndex.value > 0) {
			selectedImageIndex.value--;
			selectedImage.value = assets[selectedImageIndex.value];
		}
	});

	return (
		<>
			{/* Thumbnail Gallery */}
			<div class="flex space-x-2 mt-2">
				{assets.map((asset, index) => (
					<button
						key={asset.id}
						onClick$={() => openImage(index)}
						class="cursor-pointer hover:opacity-80 transition"
						aria-label="Open image gallery"
					>
						<img
							src={asset.preview}
							alt="Review image"
							class="w-20 h-20 object-cover rounded border hover:border-blue-500"
						/>
					</button>
				))}
			</div>

			{/* Modal - Enlarged Image */}
			{selectedImage.value && (
				<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
					<div
						class="bg-white rounded-lg max-w-4xl min-w-96 relative"
						onClick$={(e) => e.stopPropagation()}
					>
						{/* Close Button */}
						<button
							onClick$={closeImage}
							class="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 z-10"
							aria-label="Close image"
						>
							<LuX class="w-6 h-6" />
						</button>

						{/* Main Image */}
						<div class="flex items-center justify-center bg-gray-100 p-4">
							<img
								src={selectedImage.value.preview}
								alt="Enlarged review image"
								class="max-h-96 max-w-full object-contain"
							/>
						</div>

						{/* Navigation and Info */}
						<div class="p-4 flex items-center justify-between">
							{/* Previous Button */}
							<button
								onClick$={prevImage}
								disabled={selectedImageIndex.value === 0}
								class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
								aria-label="Previous image"
							>
								← Previous
							</button>

							{/* Counter */}
							<span class="text-sm text-gray-600">
								{(selectedImageIndex.value ?? 0) + 1} / {assets.length}
							</span>

							{/* Next Button */}
							<button
								onClick$={nextImage}
								disabled={selectedImageIndex.value === assets.length - 1}
								class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
								aria-label="Next image"
							>
								Next →
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
});
