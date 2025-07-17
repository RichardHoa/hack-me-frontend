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
import { CommentAPI } from '$lib/components/Comment/Comment';

export async function load({ params }) {
	const window = new JSDOM('').window;
	const purify = DOMPurify(window);
	try {
		const challengeResult = await axios.get(
			`/challenges/responses?challengeResponseID=${params.id}`
		);
		const challengeResponse = challengeResult.data.data[0];

		const rawContent = challengeResponse.content;

		if (!challengeResponse) {
			throw error(400, `Challenge response: |${params.id}| cannot be found`);
		}

		challengeResponse.content = purify.sanitize(marked.parse(challengeResponse.content));

		return {
			challengeResponse: challengeResponse,
			rawContent: rawContent
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
	'challenges/response': async (event) => {
		const axios = axiosWithCookies(event);

		const formData = await event.request.formData();
		const content = formData.get('content');
		const name = formData.get('name');
		const challengeResponseID = formData.get('challengeResponseID');

		try {
			const response = await axios.put('/challenges/responses', {
				challengeResponseID: challengeResponseID,
				name: name,
				content: content
			});

			return {
				id: 'challengeResponse',
				success: true,
				message: response.data.message
			};
		} catch (err) {
			console.error(err.response.data);
			return {
				id: 'challengeResponse',
				success: false,
				message: err.response.data.message
			};
		}
	},
	'challenges/response/delete': async (event) => {
		const axios = axiosWithCookies(event);

		const formData = await event.request.formData();
		const id = formData.get('id');

		try {
			const response = await axios.delete('/challenges/responses', {
				data: {
					challengeResponseID: id
				}
			});
		} catch (err) {
			console.error(err.response.data);
			return {
				id: 'deleteChallengeResponse',
				success: false,
				message: err.response.data.message
			};
		}

		redirect(308, localizeHref('/challenge'));
	},
	comments: CommentAPI.newChallengeResponse,
	'comments/reply': CommentAPI.replyChallengeResponse,
	'comments/delete': CommentAPI.delete,
	'comments/modify': CommentAPI.modify
};
