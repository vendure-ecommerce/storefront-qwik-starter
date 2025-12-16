import { component$ } from '@builder.io/qwik';
import { LuLink } from '@qwikest/icons/lucide';
import { Order } from '~/generated/graphql';
import { formatDateTime } from '~/utils';

interface Props {
	order: Order;
}

export default component$<Props>(({ order }) => {
	return (
		<>
			<>
				<div class="flex flex-col gap-y-2">
					<div class="flex items-center gap-x-2">
						{$localize`Order number:`}
						<span class="font-semibold">{order?.code}</span>
					</div>
					<div class="flex items-center gap-x-2">
						{$localize`Placed on:`}
						<span class="font-semibold">{formatDateTime(order?.createdAt)}</span>
					</div>

					<div class="flex items-center gap-x-2">
						{$localize`Status:`}
						{/* order state can be Pending, Shipped, Delivered */}
						<div
							class={`badge 
							${order?.state === 'Pending' ? 'badge-secondary' : ''}
							${order?.state === 'Shipped' ? 'badge-info' : ''}
							${order?.state === 'Delivered' ? 'badge-success' : ''}
							${order?.state === 'Cancelled' ? 'badge-error' : ''}
							${order?.state === 'Returned' ? 'badge-warning' : ''}
							`}
						>
							{order?.state}
						</div>
					</div>

					<div class="flex items-center gap-x-2">
						{$localize`Tracking URL:`}
						{order?.fulfillments && order.fulfillments.length > 0 ? (
							<div class="pl-5 flex flex-col">
								{order.fulfillments.map((fulfillment, idx) => {
									const url = fulfillment?.customFields?.trackingUrl;
									return url ? (
										<a
											key={fulfillment?.id ?? idx}
											href={url}
											target="_blank"
											rel="noopener noreferrer"
											class="link"
											aria-label={$localize`Open tracking URL in new tab`}
											title={url}
										>
											<LuLink class="w-4 h-4" />
										</a>
									) : (
										<span key={fulfillment?.id ?? idx} class="font-semibold">
											{$localize`Not provided`}
										</span>
									);
								})}
							</div>
						) : (
							<span class="font-semibold">{$localize`Not yet provided`}</span>
						)}
					</div>
				</div>
			</>
		</>
	);
});
