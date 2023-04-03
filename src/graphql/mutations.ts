import { ShippingAddress } from '~/types';

export const updateCustomerAddressMutation = (input: ShippingAddress) => {
	const {
		id,
		city,
		company,
		countryCode,
		fullName,
		phoneNumber,
		postalCode,
		province,
		streetLine1,
		streetLine2,
	} = input;
	return {
		variables: {
			input: {
				id,
				city,
				company,
				countryCode,
				fullName,
				phoneNumber,
				postalCode,
				province,
				streetLine1,
				streetLine2,
			},
		},
		query: `
		mutation updateCustomerAddressMutation($input: UpdateAddressInput!) {
			updateCustomerAddress(input: $input) {
				...Address
				__typename
			}
		}
		
		fragment Address on Address {
			id
			fullName
			company
			streetLine1
			streetLine2
			city
			province
			postalCode
			country {
				id
				code
				name
				__typename
			}
			phoneNumber
			defaultShippingAddress
			defaultBillingAddress
			__typename
		}
`,
	};
};

export const createCustomerAddressMutation = (input: ShippingAddress) => {
	const {
		city,
		company,
		countryCode,
		fullName,
		phoneNumber,
		postalCode,
		province,
		streetLine1,
		streetLine2,
	} = input;
	return {
		variables: {
			input: {
				city,
				company,
				countryCode,
				fullName,
				phoneNumber,
				postalCode,
				province,
				streetLine1,
				streetLine2,
			},
		},
		query: `
		mutation createCustomerAddressMutation($input: CreateAddressInput!) {
			createCustomerAddress(input: $input) {
				...Address
				__typename
			}
		}

		fragment Address on Address {
			id
			fullName
			company
			streetLine1
			streetLine2
			city
			province
			postalCode
			country {
				id
				code
				name
				__typename
			}
			phoneNumber
			defaultShippingAddress
			defaultBillingAddress
			__typename
		}
`,
	};
};
