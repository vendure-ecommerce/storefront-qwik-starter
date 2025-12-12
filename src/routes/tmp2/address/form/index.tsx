import { component$, useSignal } from '@builder.io/qwik';
import { AddressForm } from '~/components/address-form/AddressFormV2';

export default component$(() => {
	const openEditForm = useSignal(false);
	return (
		<>
			<button onClick$={() => (openEditForm.value = true)}>Edit Address</button>
			<AddressForm
				open={openEditForm}
				prefilledAddress={undefined}
				// onForward$={undefined}
				onForward$={async (address) => {
					console.log('Selected address:', address);
					await setTimeout(() => {
						openEditForm.value = false;
					}, 1000); // Let the DOM update before closing
				}}
				// prefilledAddressWithAppState={true} --- IGNORE ---
			/>
		</>
	);
});

// import { component$ } from '@builder.io/qwik';
// import { TestForm } from '~/components/address-form/TestFormV2';

// export default component$(() => {
//   return (
//     <TestForm />
//   );
// });
