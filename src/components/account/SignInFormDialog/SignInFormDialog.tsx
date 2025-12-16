import { $, component$, QRL, Signal, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { LuXCircle } from '@qwikest/icons/lucide';
import GeneralInput from '~/components/common/GeneralInput';
import { GOOGLE_CLIENT_ID } from '~/constants';
import { loginMutation } from '~/providers/shop/account/account';
import { ActiveCustomer } from '~/types';
import { loadCustomerData } from '~/utils';
import { Dialog } from '../../dialog/Dialog';
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
		if (login.__typename === 'CurrentUser') {
			const customer = await loadCustomerData();
			await onSuccess$(customer);
			open.value = false;
		} else {
			console.error('Login error:', login.message);
			logInError.value = login.message;
		}
	});

	return (
		// align the dialog panel near the top of the screen and add a top margin
		<Dialog open={open} id="sign-in-form-dialog" extraClass="self-start mt-10">
			<div class="flex w-80 flex-col items-start">
				<h2 class="text-content text-2xl justify-center mb-3">
					{$localize`Sign in to your account`}
				</h2>
				{logInError.value && (
					<div role="alert" class="alert alert-error flex">
						<LuXCircle class="w-6 h-6" />
						<span>{logInError.value}</span>
					</div>
				)}
				<GeneralInput
					label={$localize`Email`}
					type="email"
					placeholder={$localize`your@email.com`}
					fieldValue={email}
					completeSignal={isEmailValid}
					extraClass="w-80"
				/>

				<PasswordInput
					label={$localize`Password`}
					fieldValue={password}
					completeSignal={isPassWordValid}
					checkStrongPassword={true}
					withoutCompleteMark={false}
					extraClass="w-80"
				/>

				<button
					class="btn btn-accent mt-4 w-full"
					disabled={!isPassWordValid.value || !isEmailValid.value}
					onClick$={onLogIn$}
				>
					{$localize`Sign in`}
				</button>
				<div class="divider">OR</div>
				<div class="flex w-full flex-col items-center gap-2">
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
