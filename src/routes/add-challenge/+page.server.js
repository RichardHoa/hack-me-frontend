// @ts-nocheck
import { axiosWithCookies, requireLogin } from '$lib/utils.js';
import { fail } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';

export const load = async () => {};

export const actions = {
	challenges: async (event) => {
		const axios = axiosWithCookies(event);

		const formData = await event.request.formData();
		const content = formData.get('content');
		const name = formData.get('name');
		const category = formData.get('category');

		try {
			const response = await axios.post('/challenges', {
				name: name,
				content: content,
				category: category
			});

			return {
				success: true,
				message: response.data.message
			};
		} catch (err) {
			return fail(err.response.status, {
				success: false,
				message: err.response.data.message
			});
		}
	}
};
