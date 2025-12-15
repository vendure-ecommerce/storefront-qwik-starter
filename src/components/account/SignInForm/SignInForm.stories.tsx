import { $ } from '@builder.io/qwik';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import SignInForm from './SignInForm';

const meta: Meta<any> = {
	title: 'Account/SignInForm',
	component: SignInForm as any,
};

type Story = StoryObj<any>;

export default meta;

export const Default: Story = {
	render: () => (
		<div style={{ padding: 20 }}>
			<SignInForm
				onLogIn$={$((email: string, password: string, rememberme: boolean) =>
					console.log('Log in with', { email, password, rememberme })
				)}
			/>
		</div>
	),
};
