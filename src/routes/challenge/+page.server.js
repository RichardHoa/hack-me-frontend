import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { axiosWithCookies, DEFAULT_PAGE_SIZE, requireLogin } from '$lib/utils';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const axios = axiosWithCookies(event);

	try {
		const url = `/challenges?pageSize=${DEFAULT_PAGE_SIZE}`;
		const response = await axios.get(url);

		const user = requireLogin();
		console.log(user);
		return {
			data: response.data
		};
	} catch (err) {
		// Expected error: backend is down or returns error
		console.error(err);
		throw error(500, `Failed to fetch from backend, please come back later`);
	}
}
