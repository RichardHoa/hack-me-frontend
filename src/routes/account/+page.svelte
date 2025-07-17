<script>
	// @ts-nocheck

	import { enhance } from '$app/forms';

	let { data, form } = $props();
	console.log(data);
</script>

<h1>Welcome {data.user.userName}</h1>

<form
	id="voteForm"
	method="POST"
	action="?/users/logout"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		return async ({ result, update }) => {
			await update();
		};
	}}
>
	<button type="submit">Logout</button>
	{#if form?.id === 'logout'}
		{#if form.success === false}
			<p class="error-message" role="alert">{form.message}</p>
		{/if}
	{/if}
</form>

<style>
</style>
