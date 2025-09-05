import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		csp: {
			directives: {
				'script-src': ['strict-dynamic', 'https: unsafe-inline'],
				'object-src': ['none'],
				'base-uri': ['none'],
				'frame-ancestors': ['none']
			}
		}
	}
};

export default config;
