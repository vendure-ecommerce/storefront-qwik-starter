import { component$, QRL, Signal } from '@qwik.dev/core';
import { NumberOperators, SortOrder, StringOperators } from '~/generated/graphql';
/**
 * The key will be the selectedValue, and the label will be the display value
 * E.g. {
 *  recent: { label: 'Most recent'},
 *  oldest: { label: 'Oldest first'}
 * }
 *
 * E.g. {
 *  '5': { label: '5' },
 *  '10': { label: '10' }
 * }
 */
export type GeneralSelectOption = {
	[key: string]: {
		label: string;
		sort?: { [key: string]: SortOrder };
		filter?: { [key: string]: NumberOperators | StringOperators };
		take?: number;
		skip?: number;
	};
};

interface GeneralSelectorProps {
	options: GeneralSelectOption;
	selectedValue: Signal<string>;
	onChange$?: QRL<() => void>;
	className?: string;
}

/**
 * GeneralSelector
 * A small wrapper around a native <select> that binds to a Qwik Signal
 * and optionally invokes an onChange$ QRL after updates.
 */
export default component$<GeneralSelectorProps>(
	({ options, selectedValue, onChange$, className }) => {
		return (
			<select
				value={selectedValue.value}
				class={`border rounded-md text-sm font-medium text-gray-500 gap-2 py-0 h-6 ${className || ''}`}
				onChange$={async (e) => {
					selectedValue.value = (e.target as HTMLSelectElement).value;
					if (onChange$) await onChange$();
				}}
			>
				{Object.entries(options).map(([key, option]) => (
					<option key={key} value={key}>
						{option.label}
					</option>
				))}
			</select>
		);
	}
);
