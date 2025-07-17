// @ts-nocheck
import { localizeHref } from '$lib/paraglide/runtime.js';
import { axiosWithCookies } from '$lib/utils';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { fail } from 'assert';
import axios from 'axios';
import { goto } from '$app/navigation';
import { CommentAPI } from '$lib/components/Comment/Comment';

export async function load({ params }) {
	const window = new JSDOM('').window;
	const purify = DOMPurify(window);
	try {
		const url = `/challenges?exactName=${params.challengeName}`;
		const response = await axios.get(url);

		const challenge = response.data.data[0];
		if (!challenge) {
			throw error(400, `Challenge name: |${params.challengeName}| cannot be found`);
		}

		const challengeID = response.data.data[0].id;
		const challengeResult = await axios.get(`/challenges/responses?challengeID=${challengeID}`);
		const challengeResponses = challengeResult.data.data;

		for (let i = 0; i < challengeResponses.length; i++) {
			challengeResponses[i].content = purify.sanitize(marked.parse(challengeResponses[i].content));
		}

		const rawChallengeContent = challenge.content;
		challenge.content = purify.sanitize(marked.parse(challenge.content));

		return {
			challenge: challenge,
			rawChallengeContent: rawChallengeContent,
			challengeResponses: challengeResponses
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
			return {
				success: false,
				message: err.response.data.message
			};
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
			return {
				id: 'challengeDelete',
				success: false,
				message: `error while delete challenge: ${err.response.data.message}`
			};
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
			let message = err.response.data.message;
			if (err.response.status === 401) {
				message = 'You must login to make challenge response';
			}

			return {
				success: false,
				message: message
			};
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
			return {
				id: 'postVote',
				success: false,
				message: `Error while post new vote: ${err.response.data.message}`
			};
		}
	},
	comments: CommentAPI.newChallenge,
	'comments/reply': CommentAPI.replyChallenge,
	'comments/delete': CommentAPI.delete,
	'comments/modify': CommentAPI.modify
};
