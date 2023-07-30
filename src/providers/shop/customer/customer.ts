import gql from 'graphql-tag';
import {
	ActiveCustomerAddressesQuery,
	ActiveCustomerOrdersQuery,
	ActiveCustomerOrdersQueryVariables,
	ActiveCustomerQuery,
	CreateAddressInput,
	Customer,
	UpdateAddressInput,
	UpdateCustomerPasswordMutationMutation,
} from '~/generated/graphql';
import { shopSdk } from '~/graphql-wrapper';

export const getActiveCustomerQuery = async () => {
	return shopSdk
		.activeCustomer()
		.then((res: ActiveCustomerQuery) => res.activeCustomer as Customer);
};

export const getActiveCustomerAddressesQuery = async () => {
	return shopSdk
		.activeCustomerAddresses()
		.then((res: ActiveCustomerAddressesQuery) => res.activeCustomer as Customer);
};

export const updateCustomerPasswordMutation = async (
	currentPassword: string,
	newPassword: string
) => {
	return shopSdk
		.updateCustomerPasswordMutation({ currentPassword, newPassword })
		.then((res: UpdateCustomerPasswordMutationMutation) => res.updateCustomerPassword);
};

export const deleteCustomerAddressMutation = async (id: string) => {
	return shopSdk.deleteCustomerAddress({ id });
};

export const getActiveCustomerOrdersQuery = async () => {
	const variables: ActiveCustomerOrdersQueryVariables = {
		options: {
			filter: {
				active: {
					eq: false,
				},
			},
			sort: {
				createdAt: 'DESC',
			},
		},
	};
	return shopSdk
		.activeCustomerOrders(variables)
		.then((res: ActiveCustomerOrdersQuery) => res.activeCustomer as Customer);
};

export const updateCustomerAddressMutation = async (
	input: UpdateAddressInput,
	token: string | undefined
) => {
	console.log(token);
	return shopSdk.updateCustomerAddressMutation({ input }, { token });
};

export const createCustomerAddressMutation = (
	input: CreateAddressInput,
	token: string | undefined
) => {
	return shopSdk.createCustomerAddressMutation({ input }, { token });
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
	query activeCustomer {
		activeCustomer {
			id
			title
			firstName
			lastName
			emailAddress
			phoneNumber
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

gql`
	query activeCustomerOrders($options: OrderListOptions) {
		activeCustomer {
			id
			orders(options: $options) {
				items {
					id
					code
					state
					totalWithTax
					currencyCode
					lines {
						featuredAsset {
							preview
						}
						productVariant {
							name
						}
					}
				}
				totalItems
			}
		}
	}
`;

gql`
	mutation updateCustomerPasswordMutation($currentPassword: String!, $newPassword: String!) {
		updateCustomerPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
			... on Success {
				success
				__typename
			}
			...ErrorResult
			__typename
		}
	}

	fragment ErrorResult on ErrorResult {
		errorCode
		message
		__typename
	}
`;

gql`
	mutation deleteCustomerAddress($id: ID!) {
		deleteCustomerAddress(id: $id) {
			success
		}
	}
`;

gql`
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
`;

gql`
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
`;
