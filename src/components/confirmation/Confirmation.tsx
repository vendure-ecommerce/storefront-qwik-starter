import { component$, PropFunction, useContext } from '@builder.io/qwik';
import { APP_STATE } from '~/constants';
import CartContents from '../cart-contents/CartContents';
import CartTotals from '../cart-totals/CartTotals';
import CheckCircleIcon from '../icons/CheckCircleIcon';

export default component$<{ onForward$: PropFunction<() => void> }>(() => {
	const appState = useContext(APP_STATE);
	const currencyCode = appState.activeOrder?.currencyCode || 'USD';
	return (
		<div>
			<h2 class="text-3xl flex items-center space-x-2 sm:text-5xl font-light tracking-tight text-gray-900 my-8">
				<CheckCircleIcon forcedClass="text-green-600 w-8 h-8 sm:w-12 sm:h-12" />
				<span>Order Summary</span>
			</h2>
			<p class="text-lg text-gray-700">
				Your order <span class="font-bold">{appState.activeOrder.code}</span> has been received!
			</p>
			<div class="mt-12">
				<div class="mb-6">
					<CartContents currencyCode={currencyCode} />
				</div>
				<CartTotals />
			</div>
		</div>
	);
});
