import { error } from '@sveltejs/kit';
import { axiosWithCookies } from '$lib/server/utils';
import { DEFAULT_PAGE_SIZE, SERVER_ERROR_MESSAGE } from '$lib/utils';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const axios = axiosWithCookies(event);

	const url = `/challenges?pageSize=${DEFAULT_PAGE_SIZE}`;
	const response = await axios.get(url);

	return {
		data: response.data
	};
}
