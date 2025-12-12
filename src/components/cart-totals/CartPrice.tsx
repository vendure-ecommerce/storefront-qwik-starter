import { component$ } from '@builder.io/qwik';
import { Order } from '~/generated/graphql';
import type { OrderPriceFields } from '~/types';
import { formatPrice } from '~/utils';

type Props = {
	field: OrderPriceFields;
	forcedClass?: string;
	order?: Order;
};

export default component$<Props>(({ field, forcedClass, order }) => {
	const currencyCode = order?.currencyCode || 'USD';
	const priceWithTax = order?.[field] || 0;
	return <div class={forcedClass}>{formatPrice(priceWithTax, currencyCode)}</div>;
});
