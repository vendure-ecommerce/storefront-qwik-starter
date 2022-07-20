export const sendQuery = async <T>(body: {
	query: string;
	variables: Record<string, any>;
}): Promise<T> => {
	const options = {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + '## API KEY',
		},
		body: JSON.stringify(body),
	};

	const response = await fetch('https://demo.vendure.io/shop-api', options);
	const json = await response.json();
	return json.data;
};
