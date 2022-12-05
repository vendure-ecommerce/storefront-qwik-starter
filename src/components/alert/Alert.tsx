import { component$ } from '@builder.io/qwik';
import XCircleIcon from '../icons/XCircleIcon';

export default component$<{ message: string }>(({ message }) => {
	return (
		<div class="rounded-md bg-red-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<XCircleIcon />
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">{message}</h3>
				</div>
			</div>
		</div>
	);
});
