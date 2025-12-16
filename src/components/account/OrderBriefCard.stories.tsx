import type { Meta, StoryObj } from 'storybook-framework-qwik';
import { Order } from '~/generated/graphql';
import OrderBriefCard from './OrderBriefCard';

const mockOrder: Order = {
	__typename: 'Order',
	id: 'order-123',
	code: 'ORD-2024-001',
	state: 'Delivered',
	createdAt: '2024-12-10T14:30:00Z' as any,
	updatedAt: '2024-12-15T10:15:00Z' as any,
	active: true,
	total: 15999,
	totalQuantity: 3,
	currencyCode: 'USD' as any,
	couponCodes: [],
	discounts: [],
	fulfillments: [
		{
			__typename: 'Fulfillment',
			id: 'fulfillment-1',
			state: 'Delivered',
			method: 'Standard Shipping',
			trackingCode: 'TRACK123456789',
			createdAt: '2024-12-14T00:00:00Z' as any,
			updatedAt: '2024-12-15T10:15:00Z' as any,
			lines: [],
			summary: [],
			customFields: {
				trackingUrl: 'https://www.google.com',
			},
		} as any,
	],
	lines: [],
	payments: [],
	shippingLines: [],
	history: [],
	promotionCodes: [],
} as any;

const mockOrderPending: Order = {
	...mockOrder,
	state: 'Pending',
	fulfillments: [],
} as any;

const mockOrderShipped: Order = {
	...mockOrder,
	state: 'Shipped',
} as any;

const meta: Meta<typeof OrderBriefCard> = {
	title: 'Account/OrderBriefCard',
	component: OrderBriefCard,
	parameters: {
		layout: 'centered',
	},
};

export default meta;
type Story = StoryObj<typeof OrderBriefCard>;

export const Delivered: Story = {
	render: () => <OrderBriefCard order={mockOrder} />,
};

export const Pending: Story = {
	render: () => <OrderBriefCard order={mockOrderPending} />,
};

export const Shipped: Story = {
	render: () => <OrderBriefCard order={mockOrderShipped} />,
};
