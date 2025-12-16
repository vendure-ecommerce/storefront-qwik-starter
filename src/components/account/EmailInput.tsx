import type { Signal } from '@builder.io/qwik';
import { $, component$, useSignal } from '@builder.io/qwik';
import { LuXCircle } from '@qwikest/icons/lucide';

interface EmailInputProps {
	fieldValue: Signal<string>;
	completeSignal: Signal<boolean>; // external signal to indicate if the email is valid
}

export const EmailInput = component$(({ fieldValue, completeSignal }: EmailInputProps) => {
	const isValid = useSignal(false);
	const invalidateMessage = useSignal('*required');

	const validateEmail = $(() => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (fieldValue.value.length === 0) {
			isValid.value = false;
			invalidateMessage.value = '*required';
		} else if (!emailRegex.test(fieldValue.value)) {
			isValid.value = false;
			invalidateMessage.value = 'invalid email format';
		} else {
			isValid.value = true;
			invalidateMessage.value = '';
		}
		completeSignal.value = isValid.value;
	});

	return (
		<fieldset class="fieldset">
			<label class="label">{$localize`Email`}</label>
			<input
				class={`input
          ${fieldValue.value.length < 1 ? '' : isValid.value ? 'input-success' : 'input-error'}`}
				type="email"
				required
				placeholder="your@email.com"
				value={fieldValue.value}
				onInput$={$((_, el) => {
					fieldValue.value = el.value;
					validateEmail();
				})}
			/>
			{fieldValue.value.length > 0 && !isValid.value && (
				// <div class="text-error">{invalidateMessage.value}</div>
				<div role="alert" class="alert alert-error alert-soft">
					<span class="flex items-center gap-2 text-xs">
						<LuXCircle />
						{invalidateMessage.value}
					</span>
				</div>
			)}
		</fieldset>
	);
});
