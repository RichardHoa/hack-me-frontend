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

// constants naming
export const DEFAULT_PAGE_SIZE = 5;
export const ACCESS_TOKEN_NAME = 'accessToken';
