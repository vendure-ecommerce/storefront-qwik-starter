import { $ } from '@builder.io/qwik';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import BuildCustomNameTag from './BuildCustomNameTagV4';

const sampleFilamentColors = [
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
];

const sampleFontMenus = [
	{
		id: 'Crimson_Text__regular',
		name: 'Crimson Text (Regular)',
		additiveFontId: 'Crimson_Text__regular',
		subtractiveFontId: 'Crimson_Text__regular',
		isDisabled: false,
	},
	{
		id: 'Crimson_Text__bold',
		name: 'Crimson Text (Bold)',
		additiveFontId: 'Crimson_Text__bold',
		subtractiveFontId: 'Crimson_Text__bold',
		isDisabled: false,
	},
	{
		id: 'Comic_Neue__bold_italic',
		name: 'Comic Neue (Bold Italic)',
		additiveFontId: 'Comic_Neue__bold_italic',
		subtractiveFontId: 'Comic_Neue__bold_italic',
		isDisabled: false,
	},
];

const meta: Meta<any> = {
	title: 'Custom Option Visualizer/BuildCustomNameTagV4',
	component: BuildCustomNameTag as any,
};

type Story = StoryObj<any>;

export default meta;

export const Default: Story = {
	args: {
		build_top_plate: true,
		build_bottom_plate: true,
	},
	render: (args) => {
		const handleAtcEligibility = $((allowed: boolean, reason: string) => {
			// eslint-disable-next-line no-console
			console.log('onAtcEligibility$', { allowed, reason });
		});

		return (
			<div class="p-10">
				<BuildCustomNameTag
					filamentColors={sampleFilamentColors as any}
					fontMenus={sampleFontMenus as any}
					onAtcEligibility$={handleAtcEligibility as any}
					build_plates={{ top: args.build_top_plate, bottom: args.build_bottom_plate }}
					canvas_width_px={300}
					onChange$={$((buildParams) => {
						console.log('Build params changed:', buildParams);
					})}
				/>
			</div>
		);
	},
};
