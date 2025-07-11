// @ts-nocheck
import axios from 'axios';
import { env } from '$env/dynamic/public';
import { getRequestEvent } from '$app/server';

export function formatDate(dateStr) {
	const date = new Date(dateStr);
	return date.toLocaleDateString();
}

export function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		console.error('There is no user');
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
