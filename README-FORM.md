# Form and Action in Qwik

## References

- [Qwik Doc](https://qwik.dev/docs/action/#routeaction-1)

## Overview

Basic Usuage

```typescript
import { component$ } from '@builder.io/qwik';
import { Form, globalAction$, z, zod$ } from '@qwik.dev/router';


export const useAddUser = globalAction$(
  async (user) => {
    // The "user" is strongly typed: { firstName: string, lastName: string }
    const userID = user.firstName + '-' + user.lastName;
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
      {action.value?.success && (
        <p>User {action.value.userID} added successfully</p>
      )}
    </>
  );
});
```

### Action Object

`const action = useAddUser();` and `<Form action={action}>`
These two lines connect the form in the component to the action defined. The `useAddUser` can be arbitrary named by you, but it should match the action passed to the `Form` component.

- `<button type="submit">` is used to submit the form, which will trigger the action defined by `useAddUser`.
- the `action` object contains the state of the action, including whether it is pending, completed, or failed, as well as any returned data or errors.
  - `action.value` contains the result of the action after it has been executed. It will be `undefined` initially and will be populated with the return value of the action function once the form is submitted and processed.
    - `action.value?.pending` : boolean.
    - `action.value?.failed` : boolean.
    - `action.value?.fieldErrors` contains any field-specific validation errors returned by the action.
    - `action.value?.success` : boolean.
    - In the example, after a successful submission, you will have `action.value?.userID` based on the return value of the submit handler. (See Action Hook section below)
  - `action.submit()` can be used to programmatically submit the form.

### Input fields

With the input fields defined in the form:

```html
<input name="firstName" /> <input name="lastName" />
```

When you submit the form, the values entered in these fields will be collected and passed to the action function's (see next section about action function) first argument as an object. In this case, the object will have the shape `{ firstName: string, lastName: string }`, which matches the Zod schema defined in the action.

### `Action Function`: `Action hook`,`submit handler`, and `validation schema`

The action hook, e.g. `routeAction$`, defines the server-side logic when submit (submit handler) and validation schema. ( Another way to define the action is to use `globalAction$`). Together, the action hook defines `actions`. In the example above, `useAddUser` is the Action function (or simply called `Actions` in qwik).

The first argument is the submit handler that will be executed when the form is submitted. The second argument (optional) is a Zod schema that validates the form data.

```typescript
// The following defines "Action function"
export const useAddUser = globalAction$( // Action Hook
  async (user) => {...}, // submit handler: server-side logic that will be executed on form submission
  zod$({...}) // Validation Schema using Zod
);
```

#### submit handler

Look closer into the submit handler:

```typescript
async (user) => {
	const userID = await db.users.add({
		firstName: user.firstName,
		lastName: user.lastName,
	});
	return {
		success: true,
		userID,
	};
};
```

- **Input:**

  - `Form` is responsible for collecting the form data and request context and passing them to the submit handler when the form is submitted.
  - The first argument `user` is an object that contains the form data. The shape of this object is determined by the names of the input fields in the form and validated by the Zod schema. In this case, it will be `{ firstName: string, lastName: string }`.

  - Note that `user` can be arbitrary named by you. The form data will be collected and passed to this function as an object. i.e. in the above, the form has two fields (defined with `input` tags) `firstName` and `lastName`, then `user` will be `{ firstName: string, lastName: string }`.

  - The second argument (optional)is an object of `RequestEvent`. It includes:

    - `params`: An object containing route parameters.
    - `request.headers`: An object containing request headers.
    - `cookie`: An object to manage cookies.
    - `redirect`: A function to perform HTTP redirects.
    - `url`: The URL of the request.
    - `env`: An object containing environment variables.

    - Example of using the second argument:

      ```typescript
        async (data, { cookie, redirect, url }) => {
          ...
        }
      ```

- **Output:**
  - As above-mentioned, the return of the submit handler will be available in the component via `action.value` after the form is submitted and processed. In this case, after a successful submission, you will have `action.value?.userID` based on the return value of the submit handler.
  - Note that if one doesn't define a return value, `action.value` will be `undefined` after the form is submitted and processed.
  - In this case if the form submission is successful, `action.value` will be `{ success: true, userID: number }`.

#### Props for `Form` component

The `Form` component accepts several props to customize its behavior:

- `onSubmit$`: A QRL function that is called when the form is submitted. This can be used for client-side validation or other actions before the form is sent to the server. Note that this runs BEFORE the submit handler defined in the action hook. That is, you can't access the return value of the submit handler in this function.
- `onSubmitComplete$`: A QRL function that is called after the form submission is complete, regardless of success or failure. This can be used for cleanup or additional client-side actions. Note that this runs AFTER the submit handler defined in the action hook. Hence, you can access `action.value` in this function.
