import { component$, Signal, Slot, useSignal } from '@builder.io/qwik';
import { DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { Image } from 'qwik-image';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs';
import TopReviewsV2 from '~/components/reviews/DisplayReviews';
import ReviewStats from '~/components/reviews/ReviewStats';
import { getProductBySlug } from '~/providers/shop/products/products';
import { cleanUpParams, generateDocumentHead, isEnvVariableEnabled } from '~/utils';

export const useProductLoader = routeLoader$(async ({ params }) => {
	const { slug } = cleanUpParams(params);
	const product = await getProductBySlug(slug);
	if (product.assets.length === 1) {
		product.assets.push({
			...product.assets[0],
			id: 'placeholder_2',
			name: 'placeholder',
			preview: '/asset_placeholder.webp',
		});
	}
	return product;
});

interface ProductVariantContextType {
	id: Signal<string>;
}

export default component$(() => {
	const productSignal = useProductLoader();
	const currentImageSig = useSignal(productSignal.value.assets[0]);

	return (
		<div>
			{/* {selectedVariantSignal.value?.id && (
				<span class="hidden">{selectedVariantSignal.value?.id}</span>
			)} */}
			<div class="max-w-6xl mx-auto px-4 py-10">
				<div>
					<h2 class="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
						{productSignal.value.name}
					</h2>
					<Breadcrumbs
						items={
							productSignal.value.collections[productSignal.value.collections.length - 1]
								?.breadcrumbs ?? []
						}
					></Breadcrumbs>
					<div class="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start mt-4 md:mt-12">
						<div class="w-full max-w-2xl mx-auto sm:block lg:max-w-none">
							<span class="rounded-md overflow-hidden">
								<div class="h-[400px] w-full md:w-[400px]">
									<Image
										layout="fixed"
										class="object-center object-cover rounded-lg mx-auto"
										width="400"
										height="400"
										src={currentImageSig.value.preview + '?w=400&h=400&format=webp'}
										alt={`Image of: ${currentImageSig.value.name}`}
									/>
								</div>
								{productSignal.value.assets.length > 1 && (
									<div class="w-full md:w-[400px] my-2 flex flex-wrap gap-3 justify-center">
										{productSignal.value.assets.map((asset, key) => (
											<Image
												key={key}
												layout="fixed"
												class={{
													'object-center object-cover rounded-lg': true,
													'border-b-8 border-primary-600': currentImageSig.value.id === asset.id,
												}}
												width="80"
												height="80"
												src={asset.preview + '?w=400&h=400&format=webp'}
												alt={`Image of: ${asset.name}`}
												onClick$={() => {
													currentImageSig.value = asset;
												}}
											/>
										))}
									</div>
								)}
							</span>
						</div>
						<div class="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
							<div class="">
								<h3 class="sr-only">Description</h3>
								<div
									class="text-base text-gray-700"
									dangerouslySetInnerHTML={productSignal.value.description}
								/>
							</div>

							<>
								<Slot />
							</>

							<section class="mt-12 pt-12 border-t text-xs">
								<h3 class="text-gray-600 font-bold mb-2">{$localize`Shipping & Returns`}</h3>
								<div class="text-gray-500 space-y-1">
									<p>
										{$localize`Standard shipping: 3 - 5 working days. Express shipping: 1 - 3 working days.`}
									</p>
									<p>
										{$localize`Shipping costs depend on delivery address and will be calculated during checkout.`}
									</p>
									<p>
										{$localize`Returns are subject to terms. Please see the`}{' '}
										<span class="underline">{$localize`returns page`}</span>{' '}
										{$localize`for further information`}.
									</p>
								</div>
							</section>
						</div>
					</div>
				</div>
			</div>
			{isEnvVariableEnabled('VITE_SHOW_REVIEWS') && (
				<div class="max-w-6xl mx-auto px-4 border-t pt-10">
					<div class="lg:grid lg:grid-cols-5 lg:gap-x-8">
						{/* ReviewStats - Small Left Column (1/5 width) */}
						<div class="lg:col-span-1">
							<ReviewStats
								reviewCount={productSignal.value.customFields.reviewCount}
								averageRating={productSignal.value.customFields.reviewRating}
								productId={productSignal.value.id}
							/>
						</div>

						{/* TopReviewsV2 - Right Column (4/5 width) */}
						<div class="lg:col-span-4 lg:mt-0">
							<TopReviewsV2 productId={productSignal.value.id} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
});

export const head: DocumentHead = ({ resolveValue, url }) => {
	const product = resolveValue(useProductLoader);
	return generateDocumentHead(
		url.href,
		product.name,
		product.description,
		product.featuredAsset?.preview
	);
};
