import axios from 'axios';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		const url = `${env.API_DOMAIN}/${env.API_VERSION}/challenges`;
		const response = await axios.get(url);
		return {
			data: response.data
		};
	} catch (err) {
		// Expected error: backend is down or returns error
		throw error(502, `Failed to fetch from backend, please come back later`);
	}
}
