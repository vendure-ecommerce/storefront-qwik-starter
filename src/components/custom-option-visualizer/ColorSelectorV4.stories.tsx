import { $ } from '@builder.io/qwik';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ColorSelector from './ColorSelectorV4';

const sampleColors = [
	{
		id: 'lemon_yellow',
		name: 'Lemon Yellow',
		displayName: 'Lemon Yellow',
		hexCode: '#FFD700',
		isOutOfStock: false,
	},
	{
		id: 'ocean_blue',
		name: 'Ocean Blue',
		displayName: 'Ocean Blue',
		hexCode: '#0077BE',
		isOutOfStock: false,
	},
	{
		id: 'pure_white',
		name: 'Pure White',
		displayName: 'Pure White',
		hexCode: '#FFFFFF',
		isOutOfStock: false,
	},
	{
		id: 'midnight_black',
		name: 'Midnight Black',
		displayName: 'Midnight Black',
		hexCode: '#000000',
		isOutOfStock: false,
	},
];

const meta: Meta<any> = {
	title: 'Custom Option Visualizer/ColorSelectorV4',
	component: ColorSelector as any,
};

type Story = StoryObj<any>;

export default meta;

export const Default: Story = {
	render: () => {
		const handleChange = $((newColorId: string) => {
			// eslint-disable-next-line no-console
			console.log('onChange$', newColorId);
		});

		return (
			<div style={{ padding: 16 }}>
				<ColorSelector
					fieldTitle="Filament Color"
					colorOptions={sampleColors as any}
					defaultColorId={sampleColors[0].id}
					isBackgroundColor={false}
					onChange$={handleChange as any}
				/>
			</div>
		);
	},
};

export const Background: Story = {
	render: () => {
		const handleChange = $((newColorId: string) => {
			// eslint-disable-next-line no-console
			console.log('onChange(background)$', newColorId);
		});

		return (
			<div style={{ padding: 16 }}>
				<ColorSelector
					fieldTitle="Background Color"
					colorOptions={sampleColors as any}
					defaultColorId={sampleColors[1].id}
					isBackgroundColor={true}
					onChange$={handleChange as any}
				/>
			</div>
		);
	},
};
