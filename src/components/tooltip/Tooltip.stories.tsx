import type { Meta, StoryObj } from 'storybook-framework-qwik';
import Tooltip, { TooltipProps } from './Tooltip';

const meta: Meta<TooltipProps> = {
	component: Tooltip,
};

type Story = StoryObj<TooltipProps>;

export default meta;

export const Primary: Story = {
	args: {
		text: 'This is a tooltip',
	},
	render: (props: TooltipProps) => (
		<Tooltip {...props}>
			<button>Hover me</button>
		</Tooltip>
	),
};
