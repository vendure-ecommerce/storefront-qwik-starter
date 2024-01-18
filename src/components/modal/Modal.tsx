import { QRL, Slot, component$ } from '@builder.io/qwik';
import { Button } from '../buttons/Button';
import { HighlightedButton } from '../buttons/HighlightedButton';
import CheckIcon from '../icons/CheckIcon';
import XMarkIcon from '../icons/XMarkIcon';

interface IProps {
	title: string;
	open: boolean;
	iconBackground?: string;
	onSubmit$?: QRL<() => void>;
	onCancel$?: QRL<() => void>;
}

export const Modal = component$(({ title, open, iconBackground, onSubmit$, onCancel$ }: IProps) => {
	return (
		<div
			class={`relative z-[100] ${open ? '' : 'hidden'}`}
			aria-labelledby="modal-title"
			role="dialog"
			aria-modal="true"
		>
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75"></div>

			<div class="fixed z-10 inset-0 overflow-y-auto">
				<div class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
					<div class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:max-w-lg sm:w-full">
						<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
							<div class="sm:flex sm:items-start">
								<div
									class={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
										iconBackground ? iconBackground : 'bg-white'
									} sm:mx-0 sm:h-10 sm:w-10`}
								>
									{<Slot name="modalIcon" />}
								</div>
								<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<h3 class="text-xl leading-6 font-medium text-gray-900" id="modal-title">
										{title}
									</h3>
									<div class="mt-2">
										<div class="text-base text-gray-500">{<Slot name="modalContent" />}</div>
									</div>
								</div>
							</div>
						</div>
						<div class="sm:bg-gray-100 px-4 pb-3 sm:pt-3 sm:px-6 sm:flex sm:flex-row-reverse sm:gap-x-4 space-y-2 sm:space-y-0">
							{onCancel$ && (
								<Button onClick$={onCancel$}>
									<XMarkIcon /> Cancel
								</Button>
							)}

							{onSubmit$ && (
								<HighlightedButton onClick$={onSubmit$}>
									<CheckIcon /> Submit
								</HighlightedButton>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
