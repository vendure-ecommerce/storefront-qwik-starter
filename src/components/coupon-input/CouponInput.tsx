import { $, component$, useContext, useSignal } from '@builder.io/qwik';
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
				successSignal.value = $localize`Coupon code successfully applied`;
				couponCodeSignal.value = '';
			} else {
				errorSignal.value = res.message;
			}
		}
	});

	return (
		<>
			{!!errorSignal.value && (
				<Alert
					message={errorSignal.value}
					onClose$={() => {
						errorSignal.value = '';
						couponCodeSignal.value = '';
					}}
				/>
			)}
			{!!successSignal.value && <Success message={successSignal.value} />}
			<div class="w-full py-2 mb-4">
				<form preventdefault:submit onSubmit$={() => applyCoupon()}>
					<div class="flex gap-2">
						<input
							type="text"
							placeholder={$localize`Enter a coupon code`}
							value={couponCodeSignal.value}
							onInput$={(_, el) => (couponCodeSignal.value = el.value)}
							class="input"
							required
						/>
						<button type="submit" class="btn btn-primary">
							{$localize`Apply`}
						</button>
					</div>
				</form>
			</div>
		</>
	);
});
