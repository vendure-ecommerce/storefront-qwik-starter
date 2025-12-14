import { $ } from '@builder.io/qwik';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import TextWithFontInput from './TextWithFontInputV4';

const sampleFontMenu = [
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
	title: 'Custom Option Visualizer/TextWithFontInputV4',
	component: TextWithFontInput as any,
};

type Story = StoryObj<any>;

export default meta;

export const Default: Story = {
	render: () => {
		const handleChange = $((text: string, fontId: string) => {
			// eslint-disable-next-line no-console
			console.log('onChange$', { text, fontId });
		});

		const handleEligibility = $((allowed: boolean) => {
			// eslint-disable-next-line no-console
			console.log('onEligibilityChange$', allowed);
		});

		return (
			<div style={{ padding: 16 }}>
				<TextWithFontInput
					fontMenu={sampleFontMenu as any}
					defaultText="Hello"
					defaultFontId={sampleFontMenu[0].id}
					onChange$={handleChange as any}
					onEligibilityChange$={handleEligibility as any}
				/>
			</div>
		);
	},
};
