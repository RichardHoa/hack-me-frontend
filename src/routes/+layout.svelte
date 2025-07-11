<script>
	import { ModeWatcher } from 'mode-watcher';
	let { children } = $props();
	import ThemeToggle from './ThemeToggle.svelte';
	import '../app.css';
	import { localizeHref, setLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';

	function isCurrentPage(path) {
		return page.url.pathname === path;
	}
</script>

<ModeWatcher defaultMode="dark" />

<nav>
	<img src="" alt="Logo" class="logo" />
	<div>
		<ul class="menu">
			<li>
				<a href="/" class:active-link={isCurrentPage('/')}>
					{m.true_stock_fireant_startle()}
				</a>
			</li>
			<li>
				<a
					href={localizeHref('/challenge')}
					class:active-link={isCurrentPage(localizeHref('/challenge'))}
				>
					{m.neat_close_elk_smile()}
				</a>
			</li>
			<li>
				<a href={localizeHref('/login')} class:active-link={isCurrentPage(localizeHref('/login'))}>
					Login
				</a>
			</li>
		</ul>
		<ThemeToggle />

		<button onclick={() => setLocale('en')}>en</button>
		<button onclick={() => setLocale('vi')}>vi</button>
	</div>
</nav>

<main>
	{@render children()}
</main>

<footer>
	{@html m.trick_front_lion_create()}
</footer>

<style>
	.active-link {
		font-weight: bold;
	}

	footer {
		padding: 20px;
		text-align: center;
		margin-top: 20px;
		height: 20px;
		background-color: var(--background);
	}

	main {
		max-width: 1200px;
		width: 100%;
		flex: 1;
		margin: 30px auto 0 auto;
		padding: 0 10px;
	}
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 60px;
		width: 100%;
		background-color: var(--background);
	}

	nav img {
		height: 40px;
		object-fit: contain;
	}

	nav > div {
		display: flex;
		align-items: center;
		margin-right: 30px;
		gap: 1.5rem;
	}

	nav ul {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 1rem;
	}

	nav a {
		text-decoration: none;
		color: inherit;
	}

	nav a:hover {
		text-decoration: underline;
	}
</style>
