import { requireLogin } from '$lib/utils';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	const user = requireLogin();
	return {
		user: user
	};
}
