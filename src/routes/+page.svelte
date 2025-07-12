<script>
	import { localizeHref } from '$lib/paraglide/runtime.js';
	import { m } from '$lib/paraglide/messages.js';
	import { formatDate } from '$lib/utils.js';
</script>

<svelte:head>
	<title>HACKME: Landing page</title>
</svelte:head>

<div>
	<h1>{m.honest_bad_zebra_build()}</h1>
	<p>{m.free_acidic_jackal_gasp()}</p>
	<a href={localizeHref('/challenge')}> {m.upper_steep_ant_bump()}</a>
</div>

<style>
	div {
		margin-top: 30px;
		text-align: center;
	}

	h1 {
		font-size: 3rem;
	}

	p {
		margin: 10px 0;
	}
</style>
