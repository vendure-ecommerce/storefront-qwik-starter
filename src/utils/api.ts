import { isBrowser } from '@builder.io/qwik/build';
import { AUTH_TOKEN } from '~/constants';
import { ENV_VARIABLES } from '~/env';
import { getCookie, setCookie } from '.';

export const execute = async <T>(body: {
	query: string;
	variables: Record<string, any>;
}): Promise<T> => {
	let headers: Record<string, string> = { 'Content-Type': 'application/json' };
	if (isBrowser) {
		const token = getCookie(AUTH_TOKEN);
		headers = { ...headers, Authorization: `Bearer ${token}` };
	}
	const options = {
		method: 'POST',
		headers,
		body: JSON.stringify(body),
	};

	const response = await fetch(ENV_VARIABLES.VITE_VENDURE_PUBLIC_URL, options);
	if (isBrowser) {
		const responsetoken = response.headers.get('vendure-auth-token');
		if (responsetoken) {
			setCookie(AUTH_TOKEN, responsetoken, 365);
		}
	}
	const json: any = await response.json();
	return json.data;
};
