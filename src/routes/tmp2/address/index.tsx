import { $, component$, useSignal, useStore } from '@qwik.dev/core';
import { AddressForm } from '~/components/address-form/AddressFormV2';
import { Button } from '~/components/buttons/Button';

export default component$(() => {
	const open = useSignal(true);
	const streeline1 = useSignal<string | undefined>('');
	const addr = useStore<any>({});
	return (
		<>
			<div>
				<Button
					onClick$={() => {
						open.value = true;
					}}
				>
					Edit Address
				</Button>
				<AddressForm
					open={open}
					onForward$={$((data) => {
						console.log('Address from child:', data);
						streeline1.value = data.streetLine1;
						open.value = false;
					})}
				/>
				<p>{streeline1.value}</p>
			</div>
		</>
	);
});

// import { component$ } from '@qwik.dev/core';
// import { TestForm } from '~/components/address-form/TestFormV2';

// export default component$(() => {
//   return (
//     <TestForm />
//   );
// });
