// src/routes/account/+page.server.js
import { localizeHref } from '$lib/paraglide/runtime';
import { axiosWithCookies, fetchAndSetTokens, requireLogin } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';

export async function load(event) {
	const user = requireLogin();

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
		// Handle cases where the user is not found or other errors
		if (err.response && err.response.status === 404) {
			redirect(307, localizeHref('/login'));
		}
		// For other errors, you might want to show an error page
		// or log the error and redirect.
		console.error('Failed to load user data:', err);
		redirect(307, localizeHref('/'));
	}
}

export const actions = {
	'users/logout': async (event) => {
		const axios = axiosWithCookies(event);

		try {
			const response = await axios.post('/users/logout');
			fetchAndSetTokens(response, event);
		} catch (err) {
			return fail(err.response.status, {
				id: 'logout',
				success: false,
				message: err.response.data.message
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
			return fail(err.response.status, {
				id: 'changePassword',
				success: false,
				message: err.response.data.message
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

			const refreshTokenResponse = await axios.post('/auth/tokens');
			fetchAndSetTokens(refreshTokenResponse, event);

			return {
				id: 'changeUsername',
				success: true,
				message: response.data.message
			};
		} catch (err) {
			return fail(err.response.status, {
				id: 'changeUsername',
				success: false,
				message: err.response.data.message
			});
		}
	},
	deleteAccount: async (event) => {
		const axios = axiosWithCookies(event);
		try {
			const response = await axios.delete('/users');
			// After deleting the account, you'll want to log the user out
			// and redirect them.
			fetchAndSetTokens(response, event);
		} catch (err) {
			return fail(err.response.status, {
				id: 'deleteAccount',
				success: false,
				message: err.response.data.message
			});
		}
		redirect(307, localizeHref('/'));
	}
};
