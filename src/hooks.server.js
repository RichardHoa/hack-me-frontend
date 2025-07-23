// @ts-nocheck
import { sequence } from '@sveltejs/kit/hooks';
import * as auth from '$lib/server/auth';
import { paraglideMiddleware } from '$lib/paraglide/server';
import {
	ACCESS_TOKEN_NAME,
	axiosWithCookies,
	fetchAndSetTokens,
	REFRESH_TOKEN_NAME
} from '$lib/utils';
import { jwtDecode } from 'jwt-decode';

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
			console.error('Token refresh failed:', err.response.data);
			return resolve(event);
		}
	}

	// console.log();
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

	event.locals.user = { userName: refreshTokenPayload.userName, iat, exp, ...payload };

	return resolve(event);
};

export const handle = sequence(handleParaglide, handleAuth);
