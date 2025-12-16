import { component$, useSignal } from '@builder.io/qwik';
import { QwikCityMockProvider } from '@builder.io/qwik-city';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import SignInFormDialog from './SignInFormDialog';

const meta: Meta<any> = {
	title: 'Account/SignInForm',
	component: SignInFormDialog as any,
};

type Story = StoryObj<any>;

export default meta;

export const Default: Story = {
	render: () => {
		const Demo = component$(() => {
			const open = useSignal(false);
			return (
				<div style={{ padding: 20 }}>
					<button class="btn btn-primary" onClick$={() => (open.value = true)}>
						Open dialog
					</button>
					{open.value && (
						<QwikCityMockProvider>
							<SignInFormDialog
								open={open}
								onSuccess$={async (customer) => {
									alert(`Welcome back, ${customer.firstName}!`);
								}}
							/>
						</QwikCityMockProvider>
					)}
				</div>
			);
		});
		return <Demo />;
	},
};
