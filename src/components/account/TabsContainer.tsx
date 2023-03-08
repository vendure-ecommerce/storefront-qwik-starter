import { Slot, component$, useSignal } from '@builder.io/qwik';
import HashtagIcon from '../icons/HashtagIcon';
import MapPinIcon from '../icons/MapPinIcon';
import ShoppingBagIcon from '../icons/ShoppingBagIcon';
import UserCircleIcon from '../icons/UserCircleIcon';
import Tab from './Tab';

export const TabsContainer = component$(() => {
	const activeTabSignal = useSignal('details');

	return (
		<>
			<div class="border-b border-gray-200 mt-4">
				<ul class="gap-x-4 grid grid-cols-2 sm:grid-0 sm:flex sm:flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
					<Tab
						Icon={UserCircleIcon}
						text="Account details"
						href="#"
						isActive={activeTabSignal.value === 'details'}
					/>

					<Tab
						Icon={ShoppingBagIcon}
						text="Purchase history"
						href="#"
						isActive={activeTabSignal.value === 'history'}
					/>

					<Tab
						Icon={MapPinIcon}
						text="Addresses"
						href="#"
						isActive={activeTabSignal.value === 'addresses'}
					/>

					<Tab
						Icon={HashtagIcon}
						text="Password change"
						href="#"
						isActive={activeTabSignal.value === 'password'}
					/>
				</ul>
			</div>
			<Slot name="tabContent" />
		</>
	);
});
