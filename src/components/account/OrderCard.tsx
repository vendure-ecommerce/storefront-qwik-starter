import { component$ } from '@builder.io/qwik';
import { ActiveOrder } from '~/types';
import { formatPrice } from '~/utils';

type IProps = {
	order: ActiveOrder;
};

export default component$<IProps>(({ order }) => {
	return (
		<div class="bg-white p-4 rounded-lg shadow-lg max-w-xs">
			<div class="pt-2 text-gray-600 text-sm">Order code</div>
			<h4 class="my-2 text-xl font-semibold uppercase leading-tight truncate">{order?.code}</h4>
			<span class="bg-teal-200 text-teal-800 text-xs px-2 inline-block rounded-full  uppercase font-semibold tracking-wide">
				PaymentSettled
			</span>
			<div class="mt-4 text-xl">
				{formatPrice(order?.totalWithTax, order?.currencyCode || 'USD')}
			</div>
			<a
				href={'/account/orders/' + order?.code}
				class="mt-4 max-w-xs flex-1 bg-primary-600 hover:bg-primary-700 transition-colors border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500 sm:w-full"
			>
				Go to detail
			</a>
		</div>
	);
});
