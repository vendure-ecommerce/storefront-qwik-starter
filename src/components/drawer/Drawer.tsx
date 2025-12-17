import { component$, Signal, Slot, useVisibleTask$ } from '@builder.io/qwik';

interface IProps {
	clickedSignal: Signal<boolean>;
	sliderElementId?: string;
	from?: 'left' | 'right';
}

/**
 * Cart drawer component.
 * Using Daisiui's drawer sidebar: https://daisyui.com/components/drawer/
 *
 * This component uses qwik named slots to allow for flexible content insertion.
 * See: https://qwik.dev/docs/core/slots/
 * Note that use, for example, <div q:slot={sliderElementId}> to access the second sidebar slot.
 */
export default component$(
	({ clickedSignal, sliderElementId = 'sidebar', from = 'right' }: IProps) => {
		const drawerElementId = 'main-drawer';
		useVisibleTask$(async ({ track }) => {
			track(() => clickedSignal.value);
			if (clickedSignal.value) {
				const drawerCheckbox = document.getElementById(drawerElementId) as HTMLInputElement | null;
				if (drawerCheckbox) {
					drawerCheckbox.checked = !drawerCheckbox.checked;
					await new Promise<void>((res) => requestAnimationFrame(() => res()));
				}
				clickedSignal.value = false;
			}
		});
		return (
			<div class={`drawer ${from === 'right' ? 'drawer-end' : ''}`}>
				<input id={drawerElementId} type="checkbox" class="drawer-toggle" />
				<div class="drawer-content">
					<Slot />
					{/* Page content here */}
					{/* The button to open the drawer 
        <label for={drawerElementId} class="btn drawer-button">Open drawer</label> */}
				</div>
				<div class="drawer-side">
					<label for={drawerElementId} aria-label="close sidebar" class="drawer-overlay"></label>
					<ul class="menu bg-base-200 min-h-full w-80 p-4">
						<Slot name={sliderElementId} />
						{/* Sidebar content here */}
						{/* <li><a>Sidebar Item 1</a></li>
          <li><a>Sidebar Item 2</a></li> */}

						{/* The button for the async function <name>(params:type) {
              <label for="my-drawer" class="btn drawer-button" onClick$={() => window.alert('close drawer')}>
                Close Drawer
              </label>
          } */}
					</ul>
				</div>
			</div>
		);
	}
);
