import { $, component$, useSignal } from '@builder.io/qwik';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import type { ActiveCustomer } from '~/types';
import ContactForm from './ContactForm';

const meta: Meta = {
	title: 'Checkout/ContactForm',
	component: ContactForm as any,
	parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const DemoWrapper = (prefilled?: Partial<ActiveCustomer>) =>
	component$(() => {
		const open = useSignal(true);
		const onSubmitCompleted$ = $(async (customer: ActiveCustomer) => {
			// eslint-disable-next-line no-console
			console.log('ContactForm submit completed:', JSON.stringify(customer, null, 2));
		});

		return (
			<div class="flex items-center justify-center min-h-screen">
				<div class="w-full max-w-lg p-6 bg-base-100 rounded-md">
					<ContactForm
						open={open}
						onSubmitCompleted$={onSubmitCompleted$}
						prefilledInfo={prefilled as any}
					/>
				</div>
			</div>
		);
	});

export const Default: Story = {
	render: () => {
		const Demo = DemoWrapper();
		return <Demo />;
	},
};

export const Prefilled: Story = {
	render: () => {
		const Demo = DemoWrapper({
			id: 'guest-1',
			emailAddress: 'alice@example.com',
			firstName: 'Alice',
			lastName: 'Smith',
			phoneNumber: '555-1234',
			title: 'Ms.',
		});
		return <Demo />;
	},
};
