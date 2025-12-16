import type { Signal } from '@builder.io/qwik';
import { $, component$, useSignal } from '@builder.io/qwik';
import { LuXCircle } from '@qwikest/icons/lucide';

interface GeneralInputProps {
	label: string;
	type: 'email' | 'text';
	fieldValue: Signal<string>;
	completeSignal?: Signal<boolean>; // external signal to indicate if the email is valid
	pattern?: RegExp; // optional pattern for validation
	placeholder?: string;
	extraClass?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default component$(
	({
		label,
		type,
		fieldValue,
		completeSignal,
		pattern,
		placeholder,
		extraClass,
	}: GeneralInputProps) => {
		// Note the default pattern checks for non-empty input
		const isValid = useSignal(false);
		const invalidateMessage = useSignal('*required');
		let patternFinal = pattern;
		let placeholderFinal = placeholder;
		if (type === 'email') {
			patternFinal = pattern || emailRegex;
			placeholderFinal = placeholder || 'your@email.com';
		} else {
			patternFinal = pattern || /.+/; // basic non-empty pattern
		}

		const validate = $((regexPattern: RegExp) => {
			if (fieldValue.value.length === 0) {
				isValid.value = false;
				invalidateMessage.value = '*required';
			} else if (!regexPattern.test(fieldValue.value)) {
				isValid.value = false;
				invalidateMessage.value = `invalid ${label} format`;
			} else {
				isValid.value = true;
				invalidateMessage.value = '';
			}
			if (completeSignal) {
				completeSignal.value = isValid.value;
			}
		});

		return (
			<fieldset class="fieldset">
				<label class="label">{label}</label>
				<input
					class={`input ${extraClass ?? ''}  
          ${fieldValue.value.length < 1 ? '' : isValid.value ? 'input-success' : 'input-error'}`}
					type={type}
					required
					placeholder={placeholderFinal}
					value={fieldValue.value}
					onInput$={$((_, el) => {
						fieldValue.value = el.value;
						validate(patternFinal); // basic non-empty validation for text
					})}
				/>
				{!isValid.value && (
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
	}
);
