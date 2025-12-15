import { component$, QRL, useSignal } from '@builder.io/qwik';
import { EmailInput } from '../EmailInput';
import { PasswordInput } from '../PasswordInput';

interface SignInFormProps {
	onLogIn$: QRL<(email: string, password: string, rememberMe: boolean) => Promise<void>>;
}

export default component$(({ onLogIn$ }: SignInFormProps) => {
	const email = useSignal('');
	const password = useSignal('');
	const rememberMe = useSignal(true);
	const isPassWordValid = useSignal(false);
	const isEmailValid = useSignal(false);

	return (
		<>
			<form class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
				<EmailInput fieldValue={email} completeSignal={isEmailValid} />

				<PasswordInput
					label={$localize`Password`}
					fieldValue={password}
					completeSignal={isPassWordValid}
					checkStrongPassword={true}
					withoutCompleteMark={false}
				/>

				<button
					class="btn btn-neutral"
					type="submit"
					disabled={!isPassWordValid.value || !isEmailValid.value}
					onClick$={() => onLogIn$(email.value, password.value, rememberMe.value)}
				>
					{$localize`Sign in`}
				</button>
				<button class="btn btn-ghost mt-1" type="reset">
					Reset
				</button>
			</form>
		</>
	);
});
