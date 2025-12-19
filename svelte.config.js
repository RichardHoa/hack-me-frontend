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
					'sha256-ROCYlxtWUqR9ME4wxI9LchLFa/eBFKzkqmIeHvTRK00=',
					'sha256-oOU4MxtCWQ62F7icj69SaREaDhbdyXILlAZ+wog1m9M=',
				],
				'object-src': ['none'],
				'base-uri': ['none'],
				'connect-src': ["'self'"],
				'frame-src': ["'none'"],
				'frame-ancestors': ["'none'"],
				'media-src': ["'none'"],
				'manifest-src': ["'self'"],
				'worker-src': ["'self'"],
				'form-action': ["'self'"],
				'upgrade-insecure-requests': true,
				'block-all-mixed-content': true
			}
		}
	}
};

export default config;
