import { component$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import ImageTiles from '~/components/common/ImageTiles';
import { Order } from '~/generated/graphql';
import { formatPrice } from '~/utils';

const MAX_IMAGE_SHOWN = 3;

type IProps = {
	order: Pick<
		Order,
		'id' | 'code' | 'createdAt' | 'state' | 'totalWithTax' | 'currencyCode' | 'lines'
	>;
};

export default component$<IProps>(({ order }) => {
	const navigate = useNavigate();

	const images = order.lines
		.map((line) => line.featuredAsset?.preview)
		.filter((s): s is string => !!s); // note this filters out undefined, null etc.
	const shownImages = images.slice(0, MAX_IMAGE_SHOWN);
	const moreCount = images.length - shownImages.length;

	return (
		<div class="card lg:card-side bg-base-100 shadow-sm border">
			<div class="flex items-center justify-center p-4">
				<figure class="max-w-40">
					<ImageTiles
						previews={images}
						maxShown={MAX_IMAGE_SHOWN}
						size={100}
						altPrefix={order.code}
						class="w-40"
					/>
				</figure>
			</div>
			<div class="flex lg:w-75 md:w-60 sm:w-40">
				<div class="card-body">
					<h2 class="card-title">
						<span class="text-sm font-semibold">{formatOrderDate(order?.createdAt)}</span>
					</h2>
					<div class="badge badge-sm badge-primary badge-outline">{order.state}</div>
					<p>{formatPrice(order?.totalWithTax, order?.currencyCode || 'USD')}</p>
				</div>
				<div class="card-actions justify-center items-center mr-4">
					<button
						class="btn btn-primary btn-sm"
						onClick$={() => {
							navigate(`/account/purchase-history/${order?.code}`);
						}}
					>
						View Details
					</button>
				</div>
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
