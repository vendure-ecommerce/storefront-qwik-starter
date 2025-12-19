import { component$ } from '@builder.io/qwik';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import type { Order } from '~/generated/graphql';
import OrderCard from './OrderCard';

const meta: Meta<typeof OrderCard> = {
	title: 'Account/OrderCard',
	component: OrderCard,
	parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof OrderCard>;

const mockOrder: Order = {
	id: 'order-1',
	code: 'TEST123',
	createdAt: new Date().toISOString(),
	state: 'Arranged',
	totalWithTax: 2599,
	currencyCode: 'USD',
	lines: [
		{
			id: 'line-1',
			quantity: 1,
			featuredAsset: { preview: 'https://picsum.photos/id/237/200/300' } as any,
			productVariant: {
				id: 'pv-1',
				name: 'Product 1',
				product: { slug: 'prod-1', name: 'Product 1' },
			} as any,
			linePriceWithTax: 1299,
		} as any,
		{
			id: 'line-2',
			quantity: 1,
			featuredAsset: { preview: 'https://picsum.photos/id/238/200/300' } as any,
			productVariant: {
				id: 'pv-2',
				name: 'Product 2',
				product: { slug: 'prod-2', name: 'Product 2' },
			} as any,
			linePriceWithTax: 1300,
		} as any,
		{
			id: 'line-3',
			quantity: 2,
			featuredAsset: { preview: 'https://picsum.photos/id/239/200/300' } as any,
			productVariant: {
				id: 'pv-3',
				name: 'Product 3',
				product: { slug: 'prod-3', name: 'Product 3' },
			} as any,
			linePriceWithTax: 1300,
		} as any,
		{
			id: 'line-4',
			quantity: 2,
			featuredAsset: { preview: 'https://picsum.photos/id/240/200/300' } as any,
			productVariant: {
				id: 'pv-4',
				name: 'Product 4',
				product: { slug: 'prod-4', name: 'Product 4' },
			} as any,
			linePriceWithTax: 1300,
		} as any,
		{
			id: 'line-5',
			quantity: 2,
			featuredAsset: { preview: 'https://picsum.photos/id/241/200/300' } as any,
			productVariant: {
				id: 'pv-5',
				name: 'Product 5',
				product: { slug: 'prod-5', name: 'Product 5' },
			} as any,
			linePriceWithTax: 1300,
		} as any,
	],
} as any;

export const Default: Story = {
	render: () => {
		const Demo = component$(() => (
			<div class="flex items-center justify-center min-h-screen bg-base-200 p-8">
				<OrderCard order={mockOrder} />
			</div>
		));
		return <Demo />;
	},
};
