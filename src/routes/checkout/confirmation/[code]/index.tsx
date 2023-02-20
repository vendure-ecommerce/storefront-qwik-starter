import { component$, PropFunction, useClientEffect$, useStore } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import CartContents from '~/components/cart-contents/CartContents';
import CartTotals from '~/components/cart-totals/CartTotals';
import CheckCircleIcon from '~/components/icons/CheckCircleIcon';
import ChevronRightIcon from '~/components/icons/ChevronRightIcon';
import { getOrderByCodeQuery } from '~/graphql/queries';
import { ActiveOrder } from '~/types';
import { execute } from '~/utils/api';

type Step = 'SHIPPING' | 'PAYMENT' | 'CONFIRMATION';

export default component$<{ onForward$: PropFunction<() => void> }>(() => {
	const {
		params: { code },
	} = useLocation();
	const store = useStore<{ order?: ActiveOrder }>({});

	const steps: { name: string; state: Step }[] = [
		{ name: 'Shipping', state: 'SHIPPING' },
		{ name: 'Payment', state: 'PAYMENT' },
		{ name: 'Confirmation', state: 'CONFIRMATION' },
	];

	useClientEffect$(async () => {
		const { orderByCode } = await execute<{ orderByCode: ActiveOrder }>(
			getOrderByCodeQuery({ code })
		);
		store.order = orderByCode;
	});

	return (
		<div>
			{store.order?.id && (
				<div class="bg-gray-50">
					<div class="lg:max-w-3xl mx-auto max-w-2xl mx-auto pt-8 pb-24 px-4 sm:px-6 lg:px-8">
						<h2 class="sr-only">Checkout</h2>
						<nav class="hidden sm:block pb-8 mb-8 border-b">
							<ol class="flex space-x-4 justify-center">
								{steps.map((step, index) => (
									<li key={step.name} class="flex items-center">
										<span class={`${step.state === 'CONFIRMATION' ? 'text-primary-600' : ''}`}>
											{step.name}
										</span>
										{index !== steps.length - 1 ? <ChevronRightIcon /> : null}
									</li>
								))}
							</ol>
						</nav>
						<div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
							<div class="lg:col-span-2">
								<div>
									<h2 class="text-3xl flex items-center space-x-2 sm:text-5xl font-light tracking-tight text-gray-900 my-8">
										<CheckCircleIcon forcedClass="text-green-600 w-8 h-8 sm:w-12 sm:h-12" />
										<span>Order Summary</span>
									</h2>
									<p class="text-lg text-gray-700">
										Your order <span class="font-bold">{store.order?.code}</span> has been received!
									</p>
									<div class="mt-12">
										<div class="mb-6">
											<CartContents order={store.order} />
										</div>
										<CartTotals />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
});
