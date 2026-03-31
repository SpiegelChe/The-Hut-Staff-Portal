<svelte:options runes={false} />

<script>
	// @ts-nocheck
	import Header from '$lib/components/Header.svelte';

	export let data;

	let fullName = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let errorMessage = '';
	let successMessage = '';
	let loading = false;

	function formatAuthError(message) {
		const lower = message.toLowerCase();

		if (
			lower.includes('password should contain at least one character of each') ||
			lower.includes('password') && lower.includes('uppercase') ||
			lower.includes('password') && lower.includes('special')
		) {
			return 'Password must include uppercase letters, lowercase letters, numbers, and special characters.';
		}

		if (lower.includes('user already registered')) {
			return 'This email is already registered.';
		}

		if (lower.includes('invalid email')) {
			return 'Please enter a valid email address.';
		}

		return message;
	}

	/** @param {Event} event */
	async function handleRegister(event) {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';

		if (password !== confirmPassword) {
			errorMessage = 'Passwords do not match.';
			return;
		}

		loading = true;

		const { error } = await data.supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: fullName
				},
				/* emailRedirectTo: 'http://localhost:5173/staff/login' */
				emailRedirectTo: `${window.location.origin}/staff/login`
			}
		});

		loading = false;

		if (error) {
			errorMessage = formatAuthError(error.message);
			return;
		}

		successMessage =
			'Registration submitted successfully. Please verify your email first, then wait for administrator approval before signing in.';

		fullName = '';
		email = '';
		password = '';
		confirmPassword = '';
	}
</script>

<Header showLogout={false} />

<svelte:head>
	<title>Staff Registration</title>
</svelte:head>

<section class="register-box">
	<h1>Staff Registration</h1>
	<p class="sub">Create an account</p>

	<form class="card" on:submit={handleRegister}>
		<label>
			Full name
			<input type="text" bind:value={fullName} required />
		</label>

		<label>
			Email
			<input type="email" bind:value={email} required autocomplete="email" />
		</label>

		<label>
			Password
			<input type="password" bind:value={password} required autocomplete="new-password" />
		</label>

		<label>
			Confirm password
			<input
				type="password"
				bind:value={confirmPassword}
				required
				autocomplete="new-password"
			/>
		</label>

		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}

		{#if successMessage}
			<p class="success">{successMessage}</p>
		{/if}

		<div class="actions">
			<button class="btn" type="submit" disabled={loading}>
				{#if loading}
					Registering...
				{:else}
					Register
				{/if}
			</button>

			<a class="text-link" href="/staff/login">Back to login</a>
		</div>
	</form>
</section>

<style>
	.register-box {
		max-width: 720px;
		margin: 0 auto;
		padding: calc(70px + 24px) 16px 0;
	}

	.sub {
		opacity: 0.8;
	}

	.card {
		margin-top: 18px;
		padding: 18px;
		border: 1px solid rgba(0, 0, 0, 0.2);
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.7);
	}

	label {
		display: block;
		margin-bottom: 12px;
		font-weight: 700;
	}

	input {
		display: block;
		width: 100%;
		box-sizing: border-box;
		margin-top: 6px;
		padding: 10px 12px;
		border-radius: 8px;
		border: 1px solid rgba(0, 0, 0, 0.25);
	}

	.error {
		margin: 12px 0 0;
		color: #b91c1c;
		font-size: 14px;
		line-height: 1.5;
	}

	.success {
		margin: 12px 0 0;
		color: #15803d;
		font-size: 14px;
		line-height: 1.5;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-top: 14px;
	}

	.btn {
		display: inline-flex;
		padding: 10px 14px;
		border-radius: 10px;
		background: #c55a1b;
		color: #fff;
		font-weight: 800;
		border: none;
		cursor: pointer;
	}

	.btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.text-link {
		color: #152238;
		text-decoration: none;
		font-weight: 700;
	}

	.text-link:hover {
		text-decoration: underline;
	}
</style>