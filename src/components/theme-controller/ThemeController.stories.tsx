import type { Meta, StoryObj } from 'storybook-framework-qwik';
import ThemeController from './ThemeController';

const meta: Meta<any> = {
	title: 'Theme/ThemeController',
	component: ThemeController as any,
};

type Story = StoryObj<any>;

export default meta;

export const Default: Story = {
	render: () => {
		return (
			<div style={{ padding: 16 }}>
				<ThemeController />
			</div>
		);
	},
};
