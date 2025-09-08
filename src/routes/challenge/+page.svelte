<script>
	// @ts-nocheck
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { ArrowBigLeft } from 'lucide-svelte';
	import { ArrowBigRight } from 'lucide-svelte';

	import { m } from '$lib/paraglide/messages.js';
	import { CHALLENGE_CATEGORIES, DEFAULT_PAGE_SIZE, formatDate } from '$lib/utils.js';
	import axios from 'axios';
	import { fade } from 'svelte/transition';
	import { tick } from 'svelte';

	let { data } = $props();
	const challenges = data.data.data;
	const metadata = data.data.metadata;

	let currentPage = $state(Number(metadata.currentPage));
	let maxPage = $state(Number(metadata.maxPage));

	let selectedCategories = new Set();
	let searchTerm = $state('');
	let popularity = $state('desc');

	let filteredChallenges = $state(challenges);
	let loading = $state(false);
	let error = $state(null);

	async function fetchFilteredChallenges(page = 1) {
		currentPage = page;
		loading = true;
		error = null;

		const params = new URLSearchParams();

		if (selectedCategories.size > 0) {
			for (const category of selectedCategories) {
				params.append('category', category);
			}
		}
		if (searchTerm.trim()) {
			params.append('name', searchTerm.trim());
		}
		if (popularity) {
			params.append('popularity', popularity);
		}

		const url = `/api/challenges?page=${page}&pageSize=${DEFAULT_PAGE_SIZE}&${params.toString()}`;
		try {
			filteredChallenges = [];
			await tick();

			const res = await axios.get(url, { baseURL: '' });
			filteredChallenges = res.data.data;
			maxPage = Number(res.data.metadata.maxPage);
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	}

	function toggleCategory(cat) {
		if (selectedCategories.has(cat)) {
			selectedCategories.delete(cat);
		} else {
			selectedCategories.add(cat);
		}
		fetchFilteredChallenges();
	}

	function onSearchChange() {
		fetchFilteredChallenges();
	}

	function onSortChange(event) {
		popularity = event.target.value;
		fetchFilteredChallenges();
	}

	function goToPage(pageNumber) {
		if (pageNumber >= 1 && pageNumber <= maxPage) {
			currentPage = pageNumber;
			fetchFilteredChallenges(pageNumber);
		}
	}

	function truncate(text, length = 50) {
		return text.length > length ? text.slice(0, length) + '…' : text;
	}
</script>

<svelte:head>
	<title>HACKME: Challenges</title>
</svelte:head>
<h1>Challenges page</h1>
<form
	onsubmit={(e) => {
		e.preventDefault();
		fetchFilteredChallenges();
	}}
>
	<!-- ✅ Category Filter -->
	<fieldset>
		<legend>Category filter</legend>
		{#each CHALLENGE_CATEGORIES as cat}
			<label>
				<input
					type="checkbox"
					value={cat}
					checked={selectedCategories.has(cat)}
					onchange={() => toggleCategory(cat)}
				/>
				{cat}
			</label>
		{/each}
	</fieldset>

	<!-- 🔍 Name Search -->
	<label>
		Name search:
		<input type="text" bind:value={searchTerm} placeholder="Search challenge..." />
	</label>

	<!-- ↕️ Sort by Popularity -->
	<label>
		Popularity:
		<select bind:value={popularity} onchange={onSortChange}>
			<option value="desc">most-popular</option>
			<option value="asc">least-popular</option>
		</select>
	</label>
</form>

<a href={localizeHref('/add-challenge')}>Add new challenge</a>

<!-- 🧾 Result List -->
{#if error}
	<p class="error">{error}</p>
{:else if filteredChallenges.length !== 0}
	<div in:fade out:fade>
		{#each filteredChallenges as c}
			{#key c.name}
				<a href={localizeHref(`/challenge/${encodeURIComponent(c.name)}`)} class="challenge-link">
					<div class="challenge-box">
						<h2>{c.name}</h2>
						<h3>{m.inner_day_rooster_offer()}: {c.userName}</h3>
						<h3>{m.wild_teal_puffin_drip()}: {c.category}</h3>
						<h3>{m.lucky_true_bumblebee_gulp()}: {formatDate(c.createdAt)}</h3>
						<p>{truncate(c.content)}</p>
					</div>
				</a>
			{/key}
		{/each}
	</div>
{/if}

<div class="pagination">
	<button onclick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
		<ArrowBigLeft />
		{m.safe_aloof_lobster_hunt()}
	</button>
	<span
		>{m.lower_close_mantis_praise()} {currentPage} {m.next_away_starfish_harbor()} {maxPage}</span
	>
	<button onclick={() => goToPage(currentPage + 1)} disabled={currentPage === maxPage}>
		{m.mealy_safe_piranha_scold()}
		<ArrowBigRight />
	</button>
</div>

<style>
	a {
		margin: 10px 0;
		display: block;
	}
	h1 {
		font-size: 2rem;
		text-align: center;

		margin-bottom: 30px;
	}
	label {
		display: inline-block;
		margin-top: 0.5rem;
	}

	.challenge-link {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.challenge-link:hover .challenge-box {
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
		transform: translateY(-2px);
		transition: all 0.2s ease-in-out;
	}

	.challenge-box {
		border: 1px solid var(--light-gray);
		border-radius: 8px;
		padding: 1rem;
		margin-bottom: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		transition: box-shadow 0.2s ease;
	}

	.challenge-box h2 {
		margin: 0 0 0.5rem;
		font-size: 1.25rem;
	}

	.challenge-box h3 {
		margin: 0.25rem 0;
		font-size: 0.95rem;
	}

	.challenge-box p {
		margin-top: 0.75rem;
		font-size: 1rem;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-top: 2rem;
	}

	.pagination button {
		padding: 0.5rem 1rem;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border: 1px solid var(--light-gray);
		background: var(--background);
		cursor: pointer;
		border-radius: 4px;
		transition: background 0.2s ease;
	}

	.pagination button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.pagination span {
		font-size: 1rem;
	}
</style>
