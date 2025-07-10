<script>
	import Comment from './Comment.svelte';
	import { formatDate } from '$lib/utils.js';
	import { marked } from 'marked';
	let { data } = $props();

	const challenge = data.data.data[0];
</script>

<h1 class="challenge-title">{challenge.name}</h1>

<div class="challenge-meta">
	<h3>Author: {challenge.userName}</h3>
	<h3>Created: {formatDate(challenge.createdAt)}</h3>
	<h3>Last Updated: {formatDate(challenge.updatedAt)}</h3>
</div>

<div class="challenge-content">
	{@html marked.parse(challenge.content)}
</div>

{#if challenge.comments?.length > 0}
	<h2 class="comment-heading">Comments</h2>
	<div class="comments">
		{#each challenge.comments as comment}
			<Comment {comment} />
		{/each}
	</div>
{:else}
	<p class="no-comments">No comments yet.</p>
{/if}

<style>
	.challenge-title {
		text-align: center;
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.challenge-meta h3 {
		margin: 0.2rem 0;
		color: #555;
	}

	.challenge-content {
		margin: 1rem 0 2rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		background-color: #f9f9f9;
	}

	.comment-heading {
		font-size: 1.5rem;
		margin: 2rem 0 1rem;
	}

	.comments {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.no-comments {
		color: #888;
		font-style: italic;
		margin-top: 1rem;
	}
</style>
