<script>
	// @ts-nocheck

	import Comment from './Comment.svelte';
	import { CHALLENGE_CATEGORIES, formatDate, formatNow } from '$lib/utils.js';
	import { ArrowUpFromDot } from 'lucide-svelte';
	import { marked } from 'marked';
	import { error } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	let { data, form } = $props();
	let challenge = $derived(data.challenge);
	let comments = $derived(data.challenge.comments);
	let challengeResponse = $derived(data.challengeResponse);

	let editMode = $state(false);
	let challengeResponseMode = $state(false);
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
	{:else}
		<button onclick={() => (challengeResponseMode = !challengeResponseMode)}
			>{!challengeResponseMode ? 'Make a response' : 'Exit the form'}
		</button>
	{/if}
</div>

{#if editMode === false && challengeResponseMode === false}
	<div class="challenge-content">
		{@html marked.parse(challenge.content)}
	</div>
	<h2 class="heading">Comments</h2>
	<form>
		<label>
			Make a comment
			<input type="text" />
		</label>
		<button type="submit">Comment</button>
	</form>
	{#if comments?.length > 0}
		<div class="comments">
			{#each comments as comment}
				<Comment {comment} />
			{/each}
		</div>
	{:else}
		<p class="no-comments">No comments yet.</p>
	{/if}

	<h2 class="heading">Challenge Responses</h2>
	{#key challengeResponse.length}
		{#each challengeResponse as res}
			<div class="challenge-response">
				<div class="response-meta">
					<h2 class="response-title">{res.name}</h2>
					<p class="response-author">By: {res.authorName}</p>
					<p class="response-time">
						Created: {formatDate(res.createdAt)}
					</p>
				</div>

				<div class="response-content">
					{@html marked.parse(res.content)}
				</div>

				<div class="response-votes">
					<span class="vote up">⬆️ {res.upVote}</span>
					<span class="vote down">⬇️ {res.downVote}</span>
				</div>

				{#if res.comments?.length > 0}
					<h3 class="comment-heading">Comments</h3>
					<div class="comments">
						{#each res.comments as comment}
							<Comment {comment} />
						{/each}
					</div>
				{:else}
					<p class="no-comments">No comments yet.</p>
				{/if}
			</div>
		{/each}
	{/key}
{:else if editMode === true}
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
					formResult = result.data;

					if (formResult.newName !== '') {
						setTimeout(() => {
							window.location.href = localizeHref(
								`/challenge/${encodeURIComponent(formResult.newName)}`
							);
						}, 2000);
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
					You will be redirect to a new page after 2 seconds
				</div>
			{/if}
		{/if}
	</div>
{:else if challengeResponseMode === true}
	<div class="form-challenge form-card">
		<h2>Challenge response</h2>

		<!-- challenge response -->
		<form
			method="POST"
			action="?/challenges/responses"
			use:enhance={({ formElement, formData, action, cancel, submitter }) => {
				formSubmit = true;
				const content = formData.get('content');
				const name = formData.get('name');
				return async ({ result, update }) => {
					await update();
					formSubmit = false;
				};
			}}
		>
			<input type="hidden" value={challenge.ID} name="challengeID" />
			<label for="responseName">
				Challenge response name
				<input type="text" id="responseName" name="name" required />
			</label>

			<label for="content">Content</label>
			<small id="content-helper">The content can be displayed in Markdown</small>
			<textarea id="content" name="content" rows="30" required aria-describedby="content-helper"
			></textarea>
			<button type="submit" class="submit-button" disabled={formSubmit}
				>{formSubmit ? 'Please wait' : 'Make a challenge response'}</button
			>
		</form>

		{#if form}
			<div class={form.success ? 'success-message' : 'error-message'} role="alert">
				{form.message}
			</div>
		{/if}
	</div>
{/if}

<style>
	.challenge-response {
		border: 1px solid var(--light-gray);
		padding: 1rem;
		margin-bottom: 1.5rem;
		border-radius: 8px;
	}

	.response-meta {
		margin-bottom: 1rem;
	}

	.response-title {
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.response-author,
	.response-time {
		font-size: 0.9rem;
	}

	.response-content {
		margin: 1rem 0;
	}

	.response-votes {
		display: flex;
		gap: 1rem;
		font-size: 1rem;
		font-weight: bold;
	}

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

	.heading {
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

	.form-challenge {
		max-width: 800px;
	}
</style>
