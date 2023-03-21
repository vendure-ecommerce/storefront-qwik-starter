import { ActiveCustomer, ShippingAddress } from '~/types';

export const addItemToOrderMutation = (productVariantId: string, quantity: number) => ({
	variables: {
		productVariantId,
		quantity,
	},
	query: `
	mutation addItemToOrder($productVariantId: ID!, $quantity: Int!) {
	 addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}

	fragment OrderDetail on Order {
		__typename
		id
		code
		active
		createdAt
		state
		currencyCode
		totalQuantity
		subTotal
		subTotalWithTax
		taxSummary {
			description
			taxRate
			taxTotal
		}
		shippingWithTax
		totalWithTax
		customer {
			id
			firstName
			lastName
			emailAddress
		}
		shippingAddress {
			fullName
			streetLine1
			streetLine2
			company
			city
			province
			postalCode
			countryCode
			phoneNumber
		}
		shippingLines {
			shippingMethod {
				id
				name
			}
			priceWithTax
		}
		lines {
			id
			unitPriceWithTax
			linePriceWithTax
			quantity
			featuredAsset {
				id
				preview
			}
			productVariant {
				id
				name
				price
				product {
					id
					slug
				}
			}
		}
	}
`,
});

export const removeOrderLineMutation = (orderLineId: string) => ({
	variables: { orderLineId },
	query: `
	mutation removeOrderLine($orderLineId: ID!) {
		removeOrderLine(orderLineId: $orderLineId) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}

	fragment OrderDetail on Order {
		__typename
		id
		code
		active
		createdAt
		state
		currencyCode
		totalQuantity
		subTotal
		subTotalWithTax
		taxSummary {
			description
			taxRate
			taxTotal
		}
		shippingWithTax
		totalWithTax
		customer {
			id
			firstName
			lastName
			emailAddress
		}
		shippingAddress {
			fullName
			streetLine1
			streetLine2
			company
			city
			province
			postalCode
			countryCode
			phoneNumber
		}
		shippingLines {
			shippingMethod {
				id
				name
			}
			priceWithTax
		}
		lines {
			id
			unitPriceWithTax
			linePriceWithTax
			quantity
			featuredAsset {
				id
				preview
			}
			productVariant {
				id
				name
				price
				product {
					id
					slug
				}
			}
		}
	}
`,
});

export const adjustOrderLineMutation = (orderLineId: string, quantity: number) => ({
	variables: { orderLineId, quantity },
	query: `
	mutation adjustOrderLine($orderLineId: ID!, $quantity: Int!) {
		adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
			...OrderDetail
			... on ErrorResult {
					errorCode
					message
			}
		}
	}
	
	fragment OrderDetail on Order {
		__typename
		id
		code
		active
		createdAt
		state
		currencyCode
		totalQuantity
		subTotal
		subTotalWithTax
		taxSummary {
			description
			taxRate
			taxTotal
		}
		shippingWithTax
		totalWithTax
		customer {
			id
			firstName
			lastName
			emailAddress
		}
		shippingAddress {
			fullName
			streetLine1
			streetLine2
			company
			city
			province
			postalCode
			countryCode
			phoneNumber
		}
		shippingLines {
			shippingMethod {
					id
					name
			}
			priceWithTax
		}
		lines {
			id
			unitPriceWithTax
			linePriceWithTax
			quantity
			featuredAsset {
					id
					preview
			}
			productVariant {
					id
					name
					price
					product {
							id
							slug
					}
			}
		}
	}
`,
});

export const updateCustomerPasswordMutation = (currentPassword: string, newPassword: string) => ({
	variables: { currentPassword, newPassword },
	query: `
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
`,
});

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

export const deleteCustomerAddressMutation = (id: string) => ({
	variables: { id },
	query: `
	mutation deleteCustomerAddress($id: ID!) {
		deleteCustomerAddress(id: $id) {
			success
		}
	}
`,
});

export const setCustomerForOrderMutation = ({
	emailAddress,
	firstName,
	lastName,
}: Omit<ActiveCustomer, 'id'>) => ({
	variables: { input: { emailAddress, firstName, lastName } },
	query: `
	mutation setCustomerForOrder($input: CreateCustomerInput!) {
		setCustomerForOrder(input: $input) {
			...OrderDetail
			... on ErrorResult {
					errorCode
					message
			}
		}
	}

	fragment OrderDetail on Order {
		__typename
		id
		code
		active
		createdAt
		state
		currencyCode
		totalQuantity
		subTotal
		subTotalWithTax
		taxSummary {
			description
			taxRate
			taxTotal
		}
		shippingWithTax
		totalWithTax
		customer {
			id
			firstName
			lastName
			emailAddress
		}
		shippingAddress {
			fullName
			streetLine1
			streetLine2
			company
			city
			province
			postalCode
			countryCode
			phoneNumber
		}
		shippingLines {
			shippingMethod {
				id
				name
			}
			priceWithTax
		}
		lines {
			id
			unitPriceWithTax
			linePriceWithTax
			quantity
			featuredAsset {
				id
				preview
			}
			productVariant {
				id
				name
				price
				product {
					id
					slug
			}
			}
		}
	}
`,
});

