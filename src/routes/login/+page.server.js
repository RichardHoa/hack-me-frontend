// @ts-nocheck
import { fetchAndSetTokens, SERVER_ERROR_MESSAGE } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const load = async (event) => {};

export const actions = {
	'login/google': async (event) => {
		const { cookies, request } = event;
		const formData = await request.formData();
		const name = formData.get('userName');
		const email = formData.get('email');
		const imageLink = formData.get('imageLink');
		const googleID = formData.get('id');

		try {
			const response = await axios.post('/users/login', {
				googleID: googleID,
				email: email
			});

			fetchAndSetTokens(response, event);
			return { id: 'login', success: true, message: response.data.message };
		} catch (loginError) {
			console.log(loginError);

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
				console.log(registrationError);

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
			console.error(err.response);

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
