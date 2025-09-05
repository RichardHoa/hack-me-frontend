import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		csp: {
			mode: 'auto',
			directives: {
				'script-src': [
					'strict-dynamic',
					'https:',
					"'unsafe-inline'",
					'sha256-ROCYlxtWUqR9ME4wxI9LchLFa/eBFKzkqmIeHvTRK00='
				],
				'object-src': ['none'],
				'base-uri': ['none']
			}
		}
	}
};

export default config;
