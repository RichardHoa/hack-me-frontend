<script>
	// @ts-nocheck
	import { ModeWatcher } from 'mode-watcher';
	let { children, data } = $props();
	import ThemeToggle from './ThemeToggle.svelte';
	import '../app.css';
	import { localizeHref, setLocale, locales, getLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import { page } from '$app/state';

	function isCurrentPage(path) {
		return page.url.pathname === path;
	}

	function handleLocaleChange(event) {
		const newLocale = event.target.value;
		setLocale(newLocale);
	}
</script>

<ModeWatcher defaultMode="dark" />

<header>
	<nav>
		<a class="skip-to-content-link" href="#main"> Skip to main content </a>
		<div>
			<ul class="menu">
				<li>
					<a href="/" class:active-link={isCurrentPage('/')}>
						{m.true_stock_fireant_startle()}
					</a>
				</li>
				<li>
					<a
						data-sveltekit-preload-data="hover"
						href={localizeHref('/challenge')}
						class:active-link={isCurrentPage(localizeHref('/challenge'))}
					>
						{m.neat_close_elk_smile()}
					</a>
				</li>
				<li>
					{#if data.user != undefined}
						<a
							data-sveltekit-preload-data="hover"
							href={localizeHref('/account')}
							class:active-link={isCurrentPage(localizeHref('/account'))}
						>
							Account
						</a>
					{:else}
						<a
							data-sveltekit-reload
							href={localizeHref('/login')}
							class:active-link={isCurrentPage(localizeHref('/login'))}
						>
							Login / Register
						</a>
					{/if}
				</li>
			</ul>
			<ThemeToggle />

			<div class="language-selector">
				<label for="locale-select">Language:</label>
				<select id="locale-select" value={getLocale()} onchange={handleLocaleChange}>
					{#each locales as locale (locale)}
						<option value={locale}>{locale.toUpperCase()}</option>
					{/each}
				</select>
			</div>
		</div>
	</nav>
</header>

<main id="main">
	{@render children()}
</main>

<footer>
	<a href={localizeHref('/site-map')}>Site map</a>

	<br />
	{@html m.trick_front_lion_create()}
</footer>

<style>
	.language-selector {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	select {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		border: 1px solid #ccc;
	}

	.skip-to-content-link {
		background: var(--hightlight);
		color: black;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		font-weight: 600;
		left: 30%;
		padding: 8px;
		position: absolute;
		transform: translateY(-300%);
		transition: transform 0.3s;
	}

	.skip-to-content-link:focus {
		transform: translateY(0%);
	}

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
		height: 60px;
		width: 100%;
		background-color: var(--background);
	}

	nav > div {
		display: flex;
		align-items: center;
		margin-right: 30px;
		gap: 1.5rem;
		margin-left: auto;
	}

	nav ul {
		display: flex;
		flex-wrap: wrap;
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

	@media (max-width: 768px) {
		nav {
			flex-direction: column;
			height: auto;
			gap: 1rem;
			padding-block: 1rem;
		}

		nav > div {
			flex-direction: column;
			margin: 0 auto; /* Remove the margin for centered alignment */
		}

		nav ul {
			flex-direction: column;
			width: 100%;
		}

		nav ul li {
			width: 100%;
			text-align: center;
		}
	}
</style>
