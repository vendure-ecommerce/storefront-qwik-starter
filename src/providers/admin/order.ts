import gql from 'graphql-tag';
import type { OrderList, OrdersQuery } from '~/generated/graphql-admin';
import type { Options } from '~/graphql-wrapper';
import { adminSdk } from '~/graphql-wrapper';

export const getOrdersQuery = async (options?: Options) => {
	return adminSdk.orders({ options: { sort: options?.sort } }, options).then((res: OrdersQuery) => {
		return res?.orders as OrderList;
	});
};

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
				code
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
	query orders($options: OrderListOptions) {
		orders(options: $options) {
			items {
				...OrderDetail
			}
		}
	}
`;
