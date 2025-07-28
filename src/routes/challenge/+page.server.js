import { error } from '@sveltejs/kit';
import { axiosWithCookies } from '$lib/server/utils';
import { DEFAULT_PAGE_SIZE, SERVER_ERROR_MESSAGE } from '$lib/utils';

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
		console.error(err.response);

		if (err.status && err.response?.data) {
			throw error(err.status, err.response.data.message);
		}

		throw error(500, SERVER_ERROR_MESSAGE);
	}
}
