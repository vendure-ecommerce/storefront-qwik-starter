import { component$ } from '@builder.io/qwik';
import XCircleIcon from '../icons/XCircleIcon';

export default component$<{ message: string }>(({ message }) => {
	return (
		<div className="rounded-md bg-red-50 p-4">
			<div className="flex">
				<div className="flex-shrink-0">
					<XCircleIcon />
				</div>
				<div className="ml-3">
					<h3 className="text-sm font-medium text-red-800">{message}</h3>
				</div>
			</div>
		</div>
	);
});
