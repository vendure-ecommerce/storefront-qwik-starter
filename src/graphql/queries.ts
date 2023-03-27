export const getActiveOrderQuery = () => ({
	variables: {},
	query: `
  query activeOrder {
    activeOrder {
      ...OrderDetail
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

export const getEligiblePaymentMethodsQuery = () => ({
	vatiables: {},
	query: `
    query eligiblePaymentMethods {
        eligiblePaymentMethods {
          name
          code
          isEligible
        }
    }
`,
});

// customer

export const getActiveCustomerQuery = () => ({
	variables: {},
	query: `
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
`,
});

export const getActiveCustomerOrdersQuery = () => ({
	variables: {
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
	},
	query: `
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
`,
});

export const getActiveCustomerAddressesQuery = () => ({
	variables: {},
	query: `
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
`,
});

// eligible shipping methods

export const getEligibleShippingMethodsQuery = () => ({
	variables: {},
	query: `
    query eligibleShippingMethods {
      eligibleShippingMethods {
        id
        name
        description
        metadata
        price
        priceWithTax
      }
    }
`,
});

// available countries

export const getAvailableCountriesQuery = () => ({
	variables: {},
	query: `
    query availableCountries {
      availableCountries {
        id
        name
        code
      }
    }
`,
});

// order by code

export const getOrderByCodeQuery = (variables: { code: string }) => ({
	variables,
	query: `
    query orderByCode($code: String!) {
      orderByCode(code: $code) {
        ...OrderDetail
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
