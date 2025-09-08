<script>
	import { page } from '$app/state';
	import { SERVER_ERROR_MESSAGE } from '$lib/utils';

	if (page.status === 500) {
		page.error.message = SERVER_ERROR_MESSAGE;
	}
</script>

<div>
	<h1>{page.status}</h1>
	<span>
		{#if page.error}
			{page.error.message}
		{/if}
	</span>
</div>

<style>
	div {
		margin: 30px auto;
		text-align: center;

		h1 {
			font-size: 3rem;
			margin-bottom: 20px;
		}
	}
</style>
