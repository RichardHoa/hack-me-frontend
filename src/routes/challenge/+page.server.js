import { error } from '@sveltejs/kit';
import { axiosWithCookies, DEFAULT_PAGE_SIZE } from '$lib/utils';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const axios = axiosWithCookies(event);

	try {
		const url = `/challenges?pageSize=${DEFAULT_PAGE_SIZE}`;
		const response = await axios.get(url);

		return {
			data: response.data
		};
	} catch (err) {
		// Expected error: backend is down or returns error
		console.error(err);
		throw error(500, `Failed to fetch from backend, please come back later`);
	}
}
