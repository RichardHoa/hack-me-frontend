import { error } from '@sveltejs/kit';
import { axiosWithCookies } from '$lib/server/utils';
import { DEFAULT_PAGE_SIZE, SERVER_ERROR_MESSAGE } from '$lib/utils';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const axios = axiosWithCookies(event);

	const url = `/challenges?pageSize=${DEFAULT_PAGE_SIZE}`;
	let response;
	try {
		response = await axios.get(url);
	} catch (err) {
		error(err.response?.status || 500, {
			message: err.response?.data?.message || SERVER_ERROR_MESSAGE
		});
	}

	return {
		data: response.data
	};
}
