import type { Meta, StoryObj } from 'storybook-framework-qwik';
import Info from './Info';

const meta: Meta<typeof Info> = {
	component: Info,
};

type Story = StoryObj<typeof Info>;

export default meta;

export const Default: Story = {
	args: {
		text: 'This is some informational text.',
	},
	render: (props: any) => <Info {...props} />,
};
