import { component$, useSignal } from '@builder.io/qwik';
import { QwikCityMockProvider } from '@builder.io/qwik-city';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import { ActiveCustomer, AppState } from '~/types';
import SignInFormDialog from './SignInFormDialog';

const mockAppState: AppState = {
	collections: [],
	activeOrder: {} as any,
	showCart: false,
	showMenu: false,
	customer: {
		id: 'mock-customer-id',
		firstName: 'John',
		lastName: 'Doe',
		emailAddress: 'john@example.com',
	} as ActiveCustomer,
	shippingAddress: {} as any,
	availableCountries: [],
	addressBook: [],
	purchasedVariantsWithReviewStatus: [],
};

const meta: Meta<any> = {
	title: 'Account/SignInForm',
	component: SignInFormDialog as any,
};

type Story = StoryObj<any>;

export default meta;

export const Default: Story = {
	render: () => {
		const Demo = component$(() => {
			// useContextProvider(APP_STATE, mockAppState);
			const open = useSignal(true);

			// Mock Google Sign-In library in Storybook to prevent script loading issues
			// This ensures the button renders consistently instead of disappearing
			if (typeof window !== 'undefined' && !(window as any).google?.accounts?.id) {
				(window as any).google = {
					accounts: {
						id: {
							initialize: () => {
								console.log('[Storybook Mock] Google.accounts.id.initialize called');
							},
							renderButton: (container: HTMLElement) => {
								console.log('[Storybook Mock] Google.accounts.id.renderButton called');
								// Create a mock button to show in Storybook
								container.innerHTML =
									'<button style="padding: 10px 16px; border: 1px solid #ccc; border-radius: 4px; background: #fff; cursor: pointer;">📱 Sign in with Google (Mock)</button>';
							},
							prompt: () => {
								console.log('[Storybook Mock] Google.accounts.id.prompt called');
								alert('Google Sign-In (mock) would open here');
							},
						},
					},
				};
			}

			return (
				<div style={{ padding: 20 }}>
					<button class="btn btn-primary" onClick$={() => (open.value = true)}>
						Open dialog
					</button>
					{open.value && (
						<QwikCityMockProvider>
							<SignInFormDialog
								open={open}
								onSuccess$={async () => {
									alert('Sign in successful!');
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
