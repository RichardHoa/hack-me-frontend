<script>
	// @ts-nocheck

	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	let { form } = $props();

	let loginFormSubmit = $state(false);
	let registrationFormSubmit = $state(false);
</script>

<!-- Login Form Card -->
<div class="form-card">
	<h1>Login</h1>

	<!-- Social Login Placeholders -->
	<div class="social-buttons">
		<button class="plain-button">Login with Google</button>
		<button class="plain-button">Login with GitHub</button>
	</div>

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
		{#if form.loginSuccess == false}
			<p class="error-message" role="alert">{form.loginMessage}</p>
		{:else}
			<p class="success-message">{form.loginMessage}</p>
		{/if}
	{/if}
</div>

<!-- Registration Form Card -->
<div class="form-card">
	<h1>Register</h1>

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

	<!-- Error Message for Registration (if applicable) -->
	{#if form}
		{#if form.registrationSuccess == false}
			<p class="error-message" role="alert">{form.registrationMessage}</p>
		{:else}
			<p class="success-message">{form.registrationMessage}</p>
		{/if}
	{/if}
</div>

<style>
	/* Form card styling */
	.form-card {
		margin: 20px auto;
		padding: 30px;
		border: 2px solid black;
		border-radius: 0.5rem;
		max-width: 500px;
	}

	/* Heading styling */
	h1 {
		font-size: 1.875rem; /* Equivalent to text-3xl */
		font-weight: bold;
		text-align: center;
		color: #1f2937; /* Equivalent to gray-800 */
		margin-bottom: 1.5rem; /* Equivalent to mb-6 */
	}

	/* Social login buttons container */
	.social-buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem; /* Equivalent to space-y-4 */
		margin-bottom: 1.5rem; /* Equivalent to mb-6 */
	}

	.plain-button {
		width: 100%;
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 0.375rem;
		background-color: #f0f0f0;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		text-align: center;
		transition: background-color 0.2s ease-in-out;
	}

	.plain-button:hover {
		background-color: #e0e0e0;
	}

	.plain-button:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}

	/* Form styling */
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem; /* Equivalent to space-y-4 */
	}

	/* Label styling */
	label {
		display: block;
	}
	/* Input styling */
	input {
		display: block;
		width: 100%;
		border: 1px solid #d1d5db; /* Equivalent to border-gray-300 */
		border-radius: 0.375rem; /* Equivalent to rounded-md */
		height: 2rem;
		margin-top: 5px;
		padding: 0 5px;
	}

	input:focus {
		border-color: #3b82f6; /* Equivalent to focus:border-blue-500 */
		outline: none;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25); /* Equivalent to focus:ring focus:ring-blue-200 */
	}

	/* Button styling for submit buttons */
	.submit-button {
		width: 100%; /* Make button full width */
		padding: 0.625rem 1rem; /* Equivalent to py-2.5 px-4 */
		border: none;
		border-radius: 0.375rem; /* Equivalent to rounded-md */
		font-size: 1rem; /* Equivalent to text-base */
		font-weight: 600; /* Equivalent to font-semibold */
		margin-bottom: 10px;
		cursor: pointer;
		transition:
			background-color 0.2s ease-in-out,
			box-shadow 0.2s ease-in-out;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Equivalent to shadow-md */
		margin-top: 1.5rem; /* Add margin-top for spacing */
	}

	.submit-button:hover {
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	.submit-button:focus {
		outline: 2px solid #3b82f6; /* Tailwind blue-500 */
		outline-offset: 2px;
	}

	/* Error message styling */
	.error-message {
		color: #ef4444;
		text-align: center;
	}

	.success-message {
		color: green;
		text-align: center;
	}
</style>
