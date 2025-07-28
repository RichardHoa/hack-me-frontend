import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		csp: {
			directives: {
				// 'script-src': ['strict-dynamic', 'https://accounts.google.com/gsi/client'],
				// 'connect-src': [
				// 	'https://accounts.google.com/gsi/',
				// 	'http://localhost:5173',
				// 	'http://localhost:8080',
				// 	'http://localhost:3000'
				// ],
				// 'frame-src': ['https://accounts.google.com/gsi/'],
				// 'object-src': ['none'],
				// 'base-uri': ['none']

				'script-src': ['strict-dynamic', 'https: unsafe-inline'],
				'object-src': ['none'],
				'base-uri': ['none']
			}
		}
	}
};

export default config;
