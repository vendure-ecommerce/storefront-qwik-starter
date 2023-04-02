import gql from 'graphql-tag';
import { sdk } from '~/graphql-wrapper';
import { ActiveCustomerAddressesQuery, Customer } from '~/generated/graphql';

export const getActiveCustomerAddressesQuery = async () => {
	return sdk
		.activeCustomerAddresses()
		.then((res: ActiveCustomerAddressesQuery) => res.activeCustomer as Customer);
};

gql`
	query activeCustomerAddresses {
		activeCustomer {
			id
			addresses {
				id
				fullName
				company
				streetLine1
				streetLine2
				city
				province
				postalCode
				country {
					code
				}
				phoneNumber
				defaultShippingAddress
				defaultBillingAddress
			}
		}
	}
`;

gql`
	mutation createCustomerAddress($input: CreateAddressInput!) {
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
`;