export const setOrderShippingMethodMutation = (shippingMethodId: string) => ({
	variables: { shippingMethodId },
	query: `
	mutation setOrderShippingMethod($shippingMethodId: ID!) {
		setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
			...OrderDetail
			... on ErrorResult {
					errorCode
					message
			}
		}
	}
		
	fragment OrderDetail on Order {
		__typename
		id
		code
		active
		createdAt
		state
		currencyCode
		totalQuantity
		subTotal
		subTotalWithTax
		taxSummary {
			description
			taxRate
			taxTotal
		}
		shippingWithTax
		totalWithTax
		customer {
			id
			firstName
			lastName
			emailAddress
		}
		shippingAddress {
			fullName
			streetLine1
			streetLine2
			company
			city
			province
			postalCode
			countryCode
			phoneNumber
		}
		shippingLines {
			shippingMethod {
					id
					name
			}
			priceWithTax
		}
		lines {
			id
			unitPriceWithTax
			linePriceWithTax
			quantity
			featuredAsset {
				id
				preview
			}
			productVariant {
				id
				name
				price
				product {
						id
						slug
				}
			}
		}
	}
`,
});

export const transitionOrderToStateMutation = (state = 'ArrangingPayment') => ({
	variables: { state },
	query: `
	mutation transitionOrderToState($state: String!) {
		transitionOrderToState(state: $state) {
				...OrderDetail
				... on ErrorResult {
						errorCode
						message
				}
		}
	}

	fragment OrderDetail on Order {
		__typename
		id
		code
		active
		createdAt
		state
		currencyCode
		totalQuantity
		subTotal
		subTotalWithTax
		taxSummary {
			description
			taxRate
			taxTotal
		}
		shippingWithTax
		totalWithTax
		customer {
			id
			firstName
			lastName
			emailAddress
		}
		shippingAddress {
			fullName
			streetLine1
			streetLine2
			company
			city
			province
			postalCode
			countryCode
			phoneNumber
		}
		shippingLines {
			shippingMethod {
				id
				name
			}
			priceWithTax
		}
		lines {
			id
			unitPriceWithTax
			linePriceWithTax
			quantity
			featuredAsset {
				id
				preview
			}
			productVariant {
				id
				name
				price
				product {
					id
					slug
				}
			}
		}
	} 
`,
});

export const addPaymentToOrderMutation = (
	input = { method: 'standard-payment', metadata: {} }
) => ({
	variables: { input },
	query: `
	mutation addPaymentToOrder($input: PaymentInput!) {
		addPaymentToOrder(input: $input) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
	
	fragment OrderDetail on Order {
		__typename
		id
		code
		active
		createdAt
		state
		currencyCode
		totalQuantity
		subTotal
		subTotalWithTax
		taxSummary {
			description
			taxRate
			taxTotal
		}
		shippingWithTax
		totalWithTax
		customer {
			id
			firstName
			lastName
			emailAddress
		}
		shippingAddress {
			fullName
			streetLine1
			streetLine2
			company
			city
			province
			postalCode
			countryCode
			phoneNumber
		}
		shippingLines {
			shippingMethod {
				id
				name
			}
			priceWithTax
		}
		lines {
			id
			unitPriceWithTax
			linePriceWithTax
			quantity
			featuredAsset {
				id
				preview
			}
			productVariant {
				id
				name
				price
				product {
					id
					slug
				}
			}
		}
	}
`,
});

export const setOrderShippingAddressMutation = (input: ShippingAddress) => ({
	variables: { input },
	query: `	
	mutation setOrderShippingAddress($input: CreateAddressInput!) {
		setOrderShippingAddress(input: $input) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}

	fragment OrderDetail on Order {
		__typename
		id
		code
		active
		createdAt
		state
		currencyCode
		totalQuantity
		subTotal
		subTotalWithTax
		taxSummary {
			description
			taxRate
			taxTotal
		}
		shippingWithTax
		totalWithTax
		customer {
			id
			firstName
			lastName
			emailAddress
		}
		shippingAddress {
			fullName
			streetLine1
			streetLine2
			company
			city
			province
			postalCode
			countryCode
			phoneNumber
		}
		shippingLines {
			shippingMethod {
				id
				name
			}
			priceWithTax
		}
		lines {
			id
			unitPriceWithTax
			linePriceWithTax
			quantity
			featuredAsset {
				id
				preview
			}
			productVariant {
				id
				name
				price
				product {
					id
					slug
				}
			}
		}
		payments {
			id
			state
			method
			amount
			metadata
		}
	}
`,
});
