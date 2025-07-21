// src/routes/account/+page.server.js
import { localizeHref } from '$lib/paraglide/runtime';
import {
	axiosWithCookies,
	fetchAndSetTokens,
	requireLogin,
	SERVER_ERROR_MESSAGE
} from '$lib/utils';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load(event) {
	const user = requireLogin();

	// no auth cookie is present case
	if (!user) {
		redirect(307, localizeHref('/login'));
	}

	const axios = axiosWithCookies(event);

	try {
		const response = await axios.get('/users/me');

		return {
			userData: response.data.data
		};
	} catch (err) {
		console.error(err);

		if (err?.status && err?.response.data) {
			throw error(err.status, err.response.data.message);
		}

		throw error(500, SERVER_ERROR_MESSAGE);
	}
}

export const actions = {
	'users/logout': async (event) => {
		const axios = axiosWithCookies(event);

		try {
			const response = await axios.post('/users/logout');
			fetchAndSetTokens(response, event);
		} catch (err) {
			return fail(err.response?.status || 500, {
				id: 'logout',
				success: false,
				message: err.response?.data?.message || SERVER_ERROR_MESSAGE
			});
		}

		redirect(307, localizeHref('/challenge'));
	},
	changePassword: async (event) => {
		const axios = axiosWithCookies(event);
		const formData = await event.request.formData();
		const oldPassword = formData.get('oldPassword');
		const newPassword = formData.get('newPassword');

		try {
			const response = await axios.put('/users/password', {
				oldPassword,
				newPassword
			});
			return {
				id: 'changePassword',
				success: true,
				message: response.data.message
			};
		} catch (err) {
			return fail(err.response?.status || 500, {
				id: 'changePassword',
				success: false,
				message: err.response?.data?.message || SERVER_ERROR_MESSAGE
			});
		}
	},
	changeUsername: async (event) => {
		const axios = axiosWithCookies(event);
		const formData = await event.request.formData();
		const newUsername = formData.get('newUsername');

		try {
			const response = await axios.put('/users/username', {
				newUsername
			});

			// because the refresh token contains user name, we must fetch new ones
			const refreshTokenResponse = await axios.post('/auth/tokens');
			fetchAndSetTokens(refreshTokenResponse, event);

			return {
				id: 'changeUsername',
				success: true,
				message: response.data.message
			};
		} catch (err) {
			return fail(err.response?.status || 500, {
				id: 'changeUsername',
				success: false,
				message: err.response?.data?.message || SERVER_ERROR_MESSAGE
			});
		}
	},
	deleteAccount: async (event) => {
		const axios = axiosWithCookies(event);
		try {
			const response = await axios.delete('/users/me');
			fetchAndSetTokens(response, event);
		} catch (err) {
			return fail(err.response?.status || 500, {
				id: 'deleteAccount',
				success: false,
				message: err.response?.data?.message || SERVER_ERROR_MESSAGE
			});
		}
		redirect(307, localizeHref('/'));
	}
};
