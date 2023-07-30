import { server$ } from '@builder.io/qwik-city';
import { isBrowser } from '@builder.io/qwik/build';
import type { DocumentNode } from 'graphql/index';
import { print } from 'graphql/index';
import { AUTH_TOKEN, DEV_API, HEADER_AUTH_TOKEN_KEY, PROD_API } from '~/constants';
import type { Options as RequesterOptions } from '~/graphql-wrapper';
import { getCookie, setCookie } from '.';

type ResponseProps<T> = { token: string; data: T };
type ExecuteProps<V> = { query: string; variables?: V };
type Options = { method: string; headers: Record<string, string>; body: string };

const baseUrl = import.meta.env.DEV ? DEV_API : PROD_API;
const shopApi = `${baseUrl}/shop-api`;

export const requester = async <R, V>(
	doc: DocumentNode,
	vars?: V,
	options: RequesterOptions = { token: '', apiUrl: shopApi, channelToken: '' }
): Promise<R> => {
	options.apiUrl = options?.apiUrl ?? shopApi;
	return execute<R, V>({ query: print(doc), variables: vars }, options);
};

const execute = async <R, V = Record<string, any>>(
	body: ExecuteProps<V>,
	options: RequesterOptions
): Promise<R> => {
	const requestOptions = {
		method: 'POST',
		headers: createHeaders(),
		body: JSON.stringify(body),
	};
	if (options.token) {
		requestOptions.headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${options.token ?? ''}`,
		};
	}
	if (options.channelToken) {
		requestOptions.headers['vendure-token'] = options.channelToken;
	}

	const response: ResponseProps<R> =
		isBrowser && !import.meta.env.DEV
			? await executeOnTheServer(requestOptions, options.apiUrl!)
			: await executeRequest(requestOptions, options.apiUrl!);

	// DELETE THIS
	// const response: ResponseProps<R> = await executeRequest(requestOptions, options.apiUrl!);

	if (isBrowser && response.token) {
		setCookie(AUTH_TOKEN, response.token, 365);
		// setCookie(ADMIN_AUTH_TOKEN, response.token, 365);
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

const executeOnTheServer = server$(async (options: Options, apiUrl: string) =>
	executeRequest(options, apiUrl)
);

const executeRequest = async (options: Options, apiUrl: string) => {
	let httpResponse: Response = new Response();
	try {
		httpResponse = await fetch(apiUrl, options);
	} catch (error) {
		console.error(`Could not fetch from ${apiUrl}. Reason: ${error}`);
	}
	return await extractTokenAndData(httpResponse, apiUrl);
};

const extractTokenAndData = async (response: Response, apiUrl: string) => {
	if (response.body === null) {
		console.error(`Emtpy request body for a call to ${apiUrl}`);
		return { token: '', data: {} };
	}
	const token = response.headers.get(HEADER_AUTH_TOKEN_KEY) || '';
	const { data, errors } = await response.json();
	if (errors && !data) {
		// e.g. API access related errors, like auth issues.
		throw new Error(errors[0].message);
	}
	return { token, data };
};
