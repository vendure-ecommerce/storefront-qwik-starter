import gql from 'graphql-tag';
import { sdk } from '~/graphql-wrapper';
import {
	AddPaymentToOrderMutation,
	AvailableCountriesQuery,
	Country,
	CreateStripePaymentIntentMutation,
	EligiblePaymentMethodsQuery,
	EligibleShippingMethodsQuery,
	Order,
	PaymentInput,
	PaymentMethodQuote,
	ShippingMethodQuote,
} from '~/generated/graphql';

export const getAvailableCountriesQuery = async () => {
	return sdk
		.availableCountries({})
		.then((res: AvailableCountriesQuery) => res.availableCountries as Country[]);
};

export const addPaymentToOrderMutation = async (
	input: PaymentInput = { method: 'standard-payment', metadata: {} }
) => {
	return sdk
		.addPaymentToOrder({ input })
		.then((res: AddPaymentToOrderMutation) => res.addPaymentToOrder as Order);
};

export const transitionOrderToStateMutation = async (state = 'ArrangingPayment') => {
	return sdk.transitionOrderToState({ state });
};

export const getEligibleShippingMethodsQuery = async () => {
	return sdk
		.eligibleShippingMethods()
		.then(
			(res: EligibleShippingMethodsQuery) => res.eligibleShippingMethods as ShippingMethodQuote[]
		);
};

export const getEligiblePaymentMethodsQuery = async () => {
	return sdk
		.eligiblePaymentMethods({})
		.then((res: EligiblePaymentMethodsQuery) => res.eligiblePaymentMethods as PaymentMethodQuote[]);
};

export const createStripePaymentIntentMutation = async () => {
	return sdk
		.createStripePaymentIntent()
		.then((res: CreateStripePaymentIntentMutation) => res.createStripePaymentIntent as string);
};

gql`
	query availableCountries {
		availableCountries {
			id
			name
			code
		}
	}
`;

gql`
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
`;

gql`
	mutation addPaymentToOrder($input: PaymentInput!) {
		addPaymentToOrder(input: $input) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	mutation transitionOrderToState($state: String!) {
		transitionOrderToState(state: $state) {
			...OrderDetail
			... on ErrorResult {
				errorCode
				message
			}
		}
	}
`;

gql`
	query eligiblePaymentMethods {
		eligiblePaymentMethods {
			id
			code
			name
			description
			eligibilityMessage
			isEligible
		}
	}
`;

gql`
	mutation createStripePaymentIntent {
		createStripePaymentIntent
	}
`;
