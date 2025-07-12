// @ts-nocheck
import { localizeHref } from '$lib/paraglide/runtime.js';
import { axiosWithCookies } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { fail } from 'assert';
import axios from 'axios';

export async function load({ params }) {
	try {
		const url = `/challenges?exactName=${params.challengeName}`;
		const response = await axios.get(url);

		if (response.data.data.length === 0) {
			throw error(400, `Challenge name: |${params.challengeName}| cannot be found`);
		}

		const challengeID = response.data.data[0].ID;
		const challengeResponse = await axios.get(`/challenges/responses?challengeID=${challengeID}`);

		return {
			challenge: response.data.data[0],
			challengeResponse: challengeResponse.data.data
		};
	} catch (err) {
		console.error('Load error:', err);

		if (err?.status && err?.body) {
			throw error(err.status, err.body.message ?? err.body);
		}

		if (axios.isAxiosError(err) && err.response) {
			const status = err.response.status || 500;
			const message = err.response.data?.message || 'Unexpected server error';
			throw error(status, message);
		}

		throw error(500, 'Failed to connect to backend. Please try again later.');
	}
}

export const actions = {
	challenges: async (event) => {
		const axios = axiosWithCookies(event);

		const formData = await event.request.formData();
		const content = formData.get('content');
		const name = formData.get('name');
		const oldName = formData.get('oldName');
		const category = formData.get('category');
		let newName = '';

		const data = {
			oldName: oldName,
			content: content,
			category: category
		};

		if (oldName !== name) {
			data.name = name;
			newName = name;
		}

		try {
			const response = await axios.put('/challenges', data);

			return {
				success: true,
				message: response.data.message,
				newName: newName
			};
		} catch (err) {
			console.log(err);
			return {
				success: false,
				message: err.response.data.message
			};
		}
	},
	'challenges/responses': async (event) => {
		const axios = axiosWithCookies(event);

		const formData = await event.request.formData();
		const content = formData.get('content');
		const name = formData.get('name');
		const challengeID = formData.get('challengeID');

		try {
			const response = await axios.post('/challenges/responses', {
				challengeID: challengeID,
				name: name,
				content: content
			});

			return {
				success: true,
				message: response.data.message,
				challengeResponseData: response.data.data
			};
		} catch (err) {
			return {
				success: false,
				message: err.response.data.message
			};
		}
	}
};
