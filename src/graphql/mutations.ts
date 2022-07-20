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

export const removeOrderLineQuery = (orderLineId: string) => ({
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
