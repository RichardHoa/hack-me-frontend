import axios from 'axios';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { DEFAULT_PAGE_SIZE, requireLogin } from '$lib/utils';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		const url = `${env.PUBLIC_API_DOMAIN}/${env.PUBLIC_API_VERSION}/challenges?pageSize=${DEFAULT_PAGE_SIZE}`;
		const response = await axios.get(url);

		const user = requireLogin();
		console.log(user.authorized);
		return {
			data: response.data
		};
	} catch (err) {
		// Expected error: backend is down or returns error
		console.error(err);
		throw error(500, `Failed to fetch from backend, please come back later`);
	}
}
