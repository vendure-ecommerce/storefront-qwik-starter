import { isBrowser } from '@builder.io/qwik/build';
import { server$ } from '@builder.io/qwik-city';
import type { DocumentNode } from 'graphql/index';
import { print } from 'graphql/index';
import { AUTH_TOKEN, DEV_API, HEADER_AUTH_TOKEN_KEY, PROD_API } from '~/constants';
import type { Options as RequesterOptions } from '~/graphql-wrapper';
import { getCookie, setCookie } from '.';

type ResponseProps<T> = { token: string; data: T };
type ExecuteProps<V> = { query: string; variables?: V };
type Options = { method: string; headers: Record<string, string>; body: string | FormData };

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
	// Check if body contains file uploads, if it is File or FileList objects,
	// then we need to handle it as a multipart request, because it is not serializable as JSON,
	// and we can't use regular JSON request (which has less overhead).
	const hasFileUploads = body.variables && containsFileUploads(body.variables);

	let requestOptions: Options;

	if (hasFileUploads) {
		// Handle GraphQL multipart uploads
		const formData = createMultipartFormData(body);
		requestOptions = {
			method: 'POST',
			headers: createHeadersForFormData(),
			body: formData,
		};
	} else {
		requestOptions = {
			method: 'POST',
			headers: createHeaders(),
			body: JSON.stringify(body),
		};
	}

	// Merge headers instead of replacing them
	if (options.token) {
		requestOptions.headers = {
			...requestOptions.headers,
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

// Helper function to check if variables contain File objects
function containsFileUploads(variables: any): boolean {
	if (!variables || typeof variables !== 'object') return false;

	return Object.values(variables).some((value) => {
		if (value instanceof File) return true;
		if (Array.isArray(value)) return value.some((item) => item instanceof File);
		if (value && typeof value === 'object') return containsFileUploads(value);
		return false;
	});
}

// Create FormData for GraphQL multipart uploads
function createMultipartFormData(body: ExecuteProps<any>): FormData {
	const formData = new FormData();

	// Replace File objects with null in variables and collect files
	let sanitizedVariables: any = {};
	const fileMap: { [key: string]: string[] } = {};
	const files: { [key: string]: File } = {};
	let fileIndex = 0;

	function processVariables(obj: any, path: string[] = []): any {
		if (obj instanceof File) {
			const fileKey = fileIndex.toString();
			const variablePath = `variables.${path.join('.')}`;
			fileMap[fileKey] = [variablePath];
			files[fileKey] = obj;
			fileIndex++;
			return null;
		}

		if (Array.isArray(obj)) {
			return obj.map((item, index) => processVariables(item, [...path, index.toString()]));
		}

		if (obj && typeof obj === 'object') {
			const result: any = {};
			for (const [key, value] of Object.entries(obj)) {
				result[key] = processVariables(value, [...path, key]);
			}
			return result;
		}

		return obj;
	}

	sanitizedVariables = processVariables(body.variables);

	// Add fields in correct order per GraphQL multipart spec
	const operations = JSON.stringify({
		query: body.query,
		variables: sanitizedVariables,
	});

	formData.append('operations', operations);
	formData.append('map', JSON.stringify(fileMap));

	// Add files in order
	Object.keys(files)
		.sort((a, b) => parseInt(a) - parseInt(b))
		.forEach((fileKey) => {
			formData.append(fileKey, files[fileKey]);
		});

	return formData;
}

// Create headers without Content-Type (let browser set it for FormData)
const createHeadersForFormData = () => {
	let headers: Record<string, string> = {};
	if (isBrowser) {
		const token = getCookie(AUTH_TOKEN);
		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}
	}
	return headers;
};
