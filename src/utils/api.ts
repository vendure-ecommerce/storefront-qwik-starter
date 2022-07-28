import fetch from 'isomorphic-fetch';
import { AUTH_TOKEN } from '~/constants';
import { isClientSide } from '.';
import { localStorageGetItem, localStorageSetItem } from './local-storage';

export const execute = async <T>(body: {
	query: string;
	variables: Record<string, any>;
}): Promise<T> => {
	let headers: Record<string, string> = { 'Content-Type': 'application/json' };

	if (isClientSide()) {
		headers = { ...headers, Authorization: `Bearer ${localStorageGetItem(AUTH_TOKEN)}` };
	}
	const options = {
		method: 'POST',
		headers,
		body: JSON.stringify(body),
	};

	const response = await fetch('https://demo.vendure.io/shop-api', options);
	if (isClientSide()) {
		const responsetoken = response.headers.get('vendure-auth-token');
		if (!!responsetoken) {
			localStorageSetItem(AUTH_TOKEN, responsetoken);
		}
	}
	const json: any = await response.json();
	return json.data;
};
