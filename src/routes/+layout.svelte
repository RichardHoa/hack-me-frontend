<script>
	import { ModeWatcher } from 'mode-watcher';
	let { children } = $props();
	import ThemeToggle from './ThemeToggle.svelte';
	import '../app.css';
</script>

<ModeWatcher defaultMode="dark" />

<nav>
	<img src="" alt="Logo" class="logo" />
	<div>
		<ul class="menu">
			<li><a href="/" class="hover:underline">Home</a></li>
			<li><a href="/about" class="hover:underline">About</a></li>
			<li><a href="/contact" class="hover:underline">Contact</a></li>
		</ul>
		<ThemeToggle />
	</div>
</nav>

<main>
	{@render children()}
</main>

<style>
	main {
		max-width: 1200px;
		margin: 30px auto 0px auto;
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
