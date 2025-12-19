import { component$ } from '@builder.io/qwik';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import Info from './Info';

const meta: Meta<{ text: string }> = {
	component: Info,
	parameters: { layout: 'fullscreen' },
};

type Story = StoryObj<{ text: string }>;

export default meta;

export const Default: Story = {
	args: { text: 'Helpful information' },
	render: (props) => {
		const Demo = component$(() => (
			<div class="flex items-center justify-center min-h-screen">
				<div class="p-8">
					<Info text={props.text} />
				</div>
			</div>
		));
		return <Demo />;
	},
};

export const LongText: Story = {
	args: {
		text: 'This is a longer informational tooltip that explains more details about this element.',
	},
	render: (props) => {
		const Demo = component$(() => (
			<div class="flex items-center justify-center min-h-screen">
				<div class="p-8">
					<Info text={props.text} />
				</div>
			</div>
		));
		return <Demo />;
	},
};
