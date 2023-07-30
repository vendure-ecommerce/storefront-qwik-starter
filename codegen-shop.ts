import type { CodegenConfig } from '@graphql-codegen/cli';
import { DEV_API, LOCAL_API, PROD_API } from './src/constants';

let GRAPHQL_API = import.meta.env.IS_DEV
	? DEV_API
	: import.meta.env.IS_LOCAL
	? LOCAL_API
	: PROD_API;

GRAPHQL_API = `${GRAPHQL_API}/shop-api`;

const config: CodegenConfig = {
	schema: [
		GRAPHQL_API,
		'type Mutation { createStripePaymentIntent: String }',
		'type Query { generateBraintreeClientToken(orderId: ID, includeCustomerId: Boolean): String }',
	],
	documents: ['"src/providers/shop/**/*.{ts,tsx}"', '!src/generated/*'],
	generates: {
		'src/generated/graphql-shop.ts': {
			config: {
				enumsAsConst: true,
			},
			plugins: ['typescript', 'typescript-operations', 'typescript-generic-sdk'],
		},
		'src/generated/schema-shop.graphql': {
			plugins: ['schema-ast'],
		},
	},
};

export default config;
