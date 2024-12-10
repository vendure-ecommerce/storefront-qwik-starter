import { server$ } from '@builder.io/qwik-city';
import { isBrowser } from '@builder.io/qwik/build';
import type { DocumentNode } from 'graphql/index';
import { print } from 'graphql/index';
import { AUTH_TOKEN, DEV_API, HEADER_AUTH_TOKEN_KEY, PROD_API } from '~/constants';
import type { Options as RequesterOptions } from '~/graphql-wrapper';
import { getCookie, setCookie } from '.';

type ResponseProps<T> = { token: string; data: T };
type ExecuteProps<V> = { query: string; variables?: V };
type Options = {
	method: string;
	headers: Record<string, string>;
	body: string;
};

const baseUrl = import.meta.env.DEV ? DEV_API : PROD_API;
const shopApi = `${baseUrl}/shop-api/`;

export const esrequester = async <R, V>(
	doc: DocumentNode,
	vars?: V,
	options: RequesterOptions = {
		token: '',
		apiUrl: shopApi,
		channelToken: '',
		languageCode: 'es',
	}
): Promise<R> => {
	options.apiUrl = options?.apiUrl ?? shopApi;

	// Get language from localStorage if available
	if (isBrowser) {
		const storedLang = localStorage.getItem('lang');
		if (storedLang) {
			options.languageCode = storedLang;
		}
	}

	return execute<R, V>(
		{
			query: print(doc),
			variables: {
				...(vars as object),
				languageCode: options.languageCode,
			} as V,
		},
		options
	);
};

const execute = async <R, V = Record<string, any>>(
	body: ExecuteProps<V>,
	options: RequesterOptions
): Promise<R> => {
	const url = new URL(options.apiUrl!);
	url.searchParams.set('languageCode', options.languageCode || 'en');

	const requestOptions = {
		method: 'POST',
		headers: createHeaders(options.languageCode),
		body: JSON.stringify(body),
	};

	if (options.token) {
		requestOptions.headers = {
			...requestOptions.headers,
			Authorization: `Bearer ${options.token}`,
		};
	}

	if (options.channelToken) {
		requestOptions.headers['vendure-token'] = options.channelToken;
	}

	const response: ResponseProps<R> =
		isBrowser && !import.meta.env.DEV
			? await executeOnTheServer(requestOptions, url.toString())
			: await executeRequest(requestOptions, url.toString());

	if (isBrowser && response.token) {
		setCookie(AUTH_TOKEN, response.token, 365);
	}

	return response.data;
};

const createHeaders = (languageCode?: string) => {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'Accept-Language': languageCode || 'de',
	};

	if (isBrowser) {
		const token = getCookie(AUTH_TOKEN);
		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		// Get current language from localStorage
		const storedLang = localStorage.getItem('lang');
		if (storedLang) {
			headers['Accept-Language'] = storedLang;
		}
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
		console.error(`Empty request body for a call to ${apiUrl}`);
		return { token: '', data: {} };
	}
	const token = response.headers.get(HEADER_AUTH_TOKEN_KEY) || '';
	const { data, errors } = await response.json();
	if (errors && !data) {
		throw new Error(errors[0].message);
	}
	return { token, data };
};

export const createRequestOptions = (
	languageCode: string = 'en',
	baseOptions?: Partial<RequesterOptions>
): RequesterOptions => {
	if (isBrowser) {
		const storedLang = localStorage.getItem('lang');
		if (storedLang) {
			languageCode = storedLang;
		}
	}

	return {
		token: '',
		apiUrl: shopApi,
		channelToken: '',
		languageCode,
		...baseOptions,
	};
};

// import { server$ } from '@builder.io/qwik-city';
// import { isBrowser } from '@builder.io/qwik/build';
// import type { DocumentNode } from 'graphql/index';
// import { print } from 'graphql/index';
// import { AUTH_TOKEN, DEV_API, HEADER_AUTH_TOKEN_KEY, PROD_API } from '~/constants';
// import type { Options as RequesterOptions } from '~/graphql-wrapper';
// import { getCookie, setCookie } from '.';

// type ResponseProps<T> = {
//   token: string;
//   data: T;
// };

// type ExecuteProps<V> = {
//   query: string;
//   variables?: V;
// };

// type Options = {
//   method: string;
//   headers: Record<string, string>;
//   body: string;
// };

// const baseUrl = import.meta.env.DEV ? DEV_API : PROD_API;
// const shopApi = `${baseUrl}/shop-api/`;

// export const requester = async <R, V>(
//   doc: DocumentNode,
//   vars?: V,
//   options: RequesterOptions = {
//     token: '',
//     apiUrl: shopApi,
//     channelToken: '',
//     languageCode: ''
//   }
// ): Promise<R> => {
//   options.apiUrl = options?.apiUrl ?? shopApi;

//   // Get language from localStorage
//   const languageCode = isBrowser ? localStorage.getItem('lang') || 'en' : 'en';

//   return execute<R, V>(
//     {
//       query: print(doc),
//       variables: {
//         ...(vars as object),
//         languageCode,
//       } as V,
//     },
//     options
//   );
// };

// const execute = async <R, V = Record<string, any>>(
//   body: ExecuteProps<V>,
//   options: RequesterOptions
// ): Promise<R> => {
//   const languageCode = isBrowser ? localStorage.getItem('lang') || 'en' : 'en';
//   const url = new URL(options.apiUrl!);
//   url.searchParams.set('languageCode', languageCode);

//   const requestOptions = {
//     method: 'POST',
//     headers: createHeaders(languageCode),
//     body: JSON.stringify(body),
//   };

//   if (options.token) {
//     requestOptions.headers = {
//       ...requestOptions.headers,
//       Authorization: `Bearer ${options.token}`,
//     };
//   }

//   if (options.channelToken) {
//     requestOptions.headers['vendure-token'] = options.channelToken;
//   }

//   const response: ResponseProps<R> =
//     isBrowser && !import.meta.env.DEV
//       ? await executeOnTheServer(requestOptions, url.toString())
//       : await executeRequest(requestOptions, url.toString());

//   if (isBrowser && response.token) {
//     setCookie(AUTH_TOKEN, response.token, 365);
//   }

//   return response.data;
// };

// const createHeaders = (languageCode: string) => {
//   const headers: Record<string, string> = {
//     'Content-Type': 'application/json',
//     'Accept-Language': languageCode,
//   };

//   if (isBrowser) {
//     const token = getCookie(AUTH_TOKEN);
//     if (token) {
//       headers.Authorization = `Bearer ${token}`;
//     }
//   }

//   return headers;
// };

// const executeOnTheServer = server$(async (options: Options, apiUrl: string) =>
//   executeRequest(options, apiUrl)
// );

// const executeRequest = async (options: Options, apiUrl: string) => {
//   let httpResponse: Response = new Response();
//   try {
//     httpResponse = await fetch(apiUrl, options);
//   } catch (error) {
//     console.error(`Could not fetch from ${apiUrl}. Reason: ${error}`);
//   }
//   return await extractTokenAndData(httpResponse, apiUrl);
// };

// const extractTokenAndData = async (response: Response, apiUrl: string) => {
//   if (response.body === null) {
//     console.error(`Empty request body for a call to ${apiUrl}`);
//     return { token: '', data: {} };
//   }
//   const token = response.headers.get(HEADER_AUTH_TOKEN_KEY) || '';
//   const { data, errors } = await response.json();
//   if (errors && !data) {
//     throw new Error(errors[0].message);
//   }
//   return { token, data };
// };
