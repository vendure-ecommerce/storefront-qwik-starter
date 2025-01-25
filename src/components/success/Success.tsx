import { component$ } from '@qwik.dev/core';
import CheckCircleIcon from '../icons/CheckCircleIcon';

export default component$<{ message: string }>(({ message }) => {
	return (
		<div class="rounded-md bg-green-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<CheckCircleIcon />
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-gray-800">{message}</h3>
				</div>
			</div>
		</div>
	);
});
