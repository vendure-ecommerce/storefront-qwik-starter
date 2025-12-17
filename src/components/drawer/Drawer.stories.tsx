import { component$, useSignal } from '@builder.io/qwik';
import { type Meta, type StoryObj } from 'storybook-framework-qwik';
import Drawer from './Drawer';

const meta: Meta<typeof Drawer> = {
	title: 'Drawer',
	component: Drawer,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
	args: {
		from: 'right',
	},
	render: (args) => {
		const Demo = component$(() => {
			const drawerClicked = useSignal(false);

			return (
				<Drawer clickedSignal={drawerClicked} {...args}>
					<div class="p-4">
						{/* <label for="my-drawer" class="btn drawer-button">Open Drawer</label> */}
						<button class="btn btn-primary" onClick$={() => (drawerClicked.value = true)}>
							Open Drawer
						</button>
						<p class="mt-4">This is the page content behind the drawer.</p>
					</div>

					<div q:slot="sidebar">
						<li class="menu-title">Your Cart</li>
						<li>
							<a>
								Sample Item 1<span class="badge badge-primary ml-2">1</span>
							</a>
						</li>
						<li>
							<a>
								Sample Item 2<span class="badge badge-primary ml-2">2</span>
							</a>
						</li>
						<li class="mt-4">
							{/* <label for="my-drawer" class="btn drawer-button" onClick$={() => window.alert('close drawer')}> */}
							<button class="btn btn-secondary" onClick$={() => (drawerClicked.value = true)}>
								Close Drawer
							</button>
						</li>
					</div>
				</Drawer>
			);
		});
		return <Demo />;
	},
};
