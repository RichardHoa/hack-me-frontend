<script>
	// @ts-nocheck

	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { CHALLENGE_CATEGORIES } from '$lib/utils.js';
	let { form, data } = $props();

	let formSubmit = $state(false);
</script>

<svelte:head>
	<title>HACKME: Add challenge</title>
</svelte:head>
{#if data.user == null}
	<h1>Please login to post challenge</h1>
{:else}
	<div class="form-card">
		<h1>New challenge</h1>

		<form
			method="POST"
			action="?/challenges"
			use:enhance={({ formElement, formData, action, cancel, submitter }) => {
				formSubmit = true;
				return async ({ result, update }) => {
					await update();
					formSubmit = false;
				};
			}}
		>
			<label for="challengeName">
				Challenge name
				<input type="text" id="challengeName" name="name" required />
			</label>
			<fieldset class="category-fieldset">
				<legend>Category</legend>
				{#each CHALLENGE_CATEGORIES as cat}
					<label class="category-label">
						<input type="radio" value={cat} name="category" required />
						{cat}
					</label>
				{/each}
			</fieldset>

			<label for="content">Content</label>
			<small id="content-helper">The content can be displayed in Markdown</small>
			<textarea
				id="content"
				name="content"
				rows="20"
				required
				aria-describedby="content-helper"
				spellcheck="false"
				autocorrect="off"
			></textarea>
			<button type="submit" class="submit-button" disabled={formSubmit}
				>{formSubmit ? 'Please wait' : 'New challenge'}</button
			>
		</form>

		{#if form}
			{#if form.success == false}
				<p class="error-message" role="alert">{form.message}</p>
			{:else}
				<p class="success-message">{form.message}</p>
			{/if}
		{/if}
	</div>
{/if}

<style>
	label,
	textarea,
	input[type='text'] {
		display: block;
		width: 100%;
	}

	small {
		font-size: 0.8rem;
		margin: 0;
		padding: 0;
	}

	form {
		display: flex;
		gap: 10px;
		flex-direction: column;
	}

	/* Form card styling */
	.form-card {
		margin: 20px auto;
		padding: 30px;
		border: 2px solid black;
		border-radius: 0.5rem;
		max-width: 500px;
	}

	h1 {
		font-size: 2rem;
		font-weight: bold;
		text-align: center;
		margin-bottom: 1.5rem;
	}

	h1 {
		font-size: 1.875rem;
		font-weight: bold;
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.submit-button {
		width: 100%;
		padding: 0.625rem 1rem;
		border-radius: 0.375rem;
		margin-bottom: 10px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 650;
		border: none;
		transition:
			background-color 0.2s ease-in-out,
			box-shadow 0.2s ease-in-out;
		margin-top: 1.5rem;
	}

	.submit-button:not(:disabled):hover {
		background-color: var(--hightlight);
	}

	.submit-button:not(:disabled):focus {
		outline: 2px solid var(--hightlight);
		outline-offset: 2px;
	}

	/* Error message styling */
	.error-message,
	.success-message {
		text-align: center;
	}
</style>
