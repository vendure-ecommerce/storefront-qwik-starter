import { component$, useContext } from '@builder.io/qwik';
import type { Meta, StoryObj } from 'storybook-framework-qwik';

import { APP_STATE, CUSTOMER_NOT_DEFINED_ID } from '~/constants';
import { ActiveCustomer } from '~/types';
import ContactCard from './ContactCard';

const meta: Meta = {
	title: 'Checkout/ContactCard',
	component: ContactCard as any,
	parameters: {
		layout: 'centered',
	},
};

export default meta;
type Story = StoryObj;

const DemoWrapper = (mockCustomer: ActiveCustomer) =>
	component$(() => {
		const appState = useContext(APP_STATE);
		appState.customer = mockCustomer;

		return <ContactCard />;
	});

export const WithContact: Story = {
	render: () => {
		const Demo = component$(() => {
			const appState = useContext(APP_STATE);
			appState.customer = {
				id: 'mock-customer-id',
				title: 'Mr.',
				firstName: 'Customer',
				lastName: 'NotGuest',
				emailAddress: 'guest@example.com',
				phoneNumber: '555-0100',
			} as ActiveCustomer;

			return <ContactCard />;
		});
		return <Demo />;
	},
};

export const WithoutContact: Story = {
	render: () => {
		const Demo = component$(() => {
			const appState = useContext(APP_STATE);
			appState.customer = {
				id: CUSTOMER_NOT_DEFINED_ID,
				title: '',
				firstName: '',
				lastName: '',
				emailAddress: '',
				phoneNumber: '',
			} as ActiveCustomer;

			return <ContactCard />;
		});
		return <Demo />;
	},
};

export const GuestWithContact: Story = {
	render: () => {
		const Demo = component$(() => {
			const appState = useContext(APP_STATE);
			appState.customer = {
				id: CUSTOMER_NOT_DEFINED_ID,
				title: 'Mr.',
				firstName: 'Value',
				lastName: 'Guest',
				emailAddress: 'abc@dsf.com',
				phoneNumber: '1234567890',
			} as ActiveCustomer;

			return <ContactCard />;
		});
		return <Demo />;
	},
};
