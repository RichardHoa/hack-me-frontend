// @ts-nocheck
import { fail } from '@sveltejs/kit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const load = async (event) => {};

export const actions = {
	login: async (event) => {
		const { cookies, request } = event;
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		try {
			const response = await axios.post('/users/login', {
				email: email,
				password: password
			});

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

					cookies.set(name, value, {
						path: '/',
						maxAge
					});
				}
			}

			// set csrf token
			cookies.set('csrfToken', csrfTokenValue, {
				path: '/',
				maxAge: accessTokenMaxAge
			});

			return {
				loginSuccess: true,
				loginMessage: response.data.message
			};
		} catch (err) {
			return fail(err.response.status, {
				loginSuccess: false,
				loginMessage: err.response.data.message
			});
		}
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const email = formData.get('email');

		try {
			const response = await axios.post('/users', {
				userName: username,
				email: email,
				password: password
			});

			return {
				registrationSuccess: true,
				registrationMessage: response.data.message
			};
		} catch (err) {
			return fail(err.response.status, {
				registrationSuccess: false,
				registrationMessage: err.response.data.message
			});
		}
	}
};
