import { getSdk } from '~/generated/graphql';
import { requester } from '~/utils/api';

export interface Options {
	token?: string;
}

// @ts-ignore
export const sdk = getSdk<Options>(requester);
