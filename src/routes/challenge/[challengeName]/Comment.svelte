<script>
	import { marked } from 'marked';
	import { formatDate } from '$lib/utils.js';
	import Comment from './Comment.svelte';
	let { comment } = $props();
</script>

<div class="comment">
	<div class="comment-meta">
		<strong>{comment.author}</strong> • {formatDate(comment.createdAt)}
	</div>
	<div class="comment-content">
		{@html marked.parse(comment.content)}
	</div>

	{#if comment.comments?.length}
		<div class="comment-children">
			{#each comment.comments as child}
				<Comment comment={child} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.comment {
		border: 1px solid #ccc;
		border-radius: 6px;
		padding: 1rem;
		background: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		margin-top: 1rem;
	}

	.comment-meta {
		font-size: 0.9rem;
		color: #666;
		margin-bottom: 0.5rem;
	}

	.comment-content {
		color: #333;
	}

	.comment-children {
		margin-top: 1rem;
		padding-left: 1.5rem;
		border-left: 2px solid #eee;
	}
</style>
