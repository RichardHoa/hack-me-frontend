<script>
	// @ts-nocheck

	import { CHALLENGE_CATEGORIES, formatDate, formatNow } from '$lib/utils.js';
	import { ArrowUpFromDot } from 'lucide-svelte';
	import { error } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Comment from '$lib/components/Comment/Comment.svelte';
	let { data, form } = $props();
	let challengeResponse = $derived(data.challengeResponse);
	let comments = $derived(data.challengeResponse.comments);

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
		document.getElementById('delete-response').click();
	}
	function handleCancel() {
		dialogRef.close();
	}
</script>

<svelte:head>
	<title>HACKME: challenge response</title>
</svelte:head>

<h1 class="challenge-title">{challengeResponse.name}</h1>

<div class="challenge-meta">
	<h3>Author: {challengeResponse.authorName}</h3>
	<h3>Up vote: {challengeResponse.upVote}</h3>
	<h3>Down vote: {challengeResponse.downVote}</h3>
	<h3>Created: {formatDate(challengeResponse.createdAt)}</h3>
	<h3>Last Updated: {formatDate(challengeResponse.updatedAt)}</h3>
	<!-- allow challenge edit directly -->
	{#if data.user?.userName === challengeResponse.authorName}
		<button onclick={() => (editMode = !editMode)}
			>{!editMode ? 'Edit challenge response' : 'Exit edit mode'}</button
		>
		<button onclick={openConfirmDialog}>Delete challenge response</button>
	{/if}
	{#if form?.id === 'deleteChallengeResponse'}
		<div
			class={form.success ? 'success-message' : 'error-message'}
			style="text-align: center;"
			role="alert"
		>
			{form.message}
		</div>
	{/if}
</div>

{#if editMode === false}
	<div class="challenge-content">
		{@html challengeResponse.content}
	</div>
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
			<input type="text" name="content" />
		</label>
		<input type="hidden" name="challengeResponseID" value={challengeResponse.id} />
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
				<Comment
					{comment}
					challengeResponseID={challengeResponse.id}
					author={data.user?.userName}
				/>
			{/each}
		</div>
	{:else}
		<p class="no-comments">No comments yet.</p>
	{/if}
{:else if editMode === true}
	<div class="form-card">
		<h2>Edit mode</h2>

		<form
			method="POST"
			action="?/challenges/response"
			use:enhance={({ formElement, formData, action, cancel, submitter }) => {
				formSubmit = true;
				return async ({ result, update }) => {
					await update();
					formSubmit = false;

					if (result.data.success === true) {
						setTimeout(() => {
							editMode = false;
						}, 2000);
					}
				};
			}}
		>
			<input type="hidden" name="challengeResponseID" value={challengeResponse.id} />
			<label for="challengeName">
				challenge response name
				<input
					type="text"
					id="challengeName"
					name="name"
					required
					defaultvalue={challengeResponse.name}
				/>
			</label>

			<label for="content">Content</label>
			<small id="content-helper">The content can be displayed in Markdown</small>
			<textarea
				id="content"
				name="content"
				rows="30"
				required
				aria-describedby="content-helper"
				defaultValue={data.rawContent}
			></textarea>
			<button type="submit" class="submit-button" disabled={formSubmit}
				>{formSubmit ? 'Please wait' : 'Edit challenge'}</button
			>
		</form>

		{#if form?.id === 'challengeResponse'}
			<p class={form.success ? 'success-message' : 'error-message'} role="alert">
				{form.message}
			</p>
		{/if}
	</div>
{/if}

<dialog bind:this={dialogRef}>
	<p>Are you sure you want to delete this challenge response?</p>
	<p style="margin-top:10px;margin-bottom:10px;">
		If successful, you will be redirect to challenge page
	</p>
	<form method="dialog">
		<button onclick={handleConfirmDelete}>Yes</button>
		<button onclick={handleCancel}>No</button>
	</form>
</dialog>

<form
	id="deleteForm"
	method="POST"
	action="?/challenges/response/delete"
	style="display: none;"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		formSubmit = true;

		return async ({ result, update }) => {
			await update();
			formSubmit = false;
		};
	}}
>
	<input type="hidden" name="id" value={challengeResponse.id} />
	<button type="submit" id="delete-response">Delete form</button>
</form>

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
