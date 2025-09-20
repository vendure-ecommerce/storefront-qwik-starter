import { _ } from 'compiled-i18n';
import { $, component$, useContext, useSignal } from '@qwik.dev/core';
import { APP_STATE } from '~/constants';
import { Order } from '~/generated/graphql';
import { applyCouponCodeMutation } from '~/providers/shop/orders/order';
import Alert from '../alert/Alert';
import Success from '../success/Success';

export default component$(() => {
	const appState = useContext(APP_STATE);
	const couponCodeSignal = useSignal('');
	const errorSignal = useSignal('');
	const successSignal = useSignal('');

	const applyCoupon = $(async () => {
		if (couponCodeSignal.value) {
			successSignal.value = '';
			errorSignal.value = '';
			const res = await applyCouponCodeMutation(couponCodeSignal.value);
			if (res.__typename == 'Order') {
				appState.activeOrder = res as Order;
				successSignal.value = _`Coupon code successfully applied`;
				couponCodeSignal.value = '';
			} else {
				errorSignal.value = res.message;
			}
		}
	});

	return (
		<>
			{!!errorSignal.value && <Alert message={errorSignal.value} />}
			{!!successSignal.value && <Success message={successSignal.value} />}
			<div class="w-full py-2 mb-4">
				<form preventdefault:submit onSubmit$={() => applyCoupon()}>
					<div class="flex gap-2">
						<input
							type="text"
							placeholder={_`Enter a coupon code`}
							value={couponCodeSignal.value}
							onInput$={(_, el) => (couponCodeSignal.value = el.value)}
							class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							required
						/>
						<button class="btn-primary max-w-24">{_`Apply`}</button>
					</div>
				</form>
			</div>
		</>
	);
});
