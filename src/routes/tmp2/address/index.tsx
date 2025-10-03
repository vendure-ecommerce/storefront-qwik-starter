import { component$ } from '@qwik.dev/core';
import AddressSelector from '~/components/checkout/AddressSelector';

export default component$(() => {
	return (
		<>
			<AddressSelector
				onSelectAddress$={(address) => {
					console.log('Selected address:', address);
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
