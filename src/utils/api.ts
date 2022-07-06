export const sendQuery = async <T>(query: string): Promise<T> => {
	const options = {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + '## API KEY',
		},
		body: JSON.stringify({ query }),
	};

	const response = await fetch('https://demo.vendure.io/shop-api', options);
	const json = await response.json();
	return json.data;
};
