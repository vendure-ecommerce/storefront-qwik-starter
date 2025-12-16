import { component$, useContextProvider, useSignal } from '@builder.io/qwik';
import { QwikCityMockProvider } from '@builder.io/qwik-city';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import { APP_STATE } from '~/constants';
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
			useContextProvider(APP_STATE, mockAppState);
			const open = useSignal(true);
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
