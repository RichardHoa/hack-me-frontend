<script>
	// @ts-nocheck
	import { marked } from 'marked';
	import { formatDate } from '$lib/utils.js';
	import DOMPurify from 'dompurify';
	import { enhance } from '$app/forms';
	import Comment from '$lib/components/Comment/Comment.svelte';
	let { comment, author, challengeID = null, challengeResponseID = null } = $props();

	let showReply = $state(false);
	let editMode = $state(false);
	let formResult = $state('');
	let isLoading = $state(false);

	function handleDeleteComment() {
		document.getElementById(`delete-comment-${comment.id}`).click();
	}

	function handleModifyComment() {
		document.getElementById(`modify-comment-${comment.id}`).click();
	}
</script>

<div class="comment">
	<div class="comment-meta">
		<strong>{comment.author}</strong> • {formatDate(comment.createdAt)}
		{comment.createdAt !== comment.updatedAt ? `• Edited at ${formatDate(comment.updatedAt)}` : ''}
	</div>

	{#if editMode}
		<form
			method="POST"
			action="?/comments/modify"
			class="reply-form"
			use:enhance={({ formElement, formData, action, cancel, submitter }) => {
				return async ({ result, update }) => {
					isLoading = true;
					formResult = result.data;
					await update();
					if (result.data.success === true) {
						editMode = false;
					}
					isLoading = false;
				};
			}}
		>
			<input type="hidden" value={comment.id} name="commentID" />
			<textarea
				rows="3"
				required
				name="content"
				defaultValue={isLoading ? 'Updating....' : comment.content}
				autocorrect="off"
				spellcheck="false"
			></textarea>
			<button type="submit" id={`modify-comment-${comment.id}`} onclick={handleModifyComment}
				>{isLoading ? 'Please wait' : 'Edit comment'}</button
			>
		</form>
	{:else}
		<div class="comment-content">
			{comment.content}
		</div>
	{/if}

	{#if author}
		{#if comment.author === author}
			<button onclick={() => (editMode = !editMode)}
				>{editMode ? 'Exit edit mode' : 'Edit comment'}</button
			>
		{/if}

		<button onclick={handleDeleteComment}>{isLoading ? 'Please wait' : 'Delete comment'}</button>
	{/if}

	<button onclick={() => (showReply = !showReply)}>
		{showReply ? 'Cancel' : 'Reply'}
	</button>

	{#if showReply}
		<form
			method="POST"
			action="?/comments/reply"
			class="reply-form"
			use:enhance={({ formElement, formData, action, cancel, submitter }) => {
				return async ({ result, update }) => {
					isLoading = true;
					formResult = result.data;
					await update();
					isLoading = false;
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
			<button type="submit">{isLoading ? 'Please wait' : 'Reply'}</button>
		</form>
	{/if}
	{#if formResult?.id === 'replyComment' || formResult?.id === 'deleteComment'}
		{#if formResult.success == false}
			<p class="error-message" role="alert">{formResult.message}</p>
		{/if}
	{/if}

	{#if comment.comments?.length}
		<details>
			<summary>More comments</summary>

			<div class="comment-children">
				{#each comment.comments as child}
					<Comment comment={child} {challengeID} {challengeResponseID} {author} />
				{/each}
			</div>
		</details>
	{/if}

	<!-- Hidden form to delete comment -->
	<form
		method="POST"
		action="?/comments/delete"
		class="reply-form"
		style="display: none;"
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			return async ({ result, update }) => {
				isLoading = true;
				formResult = result.data;
				await update();
				isLoading = false;
				if (result.data.success === true) {
					showReply = false;
				}
			};
		}}
	>
		<input type="hidden" name="id" value={comment.id} />
		<button id={`delete-comment-${comment.id}`}>Submit form</button>
	</form>
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
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		margin-top: 0.5rem;
	}

	.comment-meta {
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
	}

	.comment-children {
		margin-top: 1rem;
		padding-left: 1.5rem;
		border-left: 2px solid #eee;
	}
</style>
