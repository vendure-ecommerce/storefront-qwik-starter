import { component$ } from '@builder.io/qwik';
import ShippingAddressCard from '~/components/account/ShippingAddressCard';

const tmpAddress = {
	fullName: 'John Doe',
	company: 'Acme Corp',
	streetLine1: '123 Main St',
	streetLine2: 'Apt 4B',
	city: 'Metropolis',
	province: 'NY',
	postalCode: '12345',
	country: 'USA',
	countryCode: 'US',
	phoneNumber: '555-1234',
};

export default component$(() => {
	return (
		<>
			<ShippingAddressCard
				address={tmpAddress}
				onEditSaved$={async (address) => {
					console.log('Selected address:', address);
					await setTimeout(() => {}, 1000); // Let the DOM update before closing
				}}
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
