import { server$ } from '@builder.io/qwik-city';
import { isBrowser } from '@builder.io/qwik/build';
import { AUTH_TOKEN, HEADER_AUTH_TOKEN_KEY } from '~/constants';
import { ENV_VARIABLES } from '~/env';
import { getCookie, setCookie } from '.';

type ResponseProps<T> = { token: string; data: T };
type ExecuteProps = { query: string; variables: Record<string, any> };
type Options = { method: string; headers: Record<string, string>; body: string };

export const execute = async <T>(body: ExecuteProps): Promise<T> => {
	let headers: Record<string, string> = { 'Content-Type': 'application/json' };
	if (isBrowser) {
		const token = getCookie(AUTH_TOKEN);
		headers = { ...headers, Authorization: `Bearer ${token}` };
	}

	const options = { method: 'POST', headers, body: JSON.stringify(body) };

	const response: ResponseProps<T> = isBrowser
		? await executeOnTheServer(options)
		: await executeRequest(options);

	if (isBrowser && response.token) {
		setCookie(AUTH_TOKEN, response.token, 365);
	}

	return response.data;
};

const executeOnTheServer = server$(async (options: Options) => executeRequest(options));

const executeRequest = async (options: Options) => {
	const httpResponse = await fetch(ENV_VARIABLES.VITE_VENDURE_PUBLIC_URL, options);
	return await extractTokenAndData(httpResponse);
};

const extractTokenAndData = async (response: Response) => {
	const token = response.headers.get(HEADER_AUTH_TOKEN_KEY) || '';
	const { data } = await response.json();
	return { token, data };
};
