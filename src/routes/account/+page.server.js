import { localizeHref } from '$lib/paraglide/runtime';
import { axiosWithCookies, fetchAndSetTokens, requireLogin } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

export async function load() {
	const user = requireLogin();

	if (!user) {
		redirect(307, localizeHref('/login'));
	}
}

export const actions = {
	'users/logout': async (event) => {
		const axios = axiosWithCookies(event);

		try {
			const response = await axios.post('/users/logout');
			fetchAndSetTokens(response, event);
		} catch (err) {
			return {
				id: 'logout',
				success: false,
				message: err.response.data.message
			};
		}

		redirect(307, localizeHref('/challenge'));
	}
};
