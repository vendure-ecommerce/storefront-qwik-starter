import { component$ } from '@builder.io/qwik';
import { Form, globalAction$, z, zod$ } from '@qwik.dev/router';

export const useAddUser = globalAction$(
	async (user) => {
		// The "user" is strongly typed: { firstName: string, lastName: string }
		const userID = user.firstName + '-' + user.lastName;
		console.log('User added:', user);
		return {
			success: true,
			userID,
		};
	},
	// Zod schema is used to validate that the FormData includes "firstName" and "lastName"
	zod$({
		firstName: z.string().max(5).min(1),
		lastName: z.string().max(5).min(1),
	})
);

export const TestForm = component$(() => {
	const action = useAddUser();
	return (
		<>
			<Form action={action}>
				<input name="firstName" />
				<input name="lastName" />

				{action.value?.failed && <p>{action.value.fieldErrors?.firstName}</p>}
				<button type="submit">Add user</button>
			</Form>
			{action.value?.success && <p>User {action.value.userID} added successfully</p>}
		</>
	);
});
