// @ts-nocheck
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { marked } from 'marked';
import { env } from '$env/dynamic/public';

const BASE_URL = `${env.PUBLIC_SERVER_URL}/${env.PUBLIC_API_VERSION}`;
console.log('BASE URL: ', BASE_URL);
// --- Axios Global Configuration ---
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

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
