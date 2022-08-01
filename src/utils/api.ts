import { AUTH_TOKEN } from '~/constants';
import { getCookie, isClientSide, setCookie } from '.';

export const execute = async <T>(body: {
	query: string;
	variables: Record<string, any>;
}): Promise<T> => {
	let headers: Record<string, string> = { 'Content-Type': 'application/json' };

	if (isClientSide()) {
		const token = getCookie(AUTH_TOKEN);
		headers = { ...headers, Authorization: `Bearer ${token}` };
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
			setCookie(AUTH_TOKEN, responsetoken, 365);
		}
	}
	const json: any = await response.json();
	return json.data;
};
