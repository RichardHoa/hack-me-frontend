// @ts-nocheck
import { localizeHref } from '$lib/paraglide/runtime.js';
import { axiosWithCookies, requireLogin } from '$lib/server/utils';
import { SERVER_ERROR_MESSAGE, lowerHeaderRenderer } from '$lib/utils';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { error, fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { CommentAPI } from '$lib/components/Comment/Comment';

export async function load({ params }) {
	marked.use({ renderer: lowerHeaderRenderer });
	const window = new JSDOM('').window;
	const purify = DOMPurify(window);

	const user = requireLogin();
	const challengeResult = await axios.get(`/challenges/responses?challengeResponseID=${params.id}`);
	const challengeResponse = challengeResult.data.data[0];

	if (!challengeResponse) {
		throw error(400, `Challenge response with id: ${params.id} cannot be found`);
	}

	const rawContent = challengeResponse.content;

	challengeResponse.content = purify.sanitize(marked.parse(challengeResponse.content));

	return {
		challengeResponse: challengeResponse,
		rawContent: rawContent,
		user: user
	};
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
			return fail(err.response?.status || 500, {
				id: 'challengeResponse',
				success: false,
				message: err.response?.data?.message || SERVER_ERROR_MESSAGE
			});
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
			return fail(err.response?.status || 500, {
				id: 'deleteChallengeResponse',
				success: false,
				message: err.response?.data?.message || SERVER_ERROR_MESSAGE
			});
		}

		redirect(308, localizeHref('/challenge'));
	},
	comments: CommentAPI.newChallengeResponse,
	'comments/reply': CommentAPI.replyChallengeResponse,
	'comments/delete': CommentAPI.delete,
	'comments/modify': CommentAPI.modify
};
