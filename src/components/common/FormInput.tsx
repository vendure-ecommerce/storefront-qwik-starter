import { component$, Slot } from '@builder.io/qwik';
import { Action } from '@builder.io/qwik-city';
import { LuMail, LuPhone } from '@qwikest/icons/lucide';

interface FormInputProps<T extends Action<any, any, any>> {
	name: string;
	label: string;
	formAction: ReturnType<T>;
	autoComplete?: string;
	defaults?: any;
	className?: string;
	as?: 'text' | 'textarea' | 'email' | 'tel';
	readOnly?: boolean;
}

/**
 * A reusable form input component that integrates with Qwik's form actions.
 * @prop name: The name of the input field, which should match the corresponding field in the form action.
 * @prop label: The label text for the input field. (This should be localized when used.). This is what user will see.
 * @prop formAction: The form action object returned by a Qwik form action hook (e.g., useMyFormAction).
 * @prop autoComplete: Optional autocomplete attribute for the input field.
 * @prop defaults: Optional object containing default values for the form fields.
 *  Note that defaults.[name] will be used as the default value for this input field.
 * @prop className: Optional additional CSS classes to apply to the container div.
 *
 * @example
 *
 * import {  component$ } from '@builder.io/qwik';
 * import { Form, globalAction$, z, zod$ } from '@builder.io/qwik-city';
 * import FormInput from '~/utils/FormInput';
 *
 * export const useContactFormAction = globalAction$(
 *   async (data) => {
 *     return { success: true, data };
 *   },
 *   zod$({
 *     emailAddress: z.string().min(1).email(),
 *   })
 * );
 *
 * export default component$(() => {
 *   const action = useContactFormAction();
 *   return (
 *     <Form action={action}>
 *       <FormInput
 *         name="email"
 *         label="Email"
 *         formAction={action}
 *       autoComplete="email"
 *       defaults={{ email: 'user@example.com' }}
 *     />
 *     <button type="submit">Submit</button>
 *    </Form>
 *   );
 */
export default component$<FormInputProps<Action<any, any, any>>>(
	({
		name,
		label,
		formAction,
		autoComplete,
		defaults,
		className,
		as = 'text',
		readOnly = false,
	}) => {
		const fieldErrors = formAction.value?.fieldErrors as
			| Record<string, string | undefined>
			| undefined;
		const error = fieldErrors?.[name as string];

		const defaultValue = defaults ? defaults[name] ?? '' : '';

		return (
			<div class={`mb-2 ${className ?? ''}`}>
				<div class="flex gap-4">
					<label for={name as string} class="block text-sm font-medium">
						{label}
					</label>
					<Slot />
				</div>
				<div class="mt-1">
					{as === 'textarea' ? (
						<textarea
							id={name as string}
							name={name as string}
							defaultValue={defaultValue as string}
							rows={6}
							class={`textarea`}
						/>
					) : (
						<label class="input">
							{as === 'email' && <LuMail class="w-5 h-5" />}
							{as === 'tel' && <LuPhone class="w-5 h-5" />}
							<input
								type={as}
								id={name as string}
								name={name as string}
								value={defaultValue as string}
								autoComplete={autoComplete}
								class={`
									input
									${readOnly ? 'cursor-not-allowed' : ''}
									${className ?? ''}`}
								readOnly={readOnly}
							/>
						</label>
					)}
				</div>
				{error && renderError(error)}
			</div>
		);
	}
);
const renderError = (errorMessage: string | undefined) => {
	if (!errorMessage) return null;
	return <p class="error text-xs text-error mt-1 ">{errorMessage}</p>;
};
