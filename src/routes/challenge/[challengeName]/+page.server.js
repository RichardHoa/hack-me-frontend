import { axiosWithCookies } from '$lib/utils';
import { error } from '@sveltejs/kit';
import { fail } from 'assert';
import axios from 'axios';

export async function load({ params }) {
	try {
		const url = `/challenges?exactName=${params.challengeName}`;
		const response = await axios.get(url);

		if (response.data.data.length === 0) {
			throw error(400, `Challenge name: |${params.challengeName}| cannot be found`);
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

export const actions = {
	challenges: async (event) => {
		const axios = axiosWithCookies(event);

		const formData = await event.request.formData();
		const content = formData.get('content');
		const name = formData.get('name');
		const oldName = formData.get('oldName');
		const category = formData.get('category');

		const data = {
			oldName: oldName,
			content: content,
			category: category
		};
		if (oldName !== name) {
			data.name = name;
		}
		try {
			const response = await axios.put('/challenges', data);

			return {
				success: true,
				message: response.data.message,
				oldName: oldName,
				newName: name
			};
		} catch (err) {
			return fail(err.response.status, {
				success: false,
				message: err.response.data.message
			});
		}
	}
};
