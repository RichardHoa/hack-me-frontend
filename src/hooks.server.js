import { sequence } from '@sveltejs/kit/hooks';
import * as auth from '$lib/server/auth';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { ACCESS_TOKEN_NAME } from '$lib/utils';
import { jwtDecode } from 'jwt-decode';

const handleParaglide = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const handleAuth = async ({ event, resolve }) => {
	const accessToken = event.cookies.get(ACCESS_TOKEN_NAME);
	// console.log(`event cookies: ${JSON.stringify(event.cookies.getAll())}`);

	if (!accessToken) {
		event.locals.user = null;
		return resolve(event);
	}

	let payload;
	try {
		payload = jwtDecode(accessToken);
	} catch (err) {
		// Malformed token
		event.cookies.delete('ACCESS_TOKEN_NAME');
		event.locals.user = null;
		return resolve(event);
	}

	const now = Math.floor(Date.now() / 1000);
	const { iat, exp } = payload;

	const MAX_TOKEN_LIFESPAN = 60 * 60 * 24; // 24 hours

	// Validate token claims
	if (
		typeof iat !== 'number' ||
		typeof exp !== 'number' ||
		iat > now || // issued in future
		exp <= now || // already expired
		exp - iat > MAX_TOKEN_LIFESPAN // suspiciously long lifespan
	) {
		event.cookies.delete('ACCESS_TOKEN_NAME');
		event.locals.user = null;
		return resolve(event);
	}

	event.locals.user = { authorized: true, iat, exp, ...payload };

	return resolve(event);
};

export const handle = sequence(handleParaglide, handleAuth);
