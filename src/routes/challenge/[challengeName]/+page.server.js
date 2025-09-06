// @ts-nocheck
import { localizeHref } from '$lib/paraglide/runtime.js';
import { axiosWithCookies } from '$lib/server/utils';
import { lowerHeaderRenderer, SERVER_ERROR_MESSAGE } from '$lib/utils';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

import { error, fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { goto } from '$app/navigation';
import { CommentAPI } from '$lib/components/Comment/Comment';

export async function load({ params }) {
	marked.use({ renderer: lowerHeaderRenderer });
	const window = new JSDOM('').window;
	const purify = DOMPurify(window);
	const url = `/challenges?exactName=${params.challengeName}`;
	const response = await axios.get(url);

	const challenge = response.data.data[0];
	if (!challenge) {
		throw error(400, `Challenge name: |${params.challengeName}| cannot be found`);
	}

	const challengeID = response.data.data[0].id;
	const responseResult = await axios.get(`/challenges/responses?challengeID=${challengeID}`);
	const challengeResponses = responseResult.data.data;

	// set to null as we do not need challenge response content
	for (let i = 0; i < challengeResponses.length; i++) {
		challengeResponses[i].content = null;
	}

	const rawChallengeContent = challenge.content;
	challenge.content = purify.sanitize(marked.parse(challenge.content));

	return {
		challenge: challenge,
		rawChallengeContent: rawChallengeContent,
		challengeResponses: challengeResponses
	};
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
			return fail(err.response?.status || 500, {
				success: false,
				message: err.response?.data?.message || SERVER_ERROR_MESSAGE
			});
		}
	},
	'challenges/delete': async (event) => {
		const axios = axiosWithCookies(event);

		const formData = await event.request.formData();
		const name = formData.get('name');

		try {
			const response = await axios.delete('/challenges', {
				data: {
					name: name
				}
			});
		} catch (err) {
			return fail(err.response?.status || 500, {
				id: 'challengeDelete',
				success: false,
				message: err.response?.data?.message || SERVER_ERROR_MESSAGE
			});
		}
		redirect(308, localizeHref('/challenge'));
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
			let errObject = {
				id: 'challengeDelete',
				success: false,
				message: err.response?.data?.message || SERVER_ERROR_MESSAGE
			};

			if (err.response?.status === 401) {
				errObject.message = 'You must login to make challenge response';
			}

			return fail(err.response?.status || 500, errObject);
		}
	},
	'challenges/responses/votes': async (event) => {
		const axios = axiosWithCookies(event);

		const formData = await event.request.formData();
		const id = formData.get('challengeResponseID');
		const voteType = formData.get('voteType');

		try {
			const response = await axios.post('/challenges/responses/votes', {
				challengeResponseID: id,
				voteType: voteType
			});

			return {
				id: 'postVote',
				success: true,
				message: response.data.message
			};
		} catch (err) {
			let errObject = {
				id: 'postVote',
				success: false,
				message: err.response?.data?.message || SERVER_ERROR_MESSAGE
			};

			if (err.response?.status === 401) {
				errObject.message = 'You must login to vote';
			}

			return fail(err.response?.status || 500, errObject);
		}
	},
	comments: CommentAPI.newChallenge,
	'comments/reply': CommentAPI.replyChallenge,
	'comments/delete': CommentAPI.delete,
	'comments/modify': CommentAPI.modify
};
