<script>
	import { enhance } from '$app/forms';
	import { formatDate } from '$lib/utils';
	let { data, form } = $props();

	const challenges = data.userData.challenges;
	const challengeResponses = data.userData.challengeResponses;
	const user = $derived(data.userData.user);

	let isLoading = $state(false);
</script>

<svelte:head>
	<title>HACKME: Account page</title>
</svelte:head>
<div class="account-container">
	{#if user}
		<h1>Welcome {user.userName}</h1>

		<div class="user-info">
			{#if user.imageLink}
				<img src={user.imageLink} alt="{user.userName}'s profile picture" class="profile-picture" />
			{:else}
				<div class="profile-picture-placeholder">No Image</div>
			{/if}
		</div>

		<hr />

		<div class="challenges-section">
			<h2>My Challenges</h2>
			{#if challenges && challenges.length > 0}
				<ul>
					{#each challenges as challenge}
						<li>
							<a href="/challenge/{challenge.name}">{challenge.name}</a>
							<p>Category: {challenge.category}</p>
							<p>Comments: {challenge.commentCount}</p>
							<p>Responses: {challenge.responseCount}</p>
							<p>Score: {challenge.popularScore}</p>
							<p>Last Updated: {formatDate(challenge.updatedAt)}</p>
						</li>
					{/each}
				</ul>
			{:else}
				<p>You haven't created any challenges yet.</p>
			{/if}
		</div>

		<hr />

		<div class="responses-section">
			<h2>My Challenge Responses</h2>
			{#if challengeResponses && challengeResponses.length > 0}
				<ul>
					{#each challengeResponses as response}
						<li>
							<a href="/challenge/response/{response.id}">{response.name}</a>
							<p>Upvotes: {response.upVote}</p>
							<p>Downvotes: {response.downVote}</p>
							<p>Created: {formatDate(response.createdAt)}</p>
						</li>
					{/each}
				</ul>
			{:else}
				<p>You haven't responded to any challenges yet.</p>
			{/if}
		</div>

		<hr />

		<div class="forms-section">
			<div class="form-card">
				<h2>Change Username</h2>
				<form
					action="?/changeUsername"
					method="POST"
					use:enhance={({ formElement, formData, action, cancel, submitter }) => {
						isLoading = true;
						return async ({ result, update }) => {
							await update();
							isLoading = false;
						};
					}}
				>
					<label for="newUsername">New Username</label>
					<input type="text" id="newUsername" name="newUsername" required />
					<button type="submit" class="submit-button" disabled={isLoading}>Change Username</button>
					{#if form?.id === 'changeUsername'}
						<p class:success-message={form?.success} class:error-message={!form?.success}>
							{form?.message}
						</p>
					{/if}
				</form>
			</div>

			<div class="form-card">
				<h2>Change Password</h2>
				<form
					action="?/changePassword"
					method="POST"
					use:enhance={({ formElement, formData, action, cancel, submitter }) => {
						isLoading = true;
						return async ({ result, update }) => {
							await update();
							isLoading = false;
						};
					}}
				>
					<label for="oldPassword">Old Password</label>
					<input type="password" id="oldPassword" name="oldPassword" required />
					<label for="newPassword">New Password</label>
					<input type="password" id="newPassword" name="newPassword" required />
					<button type="submit" class="submit-button">Change Password</button>
					{#if form?.id === 'changePassword'}
						<p class:success-message={form?.success} class:error-message={!form?.success}>
							{form?.message}
						</p>
					{/if}
				</form>
			</div>

			<div class="form-card">
				<h2>Delete Account</h2>
				<form
					action="?/deleteAccount"
					method="POST"
					use:enhance={({ formElement, formData, action, cancel, submitter }) => {
						isLoading = true;
						return async ({ result, update }) => {
							await update();
							isLoading = false;
						};
					}}
				>
					<p>This action is irreversible. All your data will be lost.</p>
					<button type="submit" class="submit-button error-message">Delete My Account</button>
					{#if form?.id === 'deleteAccount' && !form?.success}
						<p class="error-message">{form?.message}</p>
					{/if}
				</form>
			</div>
		</div>

		<form
			action="?/users/logout"
			method="POST"
			use:enhance={({ formElement, formData, action, cancel, submitter }) => {
				isLoading = true;
				return async ({ result, update }) => {
					await update();
					isLoading = false;
				};
			}}
		>
			<button type="submit" class="submit-button">Logout</button>
		</form>
	{/if}
</div>

<style>
	h1 {
		text-align: center;
		font-size: 1.3rem;
		font-weight: bold;
	}
	.account-container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 2rem;
		border-radius: 8px;
	}
	.user-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.profile-picture,
	.profile-picture-placeholder {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		object-fit: cover;
	}
	.profile-picture-placeholder {
		display: grid;
		place-items: center;
		border: 1px solid #ccc;
	}
	.challenges-section,
	.responses-section,
	.forms-section {
		margin-top: 2rem;
	}

	.challenges-section ul li:hover,
	.responses-section ul li:hover {
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
		transform: translateY(-2px);
		transition: all 0.3s ease-in-out;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	li {
		padding: 1rem;
		border: 1px solid #eee;
		margin-bottom: 1rem;
		border-radius: 4px;
	}
	a {
		font-weight: bold;
		color: var(--hightlight);
	}
	a:hover {
		text-decoration: underline;
	}
</style>
