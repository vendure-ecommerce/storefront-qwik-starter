// import { getSdk, type LogicalOperator } from '~/generated/graphql';
import { getSdk as getAdminSdk } from '~/generated/graphql-admin';
import { getSdk as getShopSdk, type LogicalOperator } from '~/generated/graphql-shop';
import { esrequester } from '~/utils/esapi';
import { frrequester } from '~/utils/frapi';
import { derequester } from '~/utils/deapi';
import { itrequester } from '~/utils/itapi';
import { requester } from '~/utils/api';

export type SortDirection = 'DESC' | 'ASC';

export interface Options {
	languageCode: string;
	channelToken?: string;
	// Auth bearer token
	token?: string;
	// The API URL to call. This can be the local shop API, dev shop API,
	// dev admin API, production shop API..etc.
	apiUrl?: string;
	take?: number;
	sort?: {
		updatedAt?: SortDirection;
		createdAt?: SortDirection;
		totalWithTax?: SortDirection;
		totalQuantity?: SortDirection;
	};
	skip?: number;
	filter?: { [name: string]: { [operator: string]: number | string } };
	filterOperator?: LogicalOperator;
}

// @ts-ignore
export const shopSdk = getShopSdk<Options>(
	esrequester,
	itrequester,
	frrequester,
	derequester,
	requester
);
// @ts-ignore
export const adminSdk = getAdminSdk<Options>(
	esrequester,
	itrequester,
	frrequester,
	derequester,
	requester
);
