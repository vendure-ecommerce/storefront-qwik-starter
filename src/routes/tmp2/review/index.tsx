import { component$, useSignal } from '@builder.io/qwik';
import WriteReview from '~/components/products/WriteReview';

export default component$(() => {
	const openSignal = useSignal(false);

	return (
		<div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
			<button
				class="bg-primary-600 text-white px-4 py-2 rounded"
				onClick$={() => (openSignal.value = true)}
			>
				Write a Review
			</button>
			<WriteReview
				open={openSignal}
				basicInfo={{ productVariantId: '1' }}
				productInfo={{ variantName: 'vv', productName: 'vv', preview: 'aa' }}
			/>
		</div>
	);
});
