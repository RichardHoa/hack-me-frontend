import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import axios from 'axios';

export async function load({ params }) {
	try {
		const url = `${env.PUBLIC_API_DOMAIN}/${env.PUBLIC_API_VERSION}/challenges?exactName=${params.challengeName}`;
		const response = await axios.get(url);

		if (response.data.data.length === 0) {
			throw error(400, `Challenge name: ${params.challengeName} cannot be found`);
		}

		return {
			data: response.data
		};
	} catch (err) {
		console.error('Load error:', err);

		// Handle SvelteKit error rethrows
		if (err?.status && err?.body) {
			throw error(err.status, err.body.message ?? err.body);
		}

		// Axios error with response from server
		if (axios.isAxiosError(err) && err.response) {
			const status = err.response.status || 500;
			const message = err.response.data?.message || 'Unexpected server error';
			throw error(status, message);
		}

		// Fallback: server might be unreachable
		throw error(500, 'Failed to connect to backend. Please try again later.');
	}
}
