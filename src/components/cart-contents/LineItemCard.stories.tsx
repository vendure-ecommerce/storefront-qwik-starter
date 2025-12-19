import { $, component$, useSignal } from '@builder.io/qwik';
import { QwikCityMockProvider } from '@builder.io/qwik-city';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import LineItemCard from './LineItemCard';

const mockLine = {
	id: 'line-1',
	quantity: 2,
	linePriceWithTax: 4999,
	featuredAsset: { preview: 'https://picsum.photos/200' },
	productVariant: {
		id: 'variant-1',
		name: 'Variant Name',
		product: { slug: 'sample-product', name: 'Sample Product', customFields: {} },
	},
	customFields: {},
} as any;

const meta: Meta<typeof LineItemCard> = {
	title: 'Cart/LineItemCard',
	component: LineItemCard,
	parameters: {
		layout: 'centered',
	},
};

export default meta;
type Story = StoryObj<typeof LineItemCard>;

export const Editable: Story = {
	render: () => {
		const Demo = component$(() => {
			const readOnly = useSignal(false);
			const onQuantityChange$ = $((id: string, value: number) => {
				// mimic action: update console + internal mock change for story snapshotting
				console.log('onQuantityChange$', id, value);
			});
			const onRemove$ = $((id: string) => {
				console.log('onRemove$', id);
			});

			return (
				<LineItemCard
					line={mockLine}
					currencyCode="USD"
					readOnly={readOnly}
					onQuantityChange$={onQuantityChange$}
					onRemove$={onRemove$}
					allowReview={true}
				/>
			);
		});

		return <Demo />;
	},
};

export const ReadOnly: Story = {
	render: () => {
		const Demo = component$(() => {
			const readOnly = useSignal(true);
			return (
				<QwikCityMockProvider>
					<LineItemCard
						line={mockLine}
						currencyCode="USD"
						readOnly={readOnly}
						allowReview={false}
					/>
				</QwikCityMockProvider>
			);
		});

		return <Demo />;
	},
};
