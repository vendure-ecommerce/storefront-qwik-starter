import { component$, useContext } from '@builder.io/qwik';
import { APP_STATE } from '~/constants';
import type { OrderPriceFields } from '~/types';
import { formatPrice } from '~/utils';

export default component$((props: { field: OrderPriceFields; forcedClassName?: string }) => {
	const order = useContext(APP_STATE).activeOrder;
	const currencyCode = useContext(APP_STATE).activeOrder?.currencyCode || 'USD';
	const priceWithTax = order ? order[props.field] : 0;
	return <div class={props.forcedClassName}>{formatPrice(priceWithTax, currencyCode)}</div>;
});
