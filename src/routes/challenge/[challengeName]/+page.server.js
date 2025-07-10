import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import axios from 'axios';

export async function load({ params }) {
	try {
		const url = `${env.API_DOMAIN}/${env.API_VERSION}/challenges?exactName=${params.challengeName}`;
		const response = await axios.get(url);
		return {
			data: response.data
		};
	} catch (err) {
		// Expected error: backend is down or returns error
		throw error(404, `not found`);
	}
}
