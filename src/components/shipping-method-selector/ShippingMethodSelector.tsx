import { component$, useStore } from '@builder.io/qwik';
import CheckCircleIcon from '../icons/CheckCircleIcon';

export default component$(() => {
	const state = useStore<{ selected: number }>({
		selected: 0,
	});
	const methods = [
		{ label: 'Standard Shipping', price: '$5.00' },
		{ label: 'Express Shipping', price: '$10.00' },
	];
	return (
		<div>
			<label class="text-lg font-medium text-gray-900">Delivery method</label>
			<div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
				{methods.map((method, index) => (
					<div
						className={`relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none`}
						onClick$={() => (state.selected = index)}
					>
						<span class="flex-1 flex">
							<span class="flex flex-col">
								<span class="block text-sm font-medium text-gray-900">{method.label}</span>
								<span class="mt-6 text-sm font-medium text-gray-900">{method.price}</span>
							</span>
						</span>
						{state.selected === index && <CheckCircleIcon />}
						<span
							className={`border-2 ${
								state.selected === index ? 'border-primary-500' : ''
							} absolute -inset-px rounded-lg pointer-events-none`}
						></span>
					</div>
				))}
			</div>
		</div>
	);
});
