import { $, component$, Signal, Slot, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { LuMail, LuPhone } from '@qwikest/icons/lucide';

interface GeneralInputProps {
	label: string;
	type?: 'email' | 'text' | 'tel';
	fieldValue: Signal<string>;
	completeSignal?: Signal<boolean>;
	extraClass?: string;
	required?: boolean;
	inputProps?: Pick<JSX.IntrinsicElements['input'], 'placeholder' | 'autoComplete' | 'pattern'>;
	// other custom props...
}

export default component$(
	({
		label,
		type,
		fieldValue,
		completeSignal,
		extraClass,
		required = true,
		inputProps,
	}: GeneralInputProps) => {
		// Note the default pattern checks for non-empty input
		// const isValid = useSignal<boolean>(!required || fieldValue.value.length > 0);
		const invalidateMessage = useSignal<string>('');

		useVisibleTask$(({ track }) => {
			track(() => fieldValue.value);
			if (document.getElementById(`input-${label}`)) {
				const inputEl = document.getElementById(`input-${label}`) as HTMLInputElement;
				invalidateMessage.value = inputEl.validationMessage;
				if (completeSignal) {
					completeSignal.value = inputEl.checkValidity();
				}
			}
		});

		return (
			<fieldset class={`fieldset ${extraClass ?? ''}`}>
				<legend class="fieldset-legend">{label}</legend>
				<label class={`input validator ${required && 'input-primary'}`}>
					{type === 'email' && <LuMail class="w-5 h-5 opacity-50" />}
					{type === 'tel' && <LuPhone class="w-5 h-5 opacity-50" />}
					<Slot name="icon" />
					<input
						id={`input-${label}`}
						type={type}
						required={required}
						value={fieldValue.value}
						onInput$={$((_, el) => {
							fieldValue.value = el.value;
						})}
						{...inputProps}
					/>
					{!required && <span class="badge badge-neutral badge-xs">{$localize`Optional`}</span>}
					<Slot name="after-input" />
				</label>

				<p class={`validator-hint hidden`}>{invalidateMessage.value}</p>
			</fieldset>
		);
	}
);
