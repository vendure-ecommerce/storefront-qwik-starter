import { component$ } from '@builder.io/qwik';
import { LuXCircle } from '@qwikest/icons/lucide';

interface IProps {
	message: string;
	onClose$?: () => void;
}

export default component$<IProps>(({ message, onClose$ }: IProps) => {
	return (
		<div role="alert" class="alert alert-error flex" onClick$={onClose$}>
			<LuXCircle class="w-6 h-6" />
			<span>{message}</span>
		</div>
	);
});
