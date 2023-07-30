import type { CodegenConfig } from '@graphql-codegen/cli';
import { DEV_API, LOCAL_API, PROD_API } from './src/constants';

let GRAPHQL_API = import.meta.env.IS_DEV
	? DEV_API
	: import.meta.env.IS_LOCAL
	? LOCAL_API
	: PROD_API;
GRAPHQL_API = `${GRAPHQL_API}/admin-api`;

const config: CodegenConfig = {
	schema: [GRAPHQL_API, 'type Mutation { createStripePaymentIntent: String }'],
	documents: ['"src/providers/admin/**/*.{ts,tsx}"', '!src/generated/*'],
	generates: {
		'src/generated/graphql-admin.ts': {
			config: {
				enumsAsConst: true,
			},
			plugins: ['typescript', 'typescript-operations', 'typescript-generic-sdk'],
		},
		'src/generated/schema-admin.graphql': {
			plugins: ['schema-ast'],
		},
	},
};

export default config;
