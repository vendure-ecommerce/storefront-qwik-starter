// import { type LogicalOperator } from '~/generated/graphql';
// import { getSdk as getAdminSdk } from '~/generated/graphql-admin';
// import { getSdk as getShopSdk, LanguageCode } from '~/generated/graphql-shop';
// import { esrequester } from '~/utils/esapi';
// import { frrequester } from '~/utils/frapi';
// import { derequester } from '~/utils/deapi';
// import { itrequester } from '~/utils/itapi';
// import { requester } from '~/utils/api';

// export type SortDirection = 'DESC' | 'ASC';

// export interface Options {
//     languageCode: string;
//     channelToken?: string;
//     token?: string;
//     apiUrl?: string;
//     take?: number;
//     sort?: {
//         updatedAt?: SortDirection;
//         createdAt?: SortDirection;
//         totalWithTax?: SortDirection;
//         totalQuantity?: SortDirection;
//     };
//     skip?: number;
//     filter?: { [name: string]: { [operator: string]: number | string } };
//     filterOperator?: LogicalOperator;
// }

// // Create SDK instances for each language
// export const shopSdk = {
//     esrequester: getShopSdk<Options>(esrequester),
//     itrequester: getShopSdk<Options>(itrequester),
//     frrequester: getShopSdk<Options>(frrequester),
//     derequester: getShopSdk<Options>(derequester),
//     requester: getShopSdk<Options>(requester)
// };

// export const adminSdk = {
//     esrequester: getAdminSdk<Options>(esrequester),
//     itrequester: getAdminSdk<Options>(itrequester),
//     frrequester: getAdminSdk<Options>(frrequester),
//     derequester: getAdminSdk<Options>(derequester),
//     requester: getAdminSdk<Options>(requester)
// };

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
export const shopSdk = getShopSdk<Options>(requester);
// @ts-ignore
export const esShopSdk = getShopSdk<Options>(esrequester);
// @ts-ignore
export const frShopSdk = getShopSdk<Options>(frrequester);
// @ts-ignore
export const deShopSdk = getShopSdk<Options>(derequester);
// @ts-ignore
export const itShopSdk = getShopSdk<Options>(itrequester);

// @ts-ignore
export const adminSdk = getAdminSdk<Options>(requester);
// @ts-ignore
export const esAdminSdk = getAdminSdk<Options>(esrequester);
// @ts-ignore
export const frAdminSdk = getAdminSdk<Options>(frrequester);
// @ts-ignore
export const deAdminSdk = getAdminSdk<Options>(derequester);
// @ts-ignore
export const itAdminSdk = getAdminSdk<Options>(itrequester);
