// @ts-nocheck
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { axiosWithCookies, fetchAndSetTokens } from '$lib/server/utils';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '$lib/utils';

const handleParaglide = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const handleAuth = async ({ event, resolve }) => {
	// console.log('event cookies before checking');
	// event.cookies.getAll().map((each) => console.log(each));
	let accessToken = event.cookies.get(ACCESS_TOKEN_NAME);
	const refreshToken = event.cookies.get(REFRESH_TOKEN_NAME);

	event.locals.user = null;

	if (!accessToken && refreshToken) {
		const axios = axiosWithCookies(event);

		try {
			const response = await axios.get('/auth/tokens');

			fetchAndSetTokens(response, event);
			// get access token after fetching
			accessToken = event.cookies.get(ACCESS_TOKEN_NAME);
		} catch (err) {
			return resolve(event);
		}
	}

	// console.log('event cookie after checking');
	// event.cookies.getAll().map((each) => console.log(each));
	let payload;

	try {
		payload = jwtDecode(accessToken);
	} catch (err) {
		return resolve(event);
	}

	const { iat, exp } = payload;
	const refreshTokenPayload = jwtDecode(refreshToken);

	event.locals.user = {
		userName: refreshTokenPayload.userName,
		iat,
		exp,
		...payload
	};

	return resolve(event);
};

const handleCSP = async ({ event, resolve }) => {
	const res = await resolve(event);
	const ct = res.headers.get('content-type') || '';

	if (!ct.includes('text/html')) return res;

	const cspHeaderName = 'Content-Security-Policy';
	const existing = res.headers.get(cspHeaderName) || '';
	const fa = "frame-ancestors 'none'";

	if (!/frame-ancestors/i.test(existing)) {
		const sep = existing.trim() ? (existing.trim().endsWith(';') ? ' ' : '; ') : '';

		res.headers.set(cspHeaderName, `${existing}${sep}${fa}`.trim());
	}

	if (!res.headers.has('X-Frame-Options')) {
		res.headers.set('X-Frame-Options', 'DENY');
	}

	return res;
};

export const handle = sequence(handleParaglide, handleAuth, handleCSP);
