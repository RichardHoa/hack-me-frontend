import { requireLogin } from '$lib/server/utils';

// We must require login since the navbar content changes based on the user is login or not
/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	const user = requireLogin();
	return {
		user: user
	};
}
