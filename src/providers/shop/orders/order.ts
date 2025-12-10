import gql from 'graphql-tag';
import {
	ActiveOrderQuery,
	AddItemToOrderMutation,
	CreateAddressInput,
	CreateCustomerInput,
	Order,
	OrderByCodeQuery,
	RemoveOrderLineMutation,
	SetCustomerForOrderMutation,
	SetOrderShippingAddressMutation,
	SetOrderShippingMethodMutation,
	UpdateOrderInput,
} from '~/generated/graphql';
import {
	ApplyCouponCodeMutation,
	OrderLineCustomFieldsInput,
	RemoveCouponCodeMutation,
	SetOrderCustomFieldsMutation,
} from '~/generated/graphql-shop';
import { shopSdk } from '~/graphql-wrapper';
import { handleGqlResult } from '~/utils';

/**
 * Async generic helper to normalize GraphQL mutation results which may return
 * either a success payload or an ErrorResult (with errorCode/message).
 * Accepts either a value or a promise and returns the success value T on
 * success, or null on error (after logging).
 */
// Removed local handleMutationResult function

export const getActiveOrderQuery = async () => {
	return handleGqlResult<Order>(
		shopSdk.activeOrder(undefined).then((res: ActiveOrderQuery) => res.activeOrder)
	);
};

export const getOrderByCodeQuery = async (code: string) => {
	return handleGqlResult<Order>(
		shopSdk.orderByCode({ code }).then((res: OrderByCodeQuery) => res.orderByCode)
	);
};

export const addItemToOrderMutation = async (
	productVariantId: string,
	quantity: number,
	customFields?: OrderLineCustomFieldsInput | undefined
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
	return handleGqlResult<Order>(
		shopSdk
			.removeOrderLine({ orderLineId: lineId })
			.then((res: RemoveOrderLineMutation) => res.removeOrderLine)
	);
};

/**
 * If there is error in the mutation, it will be returned as well. E.g. if out of stock
 * it will return the ErrorResult. i.e. {errorCode, message}
 * @param lineId
 * @param quantity
 * @returns
 */
export const adjustOrderLineMutation = async (lineId: string, quantity: number) => {
	const res = await shopSdk.adjustOrderLine({ orderLineId: lineId, quantity });
	return res.adjustOrderLine;
};

export const setOrderShippingAddressMutation = async (input: CreateAddressInput) => {
	return handleGqlResult<Order>(
		shopSdk
			.setOrderShippingAddress({ input })
			.then((res: SetOrderShippingAddressMutation) => res.setOrderShippingAddress)
	);
};

export const setOrderShippingMethodMutation = async (shippingMethodId: string[]) => {
	return handleGqlResult<Order>(
		shopSdk
			.setOrderShippingMethod({ shippingMethodId })
			.then((res: SetOrderShippingMethodMutation) => res.setOrderShippingMethod)
	);
};

export const setCustomerForOrderMutation = async (input: CreateCustomerInput) => {
	return handleGqlResult<Order>(
		shopSdk
			.setCustomerForOrder({ input })
			.then((res: SetCustomerForOrderMutation) => res.setCustomerForOrder)
	);
};

export const applyCouponCodeMutation = async (couponCode: string) => {
	return shopSdk
		.applyCouponCode({ couponCode })
		.then((res: ApplyCouponCodeMutation) => res.applyCouponCode);
};

export const removeCouponCodeMutation = async (couponCode: string) => {
	return handleGqlResult<Order>(
		shopSdk
			.removeCouponCode({ couponCode })
			.then((res: RemoveCouponCodeMutation) => res.removeCouponCode)
	);
};

export const batchUpdateShippoFulfillmentStateMutation = async () => {
	return handleGqlResult<any>(
		shopSdk
			.batchUpdateShippoFulfillmentState()
			.then((res: any) => res.batchUpdateShippoFulfillmentState)
	);
};

export const setOrderCustomFieldsMutation = async (input: UpdateOrderInput) => {
	return handleGqlResult<Order>(
		shopSdk
			.setOrderCustomFields({ input })
			.then((res: SetOrderCustomFieldsMutation) => res.setOrderCustomFields)
	);
};

gql`
	mutation setOrderCustomFields($input: UpdateOrderInput!) {
		setOrderCustomFields(input: $input) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

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
					name
					slug
					customFields {
						customizableClass
					}
				}
			}
			customFields {
				customizableOptionJson
			}
		}
		customFields {
			promisedArrivalDays
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
	mutation batchUpdateShippoFulfillmentState {
		batchUpdateShippoFulfillmentState {
			... on UpdateFulfillmentStateError {
				errorCode
				message
			}
			... on UpdateFulfillmentStateSuccess {
				success
				message
				numFulfillmentsUpdated
			}
		}
	}
`;
