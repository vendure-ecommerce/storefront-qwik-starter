import gql from 'graphql-tag';
import { sdk } from '~/graphql-wrapper';
import {
	ActiveOrderQuery,
	AddItemToOrderMutation,
	AdjustOrderLineMutation,
	CreateAddressInput,
	CreateCustomerInput,
	Order,
	RemoveOrderLineMutation,
	SetCustomerForOrderMutation,
	SetOrderShippingAddressMutation,
	SetOrderShippingMethodMutation,
} from '~/generated/graphql';

export const getActiveOrderQuery = async () => {
	return sdk.activeOrder(undefined).then((res: ActiveOrderQuery) => res.activeOrder as Order);
};

export const addItemToOrderMutation = async (productVariantId: string, quantity: number) => {
	return sdk
		.addItemToOrder({ productVariantId, quantity })
		.then((res: AddItemToOrderMutation) => res.addItemToOrder);
};

export const removeOrderLineMutation = async (lineId: string) => {
	return sdk
		.removeOrderLine({ orderLineId: lineId })
		.then((res: RemoveOrderLineMutation) => res.removeOrderLine as Order);
};

export const adjustOrderLineMutation = async (lineId: string, quantity: number) => {
	return sdk
		.adjustOrderLine({ orderLineId: lineId, quantity })
		.then((res: AdjustOrderLineMutation) => res.adjustOrderLine as Order);
};

export const setOrderShippingAddressMutation = async (input: CreateAddressInput) => {
	return sdk
		.setOrderShippingAddress({ input })
		.then((res: SetOrderShippingAddressMutation) => res.setOrderShippingAddress);
};

export const setOrderShippingMethodMutation = async (shippingMethodId: string) => {
	return sdk
		.setOrderShippingMethod({ shippingMethodId })
		.then((res: SetOrderShippingMethodMutation) => res.setOrderShippingMethod as Order);
};

export const setCustomerForOrderMutation = async (input: CreateCustomerInput) => {
	return sdk
		.setCustomerForOrder({ input })
		.then((res: SetCustomerForOrderMutation) => res.setCustomerForOrder);
};

gql`
	mutation setOrderShippingAddress($input: CreateAddressInput!) {
		setOrderShippingAddress(input: $input) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation setCustomerForOrder($input: CreateCustomerInput!) {
		setCustomerForOrder(input: $input) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation addItemToOrder($productVariantId: ID!, $quantity: Int!) {
		addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation setOrderShippingMethod($shippingMethodId: ID!) {
		setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
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
`;

gql`
	mutation adjustOrderLine($orderLineId: ID!, $quantity: Int!) {
		adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation removeOrderLine($orderLineId: ID!) {
		removeOrderLine(orderLineId: $orderLineId) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	query activeOrder {
		activeOrder {
			...OrderDetail
		}
	}
`;
