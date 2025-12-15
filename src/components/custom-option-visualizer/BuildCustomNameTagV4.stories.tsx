import { $, component$, useContextProvider } from '@builder.io/qwik';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import { DEFAULT_OPTIONS_FOR_NAME_TAG } from '~/routes/constants';
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
	render: () => {
		const handleAtcEligibility = $((allowed: boolean, reason: string) => {
			// eslint-disable-next-line no-console
			console.log('onAtcEligibility$', { allowed, reason });
		});
		const Wrapper = component$((props: any) => {
			useContextProvider(DEFAULT_OPTIONS_FOR_NAME_TAG, {
				primaryColorId: sampleFilamentColors[0].id,
				baseColorId: sampleFilamentColors[1].id,
				fontId: sampleFontMenus[0].id,
				textTop: 'Hello',
				textBottom: 'World',
			});
			return <div style={{ padding: 16 }}>{props.children}</div>;
		});

		return (
			<div class="p-10">
				<BuildCustomNameTag
					filamentColors={sampleFilamentColors as any}
					fontMenus={sampleFontMenus as any}
					onAtcEligibility$={handleAtcEligibility as any}
					build_plates={{ top: true, bottom: true }}
					canvas_width_px={300}
					onChange$={$((buildParams) => {
						console.log('Build params changed:', buildParams);
					})}
				/>
			</div>
		);
	},
};
