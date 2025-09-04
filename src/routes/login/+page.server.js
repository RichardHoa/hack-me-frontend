// @ts-nocheck
import { fetchAndSetTokens } from '$lib/server/utils';
import { SERVER_ERROR_MESSAGE } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { jwtDecode } from 'jwt-decode';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const load = async (event) => {};

export const actions = {
	'login/github': async (event) => {
		const { request } = event;
		const formData = await request.formData();
		const code = formData.get('code');

		try {
			const tokenResponse = await axios.post(
				'https://github.com/login/oauth/access_token',
				{
					client_id: publicEnv.PUBLIC_GITHUB_CLIENT_ID,
					client_secret: env.GITHUB_CLIENT_SECRET,
					code: code
				},
				{
					headers: {
						Accept: 'application/json'
					}
				}
			);

			const accessToken = tokenResponse.data.access_token;

			const userResponse = await axios.get('https://api.github.com/user', {
				headers: {
					Authorization: `token ${accessToken}`
				}
			});

			const userEmailResponse = await axios.get('https://api.github.com/user/emails', {
				headers: {
					Authorization: `token ${accessToken}`
				}
			});

			const githubUser = userResponse.data;
			const emailData = userEmailResponse.data.find((e) => e.primary);

			const userName = githubUser.name;
			const imageLink = githubUser.avatar_url;
			const userID = githubUser.id.toString();
			const userEmail = emailData ? emailData.email : null;

			try {
				const response = await axios.post('/users/login', {
					githubID: userID,
					email: userEmail
				});

				fetchAndSetTokens(response, event);
				return { id: 'login', success: true, message: response.data.message };
			} catch (loginError) {
				if (loginError.response?.status !== 400) {
					return fail(loginError.response?.status || 500, {
						id: 'login',
						success: false,
						message: loginError.response?.data?.message || SERVER_ERROR_MESSAGE
					});
				}

				try {
					const payload = {
						userName: userName,
						email: userEmail,
						imageLink: imageLink,
						githubID: userID
					};
					// Step 1: Register the new user
					await axios.post('/users', payload);

					// Step 2: Log in the newly created user
					const secondLoginResponse = await axios.post('/users/login', {
						githubID: userID,
						email: userEmail
					});

					fetchAndSetTokens(secondLoginResponse, event);
					return { id: 'login', success: true, message: secondLoginResponse.data.message };
				} catch (registrationError) {
					return fail(registrationError.response?.status || 500, {
						id: 'login',
						success: false,
						message: registrationError.response?.data?.message || SERVER_ERROR_MESSAGE
					});
				}
			}
		} catch (error) {
			console.error('GitHub login error: ', error.response ? error.response.data : error.message);
			return fail(500, {
				id: 'login',
				success: false,
				message: 'An error occurred during GitHub authentication.'
			});
		}
	},
	'login/google': async (event) => {
		const { cookies, request } = event;
		const formData = await request.formData();
		const token = formData.get('jwtToken');

		const client = new OAuth2Client();
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: '1025927927956-2v6pno708qqkchj3u2gq5g9j2ni4hn2u.apps.googleusercontent.com'
		});

		const payload = ticket.getPayload();

		const name = payload['name'];
		const email = payload['email'];
		const imageLink = payload['picture'];
		const googleID = payload['sub'];

		try {
			const response = await axios.post('/users/login', {
				googleID: googleID,
				email: email
			});

			fetchAndSetTokens(response, event);
			return { id: 'login', success: true, message: response.data.message };
		} catch (loginError) {
			if (loginError.response?.status !== 400) {
				return fail(loginError.response?.status || 500, {
					id: 'login',
					success: false,
					message: loginError.response?.data?.message || SERVER_ERROR_MESSAGE
				});
			}

			try {
				// Step 1: Register the new user
				await axios.post('/users', {
					userName: name,
					email: email,
					imageLink: imageLink,
					googleID: googleID
				});

				// Step 2: Log in the newly created user
				const secondLoginResponse = await axios.post('/users/login', {
					googleID: googleID,
					email: email
				});

				fetchAndSetTokens(secondLoginResponse, event);
				return { id: 'login', success: true, message: secondLoginResponse.data.message };
			} catch (registrationError) {
				return fail(registrationError.response?.status || 500, {
					id: 'login',
					success: false,
					message: registrationError.response?.data?.message || SERVER_ERROR_MESSAGE
				});
			}
		}
	},
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

			fetchAndSetTokens(response, event);

			return {
				id: 'login',
				success: true,
				message: response.data.message
			};
		} catch (err) {
			return fail(err.response?.status || 500, {
				id: 'login',
				success: false,
				message: err.response?.data?.message || SERVER_ERROR_MESSAGE
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
				id: 'registration',
				success: true,
				message: response.data.message
			};
		} catch (err) {
			console.error(err.response);

			return fail(err.response?.status || 500, {
				id: 'registration',
				success: false,
				message: err.response?.data?.message || SERVER_ERROR_MESSAGE
			});
		}
	}
};
