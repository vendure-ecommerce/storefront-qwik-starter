import { component$ } from '@qwik.dev/core';
import { useNavigate } from '@qwik.dev/router';
import { Image } from 'qwik-image';
import { HighlightedButton } from '~/components/buttons/HighlightedButton';
import { Order } from '~/generated/graphql';
import { formatPrice } from '~/utils';

const MAX_IMAGE_SHOWN = 2;

type IProps = {
	order: Order;
};

export default component$<IProps>(({ order }) => {
	const navigate = useNavigate();

	const images = order.lines.map((line) => line.featuredAsset?.preview).filter(Boolean);
	const shownImages = images.slice(0, MAX_IMAGE_SHOWN);
	const moreCount = images.length - shownImages.length;

	return (
		<div class="container mx-auto p-9 bg-white max-w-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 text-center">
			<div
				class="flex justify-center mb-2 relative overflow-hidden"
				style={{ height: '100px', width: '120px' }}
			>
				{shownImages.map((src, idx) => (
					<Image
						key={idx}
						layout="fixed"
						width="100"
						height="100"
						aspectRatio={1}
						class={`absolute ${idx === 0 ? '' : 'left-8'} w-[100px] h-[100px] object-center object-cover rounded-lg border-2 border-white shadow`}
						src={src}
						alt={order.lines[idx]?.productVariant?.name}
					/>
				))}
				{moreCount > 0 && (
					<span class="absolute bottom-0 right-0 text-xs text-gray-500 bg-white bg-opacity-80 px-2 py-1 rounded">
						... and {moreCount} more
					</span>
				)}
			</div>
			<div class="items-center">
				<div>
					<h1 class="mt-5 text-sm">
						<span class="ml-2 text-xl font-semibold">{formatOrderDate(order?.createdAt)}</span>
					</h1>
					<span class="bg-teal-200 text-teal-800 text-xs px-2 py-2 mt-2 inline-block rounded-full  uppercase font-semibold tracking-wide">
						{order.state}
					</span>
					<p class="my-2">{formatPrice(order?.totalWithTax, order?.currencyCode || 'USD')}</p>
				</div>
			</div>
			<div>
				<HighlightedButton
					extraClass="m-auto"
					onClick$={() => {
						navigate(`/account/purchase-history/${order?.code}`);
					}}
				>
					Go to detail
				</HighlightedButton>
			</div>
		</div>
	);
});

function formatOrderDate(dateStr?: string) {
	if (!dateStr) return '';
	const date = new Date(dateStr);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}
