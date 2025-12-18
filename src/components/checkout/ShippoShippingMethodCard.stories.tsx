import { component$ } from '@builder.io/qwik';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ShippoShippingMethodCard from './ShippoShippingMethodCard';

const mockMethod = {
	name: 'Standard Shipping',
	priceWithTax: 499, // cents or minor units depending on project conventions
	metadata: {
		maxWaitDays: 5,
		shipToPostalCode: '94103',
	},
} as any;

const meta: Meta<typeof ShippoShippingMethodCard> = {
	title: 'Checkout/ShippoShippingMethodCard',
	component: ShippoShippingMethodCard,
	parameters: {
		layout: 'centered',
	},
};

export default meta;
type Story = StoryObj<typeof ShippoShippingMethodCard>;

export const Default: Story = {
	render: () => {
		const Demo = component$(() => {
			return (
				<div class="w-96 relative p-4 bg-base-100 rounded-md">
					<ShippoShippingMethodCard shippingMethod={mockMethod} checked={false} />
				</div>
			);
		});
		return <Demo />;
	},
};

export const Checked: Story = {
	render: () => {
		const Demo = component$(() => {
			return (
				<div class="w-96 relative p-4 bg-base-100 rounded-md">
					<ShippoShippingMethodCard shippingMethod={mockMethod} checked={true} />
				</div>
			);
		});
		return <Demo />;
	},
};
