import { component$ } from '@builder.io/qwik';
import { Link } from '@qwik.dev/router';
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
						{$localize`Placed on`}
						<span class="font-semibold">{formatDateTime(order?.createdAt)}</span>
					</div>

					<div class="flex items-center gap-x-2">
						{$localize`Status:`}
						<span class="font-semibold bg-white border border-gray-300 rounded-lg px-2 py-1">
							{order?.state}
						</span>
					</div>

					<div class="flex items-center gap-x-2">
						{$localize`Tracking URL:`}
						{order?.fulfillments && order.fulfillments.length > 0 ? (
							<div class="pl-5 flex flex-col">
								{order.fulfillments.map((fulfillment, idx) => {
									const url = fulfillment?.customFields?.trackingUrl;
									return url ? (
										<Link
											key={fulfillment?.id ?? idx}
											href={url}
											target="_blank"
											rel="noopener noreferrer"
											class="underline"
										>
											{url}
										</Link>
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
