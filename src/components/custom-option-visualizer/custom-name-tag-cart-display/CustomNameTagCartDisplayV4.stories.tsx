import { component$, useContextProvider } from '@builder.io/qwik';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import { CUSTOMIZABLE_CLASS_DEF_TAG, EXTRA_DATA } from '~/routes/constants';
import CustomNameTagCartDisplay from './CustomNameTagCartDisplayV4';

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
];

const classDef = [
	{
		name: 'CustomNameTag',
		optionDefinition: [
			{ field: 'textTop', type: 'string?' },
			{ field: 'textBottom', type: 'string?' },
			{ field: 'fontMenuIdTop', type: 'string?' },
			{ field: 'fontMenuIdBottom', type: 'string?' },
			{ field: 'filamentColorIdPrimary', type: 'string?' },
			{ field: 'filamentColorIdBase', type: 'string?' },
			{ field: 'isTopAdditive', type: 'boolean' },
		],
	},
];

const meta: Meta<typeof CustomNameTagCartDisplay> = {
	title: 'Custom Option Visualizer/CustomNameTagCartDisplayV4',
	component: CustomNameTagCartDisplay,
	argTypes: {
		textTop: { control: 'text' },
		textBottom: { control: 'text' },
		fontTop: { control: 'select', options: sampleFontMenus.map((f) => f.id) },
		fontBottom: { control: 'select', options: sampleFontMenus.map((f) => f.id) },
		primaryColor: { control: 'select', options: sampleFilamentColors.map((c) => c.id) },
		baseColor: { control: 'select', options: sampleFilamentColors.map((c) => c.id) },
		isTopAdditive: { control: 'boolean' },
	},
};

export default meta;
type Story = StoryObj<typeof CustomNameTagCartDisplay>;

const renderWithArgs = (args: any) => {
	const Demo = component$(() => {
		// provide contexts expected by the component
		useContextProvider(EXTRA_DATA, {
			filamentColors: sampleFilamentColors as any,
			fontMenus: sampleFontMenus as any,
		});
		useContextProvider(CUSTOMIZABLE_CLASS_DEF_TAG, classDef as any);

		const optionArray = [
			args.textTop ?? null,
			args.textBottom ?? null,
			args.fontTop ?? null,
			args.fontBottom ?? null,
			args.primaryColor ?? sampleFilamentColors[0].id,
			args.baseColor ?? sampleFilamentColors[2].id,
			args.isTopAdditive ?? true,
		];

		return (
			<div class="p-6">
				<CustomNameTagCartDisplay
					customizableOptionJson={JSON.stringify(optionArray)}
					concatenate_canvas_element_id={
						args.concatenate_canvas_element_id ?? 'story-custom-name-tag'
					}
				/>
			</div>
		);
	});
	return <Demo />;
};

export const Default: Story = {
	args: {
		textTop: 'ALICE',
		textBottom: 'SMITH',
		fontTop: sampleFontMenus[0].id,
		fontBottom: sampleFontMenus[1].id,
		primaryColor: sampleFilamentColors[0].id,
		baseColor: sampleFilamentColors[2].id,
		isTopAdditive: true,
		concatenate_canvas_element_id: 'story-custom-name-tag',
	},
	render: (args) => renderWithArgs(args),
};

export const TopOnly: Story = {
	args: {
		...Default.args,
		textBottom: null,
		fontBottom: null,
	},
	render: (args) => renderWithArgs(args),
};

export const BottomOnly: Story = {
	args: {
		...Default.args,
		textTop: null,
		fontTop: null,
		isTopAdditive: false,
	},
	render: (args) => renderWithArgs(args),
};
