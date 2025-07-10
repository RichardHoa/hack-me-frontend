<script>
	let { data } = $props();
	import { formatDate } from '$lib/utils.js';
	const challenges = data.data.data;
	const metadata = data.data.metadata;

	let currentPage = Number(metadata.currentPage);
	const maxPage = Number(metadata.maxPage);
	const pageSize = 10; // You can tweak this as needed

	function goToPage(pageNumber) {
		// You can wire this up to an actual route if server-side pagination is needed
		if (pageNumber >= 1 && pageNumber <= maxPage) {
		}
	}

	function truncate(text, length = 50) {
		return text.length > length ? text.slice(0, length) + '…' : text;
	}

</script>

{#each challenges as c}
	<a href={`/challenge/${encodeURIComponent(c.name)}`} class="challenge-link">
		<div class="challenge-box">
			<h2>{c.name}</h2>
			<h3>Author: {c.userName}</h3>
			<h3>Created: {formatDate(c.createdAt)}</h3>
			<p>{truncate(c.content)}</p>
		</div>
	</a>
{/each}

<div class="pagination">
	<button onclick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}> ⬅ Prev </button>
	<span>Page {currentPage} of {maxPage}</span>
	<button onclick={() => goToPage(currentPage + 1)} disabled={currentPage === maxPage}>
		Next ➡
	</button>
</div>

<style>
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
		border: 1px solid black;
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
		border: 1px solid black;
		background: white;
		cursor: pointer;
		border-radius: 4px;
		transition: background 0.2s ease;
	}

	.pagination button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.pagination button:hover:not(:disabled) {
		background: #eee;
	}

	.pagination span {
		font-size: 1rem;
	}
</style>
