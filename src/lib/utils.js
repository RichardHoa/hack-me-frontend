// @ts-nocheck
import axios from 'axios';
import { env } from '$env/dynamic/public';
import { getRequestEvent } from '$app/server';

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

// axios default setting
axios.defaults.baseURL = `${env.PUBLIC_API_DOMAIN}/${env.PUBLIC_API_VERSION}`;
axios.defaults.withCredentials = true;

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
