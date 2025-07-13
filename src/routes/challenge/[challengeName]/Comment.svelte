<script>
	// @ts-nocheck

	import { marked } from 'marked';
	import { formatDate } from '$lib/utils.js';
	import Comment from './Comment.svelte';
	import DOMPurify from 'dompurify';
	import { enhance } from '$app/forms';
	let { comment, challengeID = null, challengeResponseID = null } = $props();

	let replyContent = $state('');
	let showReply = $state(false);
	let formResult = $state('');
</script>

<div class="comment">
	<div class="comment-meta">
		<strong>{comment.author}</strong> • {formatDate(comment.createdAt)}
	</div>
	<div class="comment-content">
		{@html comment.content}
	</div>

	<!-- Reply button -->
	<button class="reply-button" onclick={() => (showReply = !showReply)}>
		{showReply ? 'Cancel' : 'Reply'}
	</button>

	{#if showReply}
		<form
			method="POST"
			action="?/comments/reply"
			class="reply-form"
			use:enhance={({ formElement, formData, action, cancel, submitter }) => {
				return async ({ result, update }) => {
					formResult = result.data;
					await update();
					if (result.data.success === true) {
						showReply = false;
					}
				};
			}}
		>
			<input type="hidden" value={challengeResponseID} name="challengeResponseID" />
			<input type="hidden" value={challengeID} name="challengeID" />
			<input type="hidden" value={comment.id} name="parentID" />
			<textarea rows="3" required placeholder="Write your reply..." name="content"></textarea>
			<button type="submit">Submit Reply</button>
		</form>
		{#if formResult?.id === 'replyComment'}
			{#if formResult.success == false}
				<p class="error-message" role="alert">{formResult.message}</p>
			{/if}
		{/if}
	{/if}

	{#if comment.comments?.length}
		<details>
			<summary>More comments</summary>

			<div class="comment-children">
				{#each comment.comments as child}
					<Comment comment={child} {challengeID} {challengeResponseID} />
				{/each}
			</div>
		</details>
	{/if}
</div>

<style>
	.error-message {
		text-align: center;
		margin-top: 5px;
	}
	.comment {
		border: 1px solid #ccc;
		border-radius: 6px;
		padding: 1rem;
		background: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		margin-top: 0.5rem;
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
