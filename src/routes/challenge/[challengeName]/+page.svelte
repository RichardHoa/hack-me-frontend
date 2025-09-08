<script>
	// @ts-nocheck

	import { CHALLENGE_CATEGORIES, formatDate } from '$lib/utils.js';
	import { ArrowUpFromDot, MoveDiagonal } from 'lucide-svelte';
	import { marked } from 'marked';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Comment from '$lib/components/Comment/Comment.svelte';
	let { data, form } = $props();
	let challenge = $derived(data.challenge);
	let comments = $derived(data.challenge.comments);
	let challengeResponses = $derived(data.challengeResponses);

	let editMode = $state(false);
	let challengeResponseMode = $state(false);
	let commentSubmit = $state(false);
	let formSubmit = $state(false);
	let formResult = $state(null);

	let dialogRef;

	function openConfirmDialog() {
		dialogRef.showModal();
	}

	function handleConfirmDelete() {
		document.getElementById('delete-challenge-button').click();
	}

	function handleCancel() {
		dialogRef.close();
	}
</script>

<svelte:head>
	<title>HACKME: {challenge.name} challenge</title>
</svelte:head>

<h1 class="challenge-title">
	<span class="visually-hidden">challenge name: </span>{challenge.name}
</h1>

<div class="meta">
	<div>Author: {challenge.userName}</div>
	<div>Category: {challenge.category}</div>
	<div>Created: {formatDate(challenge.createdAt)}</div>
	<div>Last Updated: {formatDate(challenge.updatedAt)}</div>
	{#if data.user?.userName === challenge.userName}
		<button onclick={() => (editMode = !editMode)}
			>{!editMode ? 'Edit challenge' : 'Exit edit mode'}</button
		>
		<button onclick={openConfirmDialog}>Delete the challenge</button>
	{:else}
		<button onclick={() => (challengeResponseMode = !challengeResponseMode)}
			>{!challengeResponseMode ? 'Make a  challenge response' : 'Exit the form'}
		</button>
	{/if}

	{#if form?.id === 'challengeDelete'}
		<div
			class={form.success ? 'success-message' : 'error-message'}
			style="text-align: center;"
			role="alert"
		>
			{form.message}
		</div>
	{/if}
</div>

{#if editMode === false && challengeResponseMode === false}
	<h2>Challenge Details</h2>
	<div class="challenge-content">
		{@html challenge.content}
	</div>

	<h2 class="heading">Challenge Responses</h2>
	{#if challengeResponses.length > 0}
		{#each challengeResponses as res}
			<div class="challenge-response">
				<a href={localizeHref(`/challenge/response/${res.id}`)}>
					<div class="response-meta">
						<h2 class="response-title">{res.name}</h2>
						<p class="response-author">By: {res.authorName}</p>
						<p class="response-time">
							Created: {formatDate(res.createdAt)}
						</p>
					</div>
				</a>

				<form
					id="voteForm"
					method="POST"
					action="?/challenges/responses/votes"
					use:enhance={({ formElement, formData, action, cancel, submitter }) => {
						formSubmit = true;
						return async ({ result, update }) => {
							await update();
							formSubmit = false;
						};
					}}
				>
					<input type="hidden" name="challengeResponseID" value={res.id} />

					<div class="response-votes">
						<button
							type="submit"
							name="voteType"
							value="upVote"
							class="vote up"
							disabled={formSubmit}
						>
							⬆️ {formSubmit ? 'Updating' : res.upVote}
						</button>

						<button
							type="submit"
							name="voteType"
							value="downVote"
							class="vote down"
							disabled={formSubmit}
						>
							⬇️
							{formSubmit ? 'Updating' : res.downVote}
						</button>
					</div>
					{#if form?.id === 'postVote'}
						{#if form.success === false}
							<p class="error-message" role="alert">{form.message}</p>
						{/if}
					{/if}
				</form>
			</div>
		{/each}
	{:else}
		<p class="no-comments">No challenge responses yet.</p>
	{/if}

	<h2 class="heading">Comments</h2>
	<form
		method="POST"
		action="?/comments"
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			commentSubmit = true;
			return async ({ result, update }) => {
				await update();
				commentSubmit = false;
			};
		}}
	>
		<label>
			Make a comment
			<input type="text" name="content" required />
		</label>
		<input type="hidden" name="challengeID" value={challenge.id} />
		<button type="submit">{!commentSubmit ? 'Comment' : 'Please wait'}</button>
	</form>
	{#if form?.id === 'comment'}
		{#if form.success === false}
			<p class="error-message" role="alert">{form.message}</p>
		{/if}
	{/if}
	{#if comments?.length > 0}
		<div><strong>Please note that comments can only be at most 5 level deep</strong></div>
		<div class="comments">
			{#each comments as comment}
				<Comment {comment} challengeID={challenge.id} author={data.user?.userName} />
			{/each}
		</div>
	{:else}
		<p class="no-comments">No comments yet.</p>
	{/if}
{:else if editMode === true}
	<div class="form-card">
		<h2>Edit mode</h2>

		<!-- edit the challenge -->
		<form
			method="POST"
			action="?/challenges"
			use:enhance={({ formElement, formData, action, cancel, submitter }) => {
				formSubmit = true;
				return async ({ result, update }) => {
					formSubmit = false;
					formResult = result.data;

					if (formResult.newName !== '' && formResult.success === true) {
						// Redirect user to new page because our url use challengeName, not challengeID
						setTimeout(() => {
							window.location.href = localizeHref(
								`/challenge/${encodeURIComponent(formResult.newName)}`
							);
						}, 2000);
					}

					if (formResult.newName === '' && formResult.success === true) {
						// if user does not change challenge name, proceed as usual
						await update();
						setTimeout(() => {
							editMode = false;
							formResult = null;
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
				spellcheck="false"
				autocorrect="off"
				required
				aria-describedby="content-helper"
				defaultValue={data.rawChallengeContent}
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
					<span>{formResult.newName ? 'You will be redirect to new page after 2 seconds' : ''}</span
					>
				</div>
			{/if}
		{/if}
	</div>
{:else if challengeResponseMode === true}
	<div class="form-challenge form-card">
		<h2>Challenge response</h2>

		<!-- make a challenge response -->
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
			<input type="hidden" value={challenge.id} name="challengeID" />
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

<dialog bind:this={dialogRef}>
	<p>Are you sure you want to delete this challenge?</p>
	<p style="margin-top:10px;margin-bottom:10px;">
		If successful, you will be redirect to challenges page
	</p>
	<form method="dialog">
		<button onclick={handleConfirmDelete}>{!formSubmit ? 'Yes' : 'Please wait'}</button>
		<button onclick={handleCancel}>No</button>
	</form>
</dialog>

<!-- Hidden Form to delete challenge -->
<form
	id="deleteForm"
	method="POST"
	action="?/challenges/delete"
	style="display: none;"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		formSubmit = true;

		return async ({ result, update }) => {
			await update();
			formSubmit = false;
		};
	}}
>
	<input type="hidden" name="name" value={challenge.name} />
	<button type="submit" id="delete-challenge-button">Delete form</button>
</form>

<style>
	.meta div {
		margin: 5px 0;
	}

	a {
		text-decoration: none;
		color: inherit;
	}
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

	.challenge-content {
		margin: 1rem 0 2rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 6px;
	}

	:global(.challenge-content h2) {
		font-size: 2rem;
	}
	:global(.challenge-content h3) {
		font-size: 1.7rem;
	}

	:global(.challenge-content h4) {
		font-size: 1.5rem;
	}

	:global(.challenge-content h5) {
		font-size: 1.3rem;
	}

	:global(.challenge-content h6) {
		font-size: 1.1rem;
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
