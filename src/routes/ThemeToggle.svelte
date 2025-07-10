<script>
	import { Sun } from '@lucide/svelte';
	import { Moon } from '@lucide/svelte';

	import { toggleMode, mode } from 'mode-watcher';
</script>

<button on:click={toggleMode}>
	{#if mode.current === 'light'}
		<Sun />
	{:else}
		<Moon />
	{/if}
	<span>Toggle theme</span>
</button>

<style>
	button {
		display: flex;
		align-items: center;
		gap: 0.5rem; /* spacing between icon and text */
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 6px;
		background-color: var(--light-gray);
		color: var(--background);
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	button:hover {
		background-color: var(--light-gray); /* slightly darker on hover */
	}
</style>
