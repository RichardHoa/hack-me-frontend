import { getRequestEvent } from '$app/server';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { env } from '$env/dynamic/public';
import { dev } from '$app/environment';

const BASE_URL = `${env.PUBLIC_SERVER_URL}/${env.PUBLIC_API_VERSION}`;

/**
 * Parses 'set-cookie' headers from an Axios response and sets them on the SvelteKit event cookies.
 * It decodes JWTs to set appropriate `maxAge` values.
 * @param {import('axios').AxiosResponse} response - The Axios response object.
 * @param {import('@sveltejs/kit').RequestEvent} event - The SvelteKit request event object.
 */
export function fetchAndSetTokens(response, event) {
	const setCookie = response.headers['set-cookie'];

	let csrfTokenValue = null;
	let accessTokenMaxAge = null;
	console.log('Cookies sent from backend', setCookie);
	if (setCookie) {
		for (const raw of setCookie) {
			const [cookieStr] = raw.split(';');
			const [name, value] = cookieStr.split('=');

			if (name === 'csrfToken') {
				csrfTokenValue = value;
				continue;
			}

			let maxAge;

			if (!value) {
				maxAge = 0;
				accessTokenMaxAge = 0;
			} else {
				try {
					const decoded = jwtDecode(value); // Assumes value is a JWT
					const now = Math.floor(Date.now() / 1000);
					maxAge = decoded.exp - now;
					if (name === 'accessToken') {
						accessTokenMaxAge = maxAge;
					}

					if (maxAge <= 0) {
						console.log(`JWT for ${name} is already expired.`);
						continue;
					}
				} catch (e) {
					console.log(`Failed to decode ${name}, setting session cookie.`, e);
				}
			}

			event.cookies.set(name, value, {
				path: '/',
				maxAge,
				secure: false,
				sameSite: 'strict'
			});
		}
		// set csrf token
		event.cookies.set('csrfToken', csrfTokenValue, {
			path: '/',
			maxAge: accessTokenMaxAge,
			secure: false,
			sameSite: 'strict'
		});

		console.log('event cookies AFTER SETTING');
		event.cookies.getAll().map((each) => console.log(each));
	}
}

/**
 * Creates a new Axios instance with credentials (cookies and CSRF token)
 * attached from the current SvelteKit request event.
 * @param {import('@sveltejs/kit').RequestEvent} event - The SvelteKit request event object.
 * @returns {import('axios').AxiosInstance} A configured Axios instance.
 */
export function axiosWithCookies(event) {
	const accessToken = event.cookies.get('accessToken');
	const refreshToken = event.cookies.get('refreshToken');
	const csrfToken = event.cookies.get('csrfToken');

	return axios.create({
		// @ts-ignore
		baseURL: BASE_URL,
		headers: {
			Cookie: [
				accessToken && `accessToken=${accessToken}`,
				refreshToken && `refreshToken=${refreshToken}`
			]
				.filter(Boolean)
				.join('; '),
			'X-CSRF-Token': csrfToken
		}
	});
}

/**
 * Retrieves the current user from the request event locals.
 * This is a server-side utility.
 * @returns {object | undefined} The user object if it exists, otherwise undefined.
 */
export function requireLogin() {
	const { locals } = getRequestEvent();

	// @ts-ignore
	if (!locals.user) {
		return undefined;
	}

	// @ts-ignore
	return locals.user;
}
