import { Component, component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

interface IProps {
	Icon: Component<{ class: string }>;
	text: string;
	href: string;
	isActive: boolean;
}

export const Tab = component$(({ Icon, text, href, isActive }: IProps) => {
	return (
		<li>
			<Link
				href={href}
				class={`group w-full gap-x-2 max-w-[12rem] inline-flex items-center justify-around p-4 rounded-t-lg border-b-2 ${
					isActive
						? 'text-primary-500 border-primary-500'
						: 'border-transparent hover:text-gray-600 hover:border-gray-300'
				}`}
			>
				<Icon
					class={`w-5 h-5 ${
						isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
					}`}
				/>
				<p class="flex-1">{text}</p>
			</Link>
		</li>
	);
});
