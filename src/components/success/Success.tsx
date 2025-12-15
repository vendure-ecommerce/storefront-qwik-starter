import { component$ } from '@builder.io/qwik';
import CheckCircleIcon from '../icons/CheckCircleIcon';

export default component$<{ message: string }>(({ message }) => {
	return (
		<div class="rounded-md bg-green-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<CheckCircleIcon />
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium ">{message}</h3>
				</div>
			</div>
		</div>
	);
});
