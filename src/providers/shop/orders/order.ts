import gql from 'graphql-tag';
import {
	ActiveOrderQuery,
	AddItemToOrderMutation,
	AdjustOrderLineMutation,
	CreateAddressInput,
	CreateCustomerInput,
	Order,
	OrderByCodeQuery,
	RemoveOrderLineMutation,
	SetCustomerForOrderMutation,
	SetOrderShippingAddressMutation,
	SetOrderShippingMethodMutation,
} from '~/generated/graphql';
import {
	AddItemToOrderV2Input,
	AddItemToOrderV2Mutation,
	AdjustOrderLineV2Mutation,
	ApplyCouponCodeMutation,
	OrderLineCustomFieldsInput,
	RemoveCouponCodeMutation,
	RemoveOrderLineV2Mutation,
} from '~/generated/graphql-shop';
import { shopSdk } from '~/graphql-wrapper';

export const getActiveOrderQuery = async () => {
	return shopSdk.activeOrder(undefined).then((res: ActiveOrderQuery) => res.activeOrder as Order);
};

export const getOrderByCodeQuery = async (code: string) => {
	return shopSdk.orderByCode({ code }).then((res: OrderByCodeQuery) => res.orderByCode as Order);
};

export const addItemToOrderMutation = async (
	productVariantId: string,
	quantity: number,
	customFields: OrderLineCustomFieldsInput | undefined
) => {
	return shopSdk
		.addItemToOrder({
			productVariantId,
			quantity,
			customFields: customFields ? customFields : undefined,
		})
		.then((res: AddItemToOrderMutation) => res.addItemToOrder);
};

export const removeOrderLineMutation = async (lineId: string) => {
	return shopSdk
		.removeOrderLine({ orderLineId: lineId })
		.then((res: RemoveOrderLineMutation) => res.removeOrderLine as Order);
};

export const adjustOrderLineMutation = async (lineId: string, quantity: number) => {
	return shopSdk
		.adjustOrderLine({ orderLineId: lineId, quantity })
		.then((res: AdjustOrderLineMutation) => res.adjustOrderLine as Order);
};

export const setOrderShippingAddressMutation = async (input: CreateAddressInput) => {
	return shopSdk
		.setOrderShippingAddress({ input })
		.then((res: SetOrderShippingAddressMutation) => res.setOrderShippingAddress);
};

export const setOrderShippingMethodMutation = async (shippingMethodId: string[]) => {
	return shopSdk
		.setOrderShippingMethod({ shippingMethodId })
		.then((res: SetOrderShippingMethodMutation) => res.setOrderShippingMethod as Order);
};

export const setCustomerForOrderMutation = async (input: CreateCustomerInput) => {
	return shopSdk
		.setCustomerForOrder({ input })
		.then((res: SetCustomerForOrderMutation) => res.setCustomerForOrder);
};

export const applyCouponCodeMutation = async (couponCode: string) => {
	return shopSdk
		.applyCouponCode({ couponCode })
		.then((res: ApplyCouponCodeMutation) => res.applyCouponCode);
};

export const removeCouponCodeMutation = async (couponCode: string) => {
	return shopSdk
		.removeCouponCode({ couponCode })
		.then((res: RemoveCouponCodeMutation) => res.removeCouponCode);
};

gql`
	mutation applyCouponCode($couponCode: String!) {
		applyCouponCode(couponCode: $couponCode) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation removeCouponCode($couponCode: String!) {
		removeCouponCode(couponCode: $couponCode) {
			...OrderDetail
		}
	}
`;

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
	mutation addItemToOrder(
		$productVariantId: ID!
		$quantity: Int!
		$customFields: OrderLineCustomFieldsInput
	) {
		addItemToOrder(
			productVariantId: $productVariantId
			quantity: $quantity
			customFields: $customFields
		) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation setOrderShippingMethod($shippingMethodId: [ID!]!) {
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
		couponCodes
		discounts {
			type
			description
			amountWithTax
		}
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
			customFields {
				customVariant {
					id
					customizableOptionId
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

gql`
	query orderByCode($code: String!) {
		orderByCode(code: $code) {
			...OrderDetail
		}
	}
`;

gql`
	mutation addItemToOrderV2($input: AddItemToOrderV2Input!) {
		addItemToOrderV2(input: $input) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

export const addItemToOrderV2Mutation = async (input: AddItemToOrderV2Input) => {
	return shopSdk
		.addItemToOrderV2({ input })
		.then((res: AddItemToOrderV2Mutation) => res.addItemToOrderV2);
};

gql`
	mutation adjustOrderLineV2($orderLineId: ID!, $quantity: Int!) {
		adjustOrderLineV2(orderLineId: $orderLineId, quantity: $quantity) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

export const adjustOrderLineV2Mutation = async (orderLineId: string, quantity: number) => {
	return shopSdk
		.adjustOrderLineV2({ orderLineId, quantity })
		.then((res: AdjustOrderLineV2Mutation) => res.adjustOrderLineV2 as Order);
};

gql`
	mutation removeOrderLineV2($orderLineId: ID!) {
		removeOrderLineV2(orderLineId: $orderLineId) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

export const removeOrderLineV2Mutation = async (orderLineId: string) => {
	return shopSdk
		.removeOrderLineV2({ orderLineId })
		.then((res: RemoveOrderLineV2Mutation) => res.removeOrderLineV2 as Order);
};
