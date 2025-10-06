import { component$ } from '@qwik.dev/core';
import { Action } from '@qwik.dev/router';

interface FormInputProps<T extends Action<any, any, any>> {
	name: string;
	label: string;
	formAction: ReturnType<T>;
	autoComplete?: string;
	defaults?: any;
	className?: string;
}

export default component$<FormInputProps<Action<any, any, any>>>(
	({ name, label, formAction, autoComplete, defaults, className }) => {
		const fieldErrors = formAction.value?.fieldErrors as
			| Record<string, string | undefined>
			| undefined;
		const error = fieldErrors?.[name as string];

		const defaultValue = defaults ? defaults[name] ?? '' : '';

		return (
			<div class={className || ''}>
				<label for={name as string} class="block text-sm font-medium text-gray-700">
					{label}
				</label>
				<div class="mt-1">
					<input
						type="text"
						id={name as string}
						name={name as string}
						value={defaultValue as string}
						autoComplete={autoComplete}
						class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
					/>
				</div>
				{error && renderError(error)}
			</div>
		);
	}
);
const renderError = (errorMessage: string | undefined) => {
	if (!errorMessage) return null;
	return <p class="error text-xs text-red-600 mt-1 ">{errorMessage}</p>;
};
