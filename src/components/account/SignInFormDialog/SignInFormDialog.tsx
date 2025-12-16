import { $, component$, QRL, Signal, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { LuXCircle } from '@qwikest/icons/lucide';
import { GOOGLE_CLIENT_ID } from '~/constants';
import { loginMutation } from '~/providers/shop/account/account';
import { ActiveCustomer } from '~/types';
import { Dialog } from '../../dialog/Dialog';
import { EmailInput } from '../EmailInput';
import { GoogleSignInButton } from '../GoogleSignIn';
import { PasswordInput } from '../PasswordInput';

interface SignInFormDialogProps {
	open: Signal<boolean>;
	onSuccess$: QRL<(customer: ActiveCustomer) => Promise<void>>;
}

export default component$(({ open, onSuccess$ }: SignInFormDialogProps) => {
	const email = useSignal('');
	const password = useSignal('');
	const rememberMe = useSignal(true);
	const isPassWordValid = useSignal(false);
	const isEmailValid = useSignal(false);
	const navigate = useNavigate();
	const logInError = useSignal('');

	useVisibleTask$(({ track }) => {
		track(() => open.value);
		// Clear form when dialog is opened
		if (open.value) {
			console.log('dialog opened, clearing form');
		} else {
			console.log('dialog closed');
		}
	});

	const onLogIn$ = $(async () => {
		const { login } = await loginMutation(email.value, password.value, rememberMe.value);
		console.log('Login response:', JSON.stringify(login, null, 2));
		// if (login.__typename === 'CurrentUser') {
		//   const customer = await loadCustomerData();
		//   await onSuccess$(customer);
		//   // open.value = false;
		// } else {
		//   console.error('Login error:', login.message);
		//   logInError.value = login.message;
		// }
	});

	return (
		<Dialog open={open} id="sign-in-form-dialog">
			<div class="flex w-72 flex-col">
				<form class="fieldset bg-base-100 border-base-300 rounded-box border p-4">
					<h2 class="text-content text-2xl justify-center mb-3">
						{$localize`Sign in to your account`}
					</h2>
					{logInError.value && (
						<div role="alert" class="alert alert-error flex">
							<LuXCircle class="w-6 h-6" />
							<span>{logInError.value}</span>
						</div>
					)}
					<EmailInput fieldValue={email} completeSignal={isEmailValid} />

					<PasswordInput
						label={$localize`Password`}
						fieldValue={password}
						completeSignal={isPassWordValid}
						checkStrongPassword={true}
						withoutCompleteMark={false}
					/>

					<button
						class="btn btn-accent mt-4"
						// type="submit"
						disabled={!isPassWordValid.value || !isEmailValid.value}
						// onClick$={onLogIn$}
						onClick$={$(async (event) => {
							event.preventDefault();
							console.log('Submitting login form with', {
								email: email.value,
								password: password.value,
								rememberMe: rememberMe.value,
							});
							// await onLogIn$();
						})}
					>
						{$localize`Sign in`}
					</button>
					<button class="btn btn-ghost mt-1" type="reset">
						Reset
					</button>
				</form>
				<div class="divider">OR</div>
				<div class="card bg-base-100 rounded-box grid h-20 place-items-center">
					<button
						class="btn btn-link"
						onClick$={() => {
							navigate('/sign-up');
							open.value = false;
						}}
					>
						{$localize`Create an account`}
					</button>
					<GoogleSignInButton googleClientId={GOOGLE_CLIENT_ID} />
				</div>
			</div>
		</Dialog>
	);
});
