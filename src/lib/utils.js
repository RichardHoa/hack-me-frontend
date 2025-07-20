// @ts-nocheck
import axios from 'axios';
import { env } from '$env/dynamic/public';
import { getRequestEvent } from '$app/server';
import { jwtDecode } from 'jwt-decode';
import { marked } from 'marked';

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

export function formatNow() {
	const date = new Date();

	const pad = (num, size = 2) => String(num).padStart(size, '0');

	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1);
	const day = pad(date.getDate());
	const hour = pad(date.getHours());
	const minute = pad(date.getMinutes());
	const second = pad(date.getSeconds());

	const ms = pad(date.getMilliseconds(), 6);

	const tzOffsetMin = date.getTimezoneOffset();
	const sign = tzOffsetMin <= 0 ? '+' : '-';
	const tzHours = pad(Math.floor(Math.abs(tzOffsetMin) / 60));
	const tzMinutes = pad(Math.abs(tzOffsetMin) % 60);

	return `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}${sign}${tzHours}:${tzMinutes}`;
}

export function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return undefined;
	}

	return locals.user;
}

export const lowerHeaderRenderer = {
	heading({ tokens, depth }) {
		const text = this.parser.parseInline(tokens);
		const newLevel = Math.min(6, depth + 1);
		return `
		<h${newLevel}>${text}</h${newLevel}>
		`;
	}
};

// axios default setting
axios.defaults.baseURL = `${env.PUBLIC_API_DOMAIN}/${env.PUBLIC_API_VERSION}`;
axios.defaults.withCredentials = true;

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

// constants naming
export const DEFAULT_PAGE_SIZE = 5;
export const ACCESS_TOKEN_NAME = 'accessToken';
export const REFRESH_TOKEN_NAME = 'refreshToken';
export const CHALLENGE_CATEGORIES = [
	'web hacking',
	'embedded hacking',
	'reverse engineering',
	'crypto challenge',
	'forensics'
];
