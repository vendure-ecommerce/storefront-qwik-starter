import { component$ } from '@builder.io/qwik';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import Tooltip, { TooltipProps } from './Tooltip';

const meta: Meta<TooltipProps> = {
	component: Tooltip,
	parameters: {
		layout: 'fullscreen',
	},
};

type Story = StoryObj<TooltipProps>;

export default meta;

export const Primary: Story = {
	args: {
		text: 'This is a tooltip',
	},
	render: (props: TooltipProps) => {
		const Demo = component$(() => (
			<div class="flex items-center justify-center min-h-screen">
				<div class="p-8">
					<Tooltip {...props}>
						<button class="btn">Hover me</button>
					</Tooltip>
				</div>
			</div>
		));
		return <Demo />;
	},
};

export const CustomContent: Story = {
	render: () => {
		const Demo = component$(() => (
			<div class="flex items-center justify-center min-h-screen">
				<div class="p-8">
					<Tooltip>
						<span q:slot="tooltip-content" class="text-sm">
							<strong>Custom Tooltip Content:</strong> You can put any Qwik component here!
						</span>
						<button class="btn">Hover me</button>
					</Tooltip>
				</div>
			</div>
		));
		return <Demo />;
	},
};
