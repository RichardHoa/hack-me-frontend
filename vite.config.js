import { paraglideVitePlugin } from '@inlang/paraglide-js';
// @ts-ignore
import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
// @ts-ignore
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		devtoolsJson(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['cookie', 'preferredLanguage', 'baseLocale'],
			urlPatterns: [
				{
					pattern: '/challenge/:name',
					localized: [
						['en', '/challenge/:name'],
						['vi', '/thu-thach/:name']
					]
				},
				{
					pattern: '/challenge',
					localized: [
						['en', '/challenge'],
						['vi', '/thu-thach']
					]
				},
				// Wildcard pattern for untranslated routes
				{
					pattern: '/:path(.*)?',
					localized: [
						['en', '/:path(.*)?'],
						['vi', '/:path(.*)?']
					]
				}
			]
		})
	],

	test: {
		projects: [
			{
				extends: './vite.config.js',
				test: {
					name: 'client',
					environment: 'browser',
					browser: {
						enabled: true,
						provider: 'playwright',
						instances: [{ browser: 'chromium' }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.js']
				}
			},
			{
				extends: './vite.config.js',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
