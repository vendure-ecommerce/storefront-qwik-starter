import { server$ } from '@builder.io/qwik-city';
import { isBrowser } from '@builder.io/qwik/build';
import { DocumentNode, print } from 'graphql/index';
import { AUTH_TOKEN, HEADER_AUTH_TOKEN_KEY } from '~/constants';
import { ENV_VARIABLES } from '~/env';
import { getCookie, setCookie } from '.';

type ResponseProps<T> = { token: string; data: T };
type ExecuteProps<V> = { query: string; variables?: V };
type Options = { method: string; headers: Record<string, string>; body: string };

export const requester = async <R, V>(
	doc: DocumentNode,
	vars?: V,
	options: { token?: string } = { token: '' }
): Promise<R> => {
	return execute<R, V>({ query: print(doc), variables: vars }, options.token);
};

const execute = async <R, V = Record<string, any>>(
	body: ExecuteProps<V>,
	authToken: string = ''
): Promise<R> => {
	const options = { method: 'POST', headers: createHeaders(), body: JSON.stringify(body) };
	if (authToken !== '') {
		options.headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` };
	}
	const response: ResponseProps<R> = isBrowser
		? await executeOnTheServer(options)
		: await executeRequest(options);

	if (isBrowser && response.token) {
		setCookie(AUTH_TOKEN, response.token, 365);
	}

	return response.data;
};

const createHeaders = () => {
	let headers: Record<string, string> = { 'Content-Type': 'application/json' };
	if (isBrowser) {
		const token = getCookie(AUTH_TOKEN);
		headers = { ...headers, Authorization: `Bearer ${token}` };
	}
	return headers;
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
