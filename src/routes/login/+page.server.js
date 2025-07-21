// @ts-nocheck
import { fetchAndSetTokens } from '$lib/utils';
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

			fetchAndSetTokens(response, event);

			return {
				loginSuccess: true,
				loginMessage: response.data.message
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
				registrationSuccess: true,
				registrationMessage: response.data.message
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
