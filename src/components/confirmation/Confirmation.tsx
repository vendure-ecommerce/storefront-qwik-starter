import { component$, mutable, PropFunction, useContext } from '@builder.io/qwik';
import { APP_STATE } from '~/constants';
import CartContents from '../cart-contents/CartContents';
import CartTotals from '../cart-totals/CartTotals';
import CheckCircleIcon from '../icons/CheckCircleIcon';

export default component$<{ onForward$: PropFunction<() => void> }>(({ onForward$ }) => {
	const appState = useContext(APP_STATE);
	const currencyCode = appState.activeOrder?.currencyCode || 'USD';
	const editable = !location.pathname.startsWith('/checkout');
	return (
		<div>
			<h2 className="text-3xl flex items-center space-x-2 sm:text-5xl font-light tracking-tight text-gray-900 my-8">
				<CheckCircleIcon forcedClassName="text-green-600 w-8 h-8 sm:w-12 sm:h-12" />
				<span>Order Summary</span>
			</h2>
			<p className="text-lg text-gray-700">
				Your order <span className="font-bold">{appState.activeOrder.code}</span> has been received!
			</p>
			<div className="mt-12">
				<div className="mb-6">
					<CartContents
						rows={mutable(appState.activeOrder?.lines ?? [])}
						currencyCode={mutable(currencyCode!)}
						editable={mutable(editable)}
					/>
				</div>
				<CartTotals order={mutable(appState.activeOrder)}></CartTotals>
			</div>
		</div>
	);
});
