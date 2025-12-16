import type { Signal } from '@builder.io/qwik';
import { $, component$, useSignal } from '@builder.io/qwik';
import { LuEye, LuEyeOff, LuXCircle } from '@qwikest/icons/lucide';
import { isStrongPassword } from '~/utils/ensure-strong-password';

interface PasswordInputProps {
	label: string;
	fieldValue: Signal<string>;
	completeSignal: Signal<boolean>; // external signal to indicate if the password is valid
	incompleteSignal?: Signal<boolean>; // external signal to indicate other fields are not valid (e.g. repeat password will set to be invalid if the password is being edited)
	checkStrongPassword?: boolean;
	passwordToBeRepeated?: Signal<string>; // if set, it will check if the password is repeated correctly
	withoutCompleteMark?: boolean; // if true, it will show a check icon when the password is valid
}

/**
 * PasswordInput component
 * This component is used to input a password with validation and visibility toggle.
 * Typically, there will be two instances of this component:
 * 1. For the password input field (this one should have `checkStrongPassword` set to true.)
 * 2. For the repeat password input field (this one should have `passwordToBeRepeated` set to the first instance's `fieldValue`)
 * 
 * The `completeSignal` will be set to true if the input valid, and false if it is not.
 * The `incompleteSignal` can be used to indicate that the password is being edited and the repeat password field should be marked as invalid.
 * The component will also show validation messages if the password is not valid.
 *
 * Example usage:
 * ```tsx
 * 
 * import { PasswordInput } from '~/components/account/PasswordInput';

 * export default component$(() => {
 *   const password = useSignal('');
 *   const confirmPassword = useSignal('');
 *   const isPasswordValid = useSignal(false);
 *   const isConfirmPasswordValid = useSignal(false);
 * 
 * return (
 *  <PasswordInput
 *   label="Password"
 *   fieldValue={password}
 *   completeSignal={isPasswordValid}
 *   incompleteSignal={isConfirmPasswordValid} // this will be set to false if the password is being edited
 *   checkStrongPassword={true}
 *  />
 *  <PasswordInput
 *   label="Repeat Password"
 *   fieldValue={confirmPassword}
 *   completeSignal={isConfirmPasswordValid}
 *   passwordToBeRepeated={password}
 *  />
 * )
 */
export const PasswordInput = component$((props: PasswordInputProps) => {
	const isPasswordVisible = useSignal(false);
	const isValid = useSignal(false);
	const invalidateMessages = useSignal(['*required']);

	const validatePassword = $(() => {
		const validationResult = isStrongPassword(props.fieldValue.value);
		isValid.value = validationResult.isValid;
		if (!validationResult.isValid) {
			invalidateMessages.value = validationResult.errorMessages;
			props.completeSignal.value = false; // signal that the password is not valid
		} else {
			invalidateMessages.value = [''];
			props.completeSignal.value = true; // signal that the password is valid
		}
	});

	const checkPasswordRepeated = $(() => {
		if (props.passwordToBeRepeated) {
			isValid.value = props.fieldValue.value === props.passwordToBeRepeated.value;
			invalidateMessages.value = isValid.value ? [''] : ['Passwords do not match'];
		}
		if (isValid.value) {
			props.completeSignal.value = true; // signal that the password is valid
		} else {
			props.completeSignal.value = false; // signal that the password is not valid
		}
	});

	return (
		<label class="fieldset">
			<span class="label flex">{props.label}</span>
			<div class="relative w-full">
				<input
					type={isPasswordVisible.value ? 'text' : 'password'}
					class={`input pr-10
						 ${
								props.fieldValue.value.length < 1
									? ''
									: props.completeSignal.value
										? 'input-success'
										: 'input-error'
							}`}
					value={props.fieldValue.value}
					maxLength={30}
					required
					onClick$={() => {
						if (props.checkStrongPassword) {
							validatePassword();
						}
						if (props.passwordToBeRepeated) {
							checkPasswordRepeated();
						}
					}}
					// onInput$={props.onInput$}
					onInput$={(_, el) => {
						props.fieldValue.value = el.value;
						if (props.incompleteSignal) {
							props.incompleteSignal.value = false; // reset the incomplete signal when the user starts typing
						}
						if (props.checkStrongPassword) {
							validatePassword();
						}
						if (props.passwordToBeRepeated) {
							checkPasswordRepeated();
						}
						// if both check are not set, we just set the complete signal to true
						if (!props.checkStrongPassword && !props.passwordToBeRepeated) {
							props.completeSignal.value = true;
						}
					}}
				/>

				<button
					type="button"
					aria-label="Toggle password visibility"
					class="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-5 btn btn-ghost p-1 bg-transparent text-base-content/70"
					onClick$={() => {
						isPasswordVisible.value = !isPasswordVisible.value;
					}}
				>
					{isPasswordVisible.value ? <LuEyeOff class="text-xl" /> : <LuEye class="text-xl" />}
				</button>
			</div>
			{!isValid.value && !props.completeSignal.value && props.fieldValue.value.length > 0 && (
				<div role="alert" class="alert alert-error alert-soft flex flex-col text-left">
					{invalidateMessages?.value.map((msg) => (
						<div key={msg} class="flex gap-2 items-start w-full">
							<LuXCircle />
							<p>{msg}</p>
						</div>
					))}
				</div>
			)}
		</label>
	);
});
