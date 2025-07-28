<script>
	// @ts-nocheck

	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	let { form } = $props();

	let loginFormSubmit = $state(false);
	let registrationFormSubmit = $state(false);

	function handleGoogleLogin(response) {
		// Get the form and input elements directly
		const googleForm = document.getElementById('google-login-form');
		const jwtInput = document.getElementById('google-jwt');

		if (googleForm && jwtInput) {
			jwtInput.value = response.credential;
			googleForm.requestSubmit();
		} else {
			console.error('Could not find the Google login form or its JWT input.');
		}
	}

	/**
	 * This function contains the logic to initialize and render the Google Sign-In button.
	 * It's called only after we're sure the Google GSI script is loaded.
	 */
	function renderGoogleButton() {
		if (!window.google) {
			console.error('Attempted to render Google button, but `window.google` is not available.');
			return;
		}

		window.google.accounts.id.initialize({
			client_id: '1025927927956-2v6pno708qqkchj3u2gq5g9j2ni4hn2u.apps.googleusercontent.com',
			callback: handleGoogleLogin
		});

		window.google.accounts.id.renderButton(document.getElementById('google-button-container'), {
			theme: 'outline',
			size: 'large',
			shape: 'pill',
			text: 'signin_with'
		});
	}

	/**
	 * Checks if the Google script is loaded. If not, it loads the script dynamically
	 * and then calls the rendering function via the `onload` callback.
	 */
	function setupGoogleScript() {
		// If the script is already there, just render the button.
		if (window.google) {
			console.log('Google script already loaded, rendering button.');
			renderGoogleButton();
			return;
		}

		// If not, create a script tag to load it.
		console.log('Google script not found. Loading dynamically...');
		const script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.async = true;
		script.defer = true;

		script.onload = () => {
			console.log('Google script has been loaded. Initializing...');
			renderGoogleButton();
		};

		script.onerror = () => {
			console.error('Failed to load the Google GSI script.');
		};

		document.head.appendChild(script);
	}

	onMount(() => {
		setupGoogleScript();
	});
</script>

<svelte:head>
	<title>HACKME: Login and Registration</title>
</svelte:head>
<h1>Auth page</h1>
<!-- Login Form Card -->
<div class="form-card">
	<h2>Login</h2>

	<div>
		<div id="google-button-container"></div>

		<button class="plain-button">Login with GitHub</button>
	</div>

	<form
		id="google-login-form"
		method="POST"
		action="?/login/google"
		style="display: none;"
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			loginFormSubmit = true;
			return async ({ result, update }) => {
				await update();
				loginFormSubmit = false;
			};
		}}
	>
		<input type="hidden" id="google-jwt" name="jwtToken" />
		<button id="google-login-button">Submit form</button>
	</form>

	<form
		method="POST"
		action="?/login"
		id="login-form"
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			loginFormSubmit = true;
			return async ({ result, update }) => {
				await update();
				loginFormSubmit = false;
			};
		}}
	>
		<label for="login-email">
			Email
			<input
				type="email"
				id="login-email"
				name="email"
				placeholder="Enter your username"
				autocomplete="username"
				required
			/>
		</label>
		<label for="login-password">
			Password
			<input
				type="password"
				id="login-password"
				name="password"
				placeholder="Enter your password"
				autocomplete="current-password"
				required
			/>
		</label>
		<button type="submit" class="submit-button" disabled={loginFormSubmit}
			>{loginFormSubmit ? 'Logging in' : 'Login'}</button
		>
	</form>

	{#if form}
		{#if form?.id === 'login'}
			<p class={form.success ? 'success-message' : 'error-message'} role="alert">{form.message}</p>
		{/if}
	{/if}
</div>

<!-- Registration Form Card -->
<div class="form-card">
	<h2>Register</h2>

	<form
		method="post"
		action="?/register"
		id="register-form"
		use:enhance={({ formElement, formData, action, cancel, submitter }) => {
			registrationFormSubmit = true;
			return async ({ result, update }) => {
				await update();
				registrationFormSubmit = false;
			};
		}}
	>
		<label for="register-email">
			Email
			<input type="email" id="register-email" name="email" placeholder="Choose a email" required />
		</label>
		<label for="register-username">
			Username
			<input
				type="text"
				id="register-username"
				name="username"
				placeholder="Choose a username"
				required
			/>
		</label>
		<label for="register-password">
			Password
			<input
				type="password"
				id="register-password"
				name="password"
				placeholder="Create a password"
				autocomplete="new-password"
				required
			/>
		</label>
		<button type="submit" class="submit-button" disabled={registrationFormSubmit}
			>{registrationFormSubmit ? 'Please wait' : 'Register new account'}</button
		>
	</form>

	{#if form}
		{#if form?.id === 'registration'}
			<p class={form.success ? 'success-message' : 'error-message'} role="alert">{form.message}</p>
		{/if}
	{/if}
</div>

<style>
	#google-button-container {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
		color-scheme: light;
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

	h2 {
		font-size: 1.875rem;
		font-weight: bold;
		text-align: center;
		margin-bottom: 1.5rem;
	}

	/* Social login buttons container */
	/* .social-buttons {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	} */

	.plain-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem; /* Adjust space between icon and text */

		width: 100%;
		padding: 0.5rem 1rem;
		border: 1px solid var(--light-gray);
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		text-align: center;
		transition: background-color 0.2s ease-in-out;
	}

	.plain-button:hover {
		background-color: var(--hightlight);
	}

	.plain-button:focus {
		outline: 2px solid var(--hightlight);
		outline-offset: 2px;
	}

	/* Form styling */
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Label styling */
	label {
		display: block;
	}
	/* Input styling */
	input {
		display: block;
		width: 100%;
		border: 1px solid var(--light-gray);
		border-radius: 0.375rem;
		height: 2rem;
		margin-top: 5px;
		padding: 0 5px;
	}

	input:focus {
		border-color: var(--hightlight);
		outline: none;
		box-shadow: 0 0 0 3px var(--hightlight);
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
