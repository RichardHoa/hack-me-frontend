import { requireLogin } from '$lib/server/utils';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	const user = requireLogin();
	return {
		user: user
	};
}
