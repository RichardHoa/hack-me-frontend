<script>
	import { localizeHref } from '$lib/paraglide/runtime.js';

	const sitemap = [
		{
			title: 'Home',
			path: '/'
		},
		{
			title: 'Challenges',
			path: '/challenge',
			children: [
				{
					title: 'Add New Challenge',
					path: '/add-challenge'
				}
			]
		},
		{
			title: 'User',
			path: '#',
			children: [
				{
					title: 'Login / Register',
					path: '/login'
				},
				{
					title: 'My Account',
					path: '/account'
				}
			]
		}
	];
</script>

<svelte:head>
	<title>HACKME: Sitemap</title>
</svelte:head>

<div class="sitemap-container">
	<h1>Sitemap</h1>
	<p>Use this page to navigate the main sections of the website.</p>
	<ul class="sitemap-list">
		{#each sitemap as item}
			<li>
				{#if item.path === '#'}
					<span>{item.title}</span>
				{:else}
					<a href={localizeHref(item.path)}>{item.title}</a>
				{/if}

				{#if item.children}
					<ul class="sitemap-children">
						{#each item.children as child}
							<li>
								<a href={localizeHref(child.path)}>{child.title}</a>
							</li>
						{/each}
					</ul>
				{/if}
			</li>
		{/each}
	</ul>
</div>

<style>
	.sitemap-container {
		background-color: var(--background);
		padding: 2rem;
		border-radius: 8px;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
		border-bottom: 2px solid var(--light-gray);
		padding-bottom: 0.5rem;
	}

	p {
		margin-bottom: 2rem;
	}

	.sitemap-list,
	.sitemap-children {
		list-style: none;
		padding-left: 0;
	}

	.sitemap-list > li {
		margin-bottom: 1rem;
		font-size: 1.25rem;
	}

	.sitemap-children {
		padding-left: 2rem;
		margin-top: 0.5rem;
	}

	.sitemap-children li {
		margin-bottom: 0.5rem;
		font-size: 1rem;
	}

	a:hover {
		color: var(--hightlight);
		text-decoration: underline;
	}

	span {
		font-weight: bold;
	}
</style>
