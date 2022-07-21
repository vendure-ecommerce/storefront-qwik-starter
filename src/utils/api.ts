let authTokenSessionKey = '';

export const sendQuery = async <T>(body: {
	query: string;
	variables: Record<string, any>;
}): Promise<T> => {
	let headers: Record<string, string> = { 'Content-Type': 'application/json' };
	if (!!authTokenSessionKey) {
		headers = { ...headers, Authorization: `Bearer ${authTokenSessionKey}` };
	}
	const options = {
		method: 'POST',
		headers,
		body: JSON.stringify(body),
	};

	const response = await fetch('https://demo.vendure.io/shop-api', options);
	const responsetoken = response.headers.get('vendure-auth-token');
	if (!!responsetoken) {
		authTokenSessionKey = responsetoken;
	}
	const json = await response.json();
	return json.data;
};
