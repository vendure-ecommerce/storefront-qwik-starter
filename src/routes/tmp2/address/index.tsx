import { component$ } from '@qwik.dev/core';
import AddressSelector from '~/components/checkout/AddressSelector';

export default component$(() => {
	return (
		<>
			<AddressSelector
				onSelectAddress$={(address) => {
					console.log('Selected address:', JSON.stringify(address, null, 2));
				}}
			/>
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
