import { component$, Signal, useContext } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import { LuX } from '@qwikest/icons/lucide';
import { APP_STATE } from '~/constants';
import { isCheckoutPage } from '~/utils';
import CartContents from '../cart-contents/CartContents';
import CartPrice from '../cart-totals/CartPrice';

interface IProps {
	cartDrawerToggle: Signal<boolean>;
}

export default component$(({ cartDrawerToggle }: IProps) => {
	const location = useLocation();
	const appState = useContext(APP_STATE);
	const isInEditableUrl = !isCheckoutPage(location.url.toString());
	const navigate = useNavigate();

	return (
		<>
			<div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
				<div class="flex items-start justify-between">
					<h2 class="text-lg font-medium ">{$localize`Shopping cart`}</h2>
					<div class="ml-3 h-7 flex items-center">
						<button
							type="button"
							class="-m-2 p-2 "
							onClick$={() => (cartDrawerToggle.value = true)}
						>
							<span class="sr-only">Close panel</span>
							<LuX class="h-6 w-6" />
						</button>
					</div>
				</div>
				<div class="mt-8">
					{!!appState.activeOrder && appState.activeOrder.totalQuantity ? (
						<CartContents cartDrawerToggle={cartDrawerToggle} />
					) : (
						<div class="flex items-center justify-center h-48 text-xl ">
							{$localize`Your cart is empty`}
						</div>
					)}
				</div>
			</div>
			{appState.activeOrder?.totalQuantity && isInEditableUrl && (
				<div class="py-6 px-4 sm:px-6">
					<div class="flex justify-between text-base font-medium">
						<p>{$localize`Subtotal`}</p>
						<p>
							<CartPrice field={'subTotalWithTax'} order={appState.activeOrder} />
						</p>
					</div>
					<p class="text-xs">{$localize`Shipping will be calculated at checkout.`}</p>

					<div class="mt-6">
						<button
							class="btn btn-accent btn-md"
							onClick$={() => {
								navigate('/checkout/');
								cartDrawerToggle.value = true;
							}}
						>
							{$localize`Checkout`}
						</button>
					</div>
				</div>
			)}
		</>
	);
});
