<script>
	// @ts-nocheck

	import Comment from './Comment.svelte';
	import { CHALLENGE_CATEGORIES, formatDate } from '$lib/utils.js';
	import { marked } from 'marked';
	import { error } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	let { data, form } = $props();
	const challenge = data.data.data[0];

	let editMode = $state(false);
	let formSubmit = $state(false);
	let formResult = $state(null);
</script>

<svelte:head>
	<title>HACKME: {challenge.name} challenge</title>
</svelte:head>

<h1 class="challenge-title">{challenge.name}</h1>

<div class="challenge-meta">
	<h3>Author: {challenge.userName}</h3>
	<h3>Category: {challenge.category}</h3>
	<h3>Created: {formatDate(challenge.createdAt)}</h3>
	<h3>Last Updated: {formatDate(challenge.updatedAt)}</h3>
	<!-- allow challenge edit directly -->
	{#if data.user.userName === challenge.userName}
		<button onclick={() => (editMode = !editMode)}
			>{!editMode ? 'Edit challenge' : 'Exit edit mode'}</button
		>
	{/if}
</div>

{#if editMode === false}
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
{:else}
	<div class="form-card">
		<h2>Edit mode</h2>

		<!-- Modify challenge -->
		<form
			method="POST"
			action="?/challenges"
			use:enhance={({ formElement, formData, action, cancel, submitter }) => {
				formSubmit = true;
				return async ({ result, update }) => {
					// await update();
					formSubmit = false;

					if (result.type === 'success' || result.type === 'failure') {
						formResult = result.data;

						if (result.data.success) {
							setTimeout(() => {
								window.location.href = localizeHref(
									`/challenge/${encodeURIComponent(result.data.newName)}`
								);
							}, 2000);
						}
					}
				};
			}}
		>
			<input type="hidden" name="oldName" value={challenge.name} />
			<label for="challengeName">
				Challenge name
				<input type="text" id="challengeName" name="name" required defaultvalue={challenge.name} />
			</label>
			<fieldset class="category-fieldset">
				<legend>Category</legend>
				{#each CHALLENGE_CATEGORIES as cat}
					<label class="category-label">
						<input
							type="radio"
							value={cat}
							name="category"
							required
							checked={cat === challenge.category}
						/>
						{cat}
					</label>
				{/each}
			</fieldset>

			<label for="content">Content</label>
			<small id="content-helper">The content can be displayed in Markdown</small>
			<textarea
				id="content"
				name="content"
				rows="30"
				required
				aria-describedby="content-helper"
				defaultValue={challenge.content}
			></textarea>
			<button type="submit" class="submit-button" disabled={formSubmit}
				>{formSubmit ? 'Please wait' : 'Edit challenge'}</button
			>
		</form>

		{#if formResult}
			{#if formResult.success === false}
				<p class="error-message" role="alert">{formResult.message}</p>
			{:else if formResult.success === true}
				<div class="success-message">
					{formResult.message}
					<br />
					The page will reload in 2 seconds
				</div>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.form-card {
		max-width: 1200px;
	}
	.error-message,
	.success-message {
		text-align: center;
	}

	input[type='text'] {
		width: 100%;
		display: block;
	}
	.challenge-title {
		text-align: center;
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	h2 {
		text-align: center;
		font-size: 1.8rem;
	}

	.challenge-meta h3 {
		margin: 0.2rem 0;
	}

	.challenge-content {
		margin: 1rem 0 2rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 6px;
	}

	:global(.challenge-content h1) {
		font-size: 2rem;
	}

	:global(.challenge-content img) {
		width: 100%;
		display: block;
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
		font-style: italic;
		margin-top: 1rem;
	}
</style>
