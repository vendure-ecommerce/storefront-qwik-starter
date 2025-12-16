import { QwikCityMockProvider } from '@builder.io/qwik-city';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import { ShippingAddress } from '~/types';
import ShippingAddressCard from './ShippingAddressCard';

const mockAddress: ShippingAddress = {
	id: 'addr-123',
	fullName: 'John Doe',
	company: 'Acme Corp',
	streetLine1: '123 Main Street',
	streetLine2: 'Suite 100',
	city: 'New York',
	province: 'NY',
	postalCode: '10001',
	countryCode: 'US',
	phoneNumber: '+1 (555) 123-4567',
	defaultShippingAddress: true,
	defaultBillingAddress: true,
};

const meta: Meta<typeof ShippingAddressCard> = {
	title: 'Account/ShippingAddressCard',
	component: ShippingAddressCard,
	parameters: {
		layout: 'centered',
	},
};

export default meta;
type Story = StoryObj<typeof ShippingAddressCard>;

export const Default: Story = {
	args: {
		address: mockAddress,
		showDefault: true,
		allowDelete: true,
		allowEdit: true,
	},
	render: (args) => {
		return (
			<QwikCityMockProvider>
				<ShippingAddressCard {...args} />
			</QwikCityMockProvider>
		);
	},
};
