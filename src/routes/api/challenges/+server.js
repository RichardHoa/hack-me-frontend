import { json } from '@sveltejs/kit';
import axios from 'axios';

export async function GET({ url }) {
	const queryParams = url.search;
	const getURL = `challenges${queryParams}`;
	try {
		const response = await axios.get(getURL);

		return json(response.data);
	} catch (error) {
		console.error('API proxy error:', error.message);

		const status = error.response ? error.response.status : 500;
		const message = error.response ? error.response.data : 'Error fetching data from the backend.';

		return json({ message }, { status });
	}
}
