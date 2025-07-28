import { axiosWithCookies } from '$lib/server/utils';

// All the server endpoint for Comment component
export const CommentAPI = {
	newChallenge: async (event) => {
		const axios = axiosWithCookies(event);
		const formData = await event.request.formData();
		const content = formData.get('content');
		const challengeID = formData.get('challengeID');

		const data = { content: content, challengeID: challengeID };

		try {
			const response = await axios.post('/comments', data);

			return {
				id: 'comment',
				success: true,
				message: response.data.message
			};
		} catch (err) {
			let message = err.response.data.message;
			if (err.response.status === 401) {
				message = 'You must login to make a comment';
			}
			return {
				id: 'comment',
				success: false,
				message: message
			};
		}
	},
	newChallengeResponse: async (event) => {
		const axios = axiosWithCookies(event);
		const formData = await event.request.formData();
		const content = formData.get('content');
		const challengeResponseID = formData.get('challengeResponseID');

		const data = { content: content, challengeResponseID: challengeResponseID };

		try {
			const response = await axios.post('/comments', data);

			return {
				id: 'comment',
				success: true,
				message: response.data.message
			};
		} catch (err) {
			let message = err.response.data.message;
			if (err.response.status === 401) {
				message = 'You must login to make a comment';
			}
			return {
				id: 'comment',
				success: false,
				message: message
			};
		}
	},
	replyChallenge: async (event) => {
		const axios = axiosWithCookies(event);

		const formData = await event.request.formData();
		const content = formData.get('content');
		const parentID = formData.get('parentID');
		const challengeID = formData.get('challengeID');

		const data = {
			content: content,
			parentID: parentID,
			challengeID: challengeID
		};

		try {
			const response = await axios.post('/comments', data);
			return {
				id: 'replyComment',
				success: true,
				message: response.data.message
			};
		} catch (err) {
			let message = err.response.data.message;

			if (err.response.status === 401) {
				message = 'You must login to reply comment';
			}

			return {
				id: 'replyComment',
				success: false,
				message: message
			};
		}
	},
	replyChallengeResponse: async (event) => {
		const axios = axiosWithCookies(event);
		const formData = await event.request.formData();
		const content = formData.get('content');
		const parentID = formData.get('parentID');
		const challengeResponseID = formData.get('challengeResponseID');

		const data = { content: content, parentID: parentID, challengeResponseID: challengeResponseID };

		try {
			const response = await axios.post('/comments', data);
			return {
				id: 'replyComment',
				success: true,
				message: response.data.message
			};
		} catch (err) {
			let message = err.response.data.message;

			if (err.response.status === 401) {
				message = 'You must login to reply comment';
			}
			return {
				id: 'replyComment',
				success: false,
				message: message
			};
		}
	},
	delete: async (event) => {
		const axios = axiosWithCookies(event);
		const formData = await event.request.formData();
		const id = formData.get('id');

		try {
			const response = await axios.delete('/comments', { data: { commentID: id } });
			return {
				id: 'deleteComment',
				success: true,
				message: response.data.message
			};
		} catch (err) {
			return {
				id: 'deleteComment',
				success: false,
				message: err.response.data.message
			};
		}
	},
	modify: async (event) => {
		const axios = axiosWithCookies(event);
		const formData = await event.request.formData();
		const id = formData.get('commentID');
		const content = formData.get('content');

		try {
			const response = await axios.put('/comments', {
				commentID: id,
				content: content
			});

			return {
				id: 'modifyComment',
				success: true,
				message: response.data.message
			};
		} catch (err) {
			return {
				id: 'modifyComment',
				success: false,
				message: err.response.data.message
			};
		}
	}
};
