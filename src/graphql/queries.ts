export const getCollectionsQuery = () => ({
	variables: {},
	query: `
  query collections {
    collections {
      items {
        id
        name
        slug
        parent {
          name
        }
        featuredAsset {
          id
          preview
        }
      }
    }
  }
`,
});

export const getCollectionQuery = (slug: string) => ({
	variables: { slug },
	query: `
  query collection($slug: String, $id: ID) {
    collection(slug: $slug, id: $id) {
      id
      name
      slug
      breadcrumbs {
        id
        name
        slug
      }
      children {
        id
        name
        slug
        featuredAsset {
          id
          preview
        }
      }
    }
  }
`,
});

export const searchQueryWithCollectionSlug = (collectionSlug: string) =>
	searchQuery(collectionSlug);

export const searchQueryWithTerm = (term: string, facetValueIds: string[]) =>
	searchQuery(undefined, term, facetValueIds);

const searchQuery = (
	collectionSlug: string | undefined,
	term?: string,
	facetValueIds?: string[]
) => ({
	variables: {
		input: { groupByProduct: true, term, facetValueIds: facetValueIds, collectionSlug },
	},
	query: `
  query search($input: SearchInput!) {
    search(input: $input) {
      totalItems
      items {
        ...ListedProduct
      }
      facetValues {
        count
        facetValue {
          id
          name
          facet {
            id
            name
          }
        }
      }
    }
  }

  fragment ListedProduct on SearchResult {
    productId
    productName
    slug
    productAsset {
      id
      preview
    }
    currencyCode
    priceWithTax {
      ... on PriceRange {
        min
        max
      }
      ... on SinglePrice {
        value
      }
    }
  }  
`,
});

export const getProductQuery = (variables: { slug: string }) => ({
	variables,
	query: `
  query product($slug: String, $id: ID) {
    product(slug: $slug, id: $id) {
      ...DetailedProduct
    }
  }

  fragment DetailedProduct on Product {
    id
    name
    description
    collections {
      id
      slug
      name
      breadcrumbs {
        id
        name
        slug
      }
    }
    facetValues {
      facet {
        id
        code
        name
      }
      id
      code
      name
    }
    featuredAsset {
      id
      preview
    }
    assets {
      id
      preview
    }
    variants {
      id
      name
      priceWithTax
      currencyCode
      sku
      stockLevel
      featuredAsset {
        id
        preview
      }
    }
  }
`,
});

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

// customer

export const getActiveCustomerQuery = () => ({
	variables: {},
	query: `
    query activeCustomer {
        activeCustomer {
            id
            firstName
            lastName
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
