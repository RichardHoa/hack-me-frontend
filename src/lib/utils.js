// @ts-nocheck
import axios from 'axios';
import { env } from '$env/dynamic/public';
import { getRequestEvent } from '$app/server';
import { jwtDecode } from 'jwt-decode';
import { marked } from 'marked';

/**
 * Formats a date string into a more readable 'DD/MM/YYYY, HH:MM' format.
 * @param {string} dateStr - The ISO date string to format.
 * @returns {string} The formatted date string.
 */
export function formatDate(dateStr) {
	const date = new Date(dateStr);
	return date.toLocaleString('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});
}

/**
 * Retrieves the current user from the request event locals.
 * This is a server-side utility.
 * @returns {object | undefined} The user object if it exists, otherwise undefined.
 */
export function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return undefined;
	}

	return locals.user;
}

/**
 * A custom renderer for the 'marked' library to demote heading levels.
 * It transforms `<h1>` into `<h2>`, `<h2>` into `<h3>`, and so on, to maintain
 * proper document structure and accessibility when rendering user-generated Markdown.
 * @type {MarkedRenderer}
 */
export const lowerHeaderRenderer = {
	heading({ tokens, depth }) {
		const text = this.parser.parseInline(tokens);
		const newLevel = Math.min(6, depth + 1);
		return `
		<h${newLevel}>${text}</h${newLevel}>
		`;
	}
};

// --- Axios Global Configuration ---
axios.defaults.baseURL = `${env.PUBLIC_API_DOMAIN}/${env.PUBLIC_API_VERSION}`;
axios.defaults.withCredentials = true;

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
						console.warn(`JWT for ${name} is already expired.`);
						continue;
					}
				} catch (e) {
					console.warn(`Failed to decode ${name}, setting session cookie.`, e);
				}
			}

			event.cookies.set(name, value, {
				path: '/',
				maxAge
			});
		}
		// set csrf token
		event.cookies.set('csrfToken', csrfTokenValue, {
			path: '/',
			maxAge: accessTokenMaxAge
		});
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
		baseURL: `${env.PUBLIC_API_DOMAIN}/${env.PUBLIC_API_VERSION}`,
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

// --- Constants ---
export const DEFAULT_PAGE_SIZE = 5;
export const ACCESS_TOKEN_NAME = 'accessToken';
export const REFRESH_TOKEN_NAME = 'refreshToken';
export const SERVER_ERROR_MESSAGE = 'Server is down, please come back 5 minutes later';
export const CHALLENGE_CATEGORIES = [
	'web hacking',
	'embedded hacking',
	'reverse engineering',
	'crypto challenge',
	'forensics'
];
