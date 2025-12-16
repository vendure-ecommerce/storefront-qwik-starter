import { $, component$, useSignal } from '@builder.io/qwik';
import type { Meta, StoryObj } from 'storybook-framework-qwik';
import { Dialog } from './Dialog';

const meta: Meta<any> = {
	title: 'Overlay/Dialog',
	component: Dialog as any,
};

type Story = StoryObj<any>;

export default meta;

export const Default: Story = {
	render: () => {
		const Demo = component$(() => {
			const open = useSignal(false);
			const openDialog = $(() => (open.value = true));
			return (
				<div style={{ padding: 24 }}>
					<button class="btn btn-primary" onClick$={openDialog}>
						Open dialog
					</button>
					<Dialog open={open} extraClass="bg-base-100">
						<div style={{ minWidth: 320 }}>
							<h3 class="text-lg font-medium mb-4">Dialog title</h3>
							<p class="mb-4">This is an example dialog. You can close it using the X button.</p>
							<div class="flex justify-end gap-2">
								<button class="btn btn-ghost" onClick$={() => (open.value = false)}>
									Cancel
								</button>
								<button class="btn btn-primary" onClick$={() => (open.value = false)}>
									OK
								</button>
							</div>
						</div>
					</Dialog>
				</div>
			);
		});

		return <Demo />;
	},
};
