<svelte:options runes={false} />

<script>
	// @ts-nocheck
	import Header from '$lib/components/Header.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;

	let email = '';
	let password = '';
	let errorMessage = '';
	let loading = false;
	let timeoutMessage = false;

	onMount(() => {
		timeoutMessage = new URLSearchParams(window.location.search).get('timeout') === '1';
	});

	/** @param {Event} event */
	async function handleSubmit(event) {
		event.preventDefault();
		errorMessage = '';
		timeoutMessage = false;
		loading = true;

		const { data: authData, error } = await data.supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			loading = false;
			errorMessage = error.message;
			return;
		}

		const userId = authData?.user?.id;

		const { data: staffRow, error: staffError } = await data.supabase
			.from('staff')
			.select('staff_id, full_name, is_active')
			.eq('auth_user_id', userId)
			.maybeSingle();

		if (staffError || !staffRow) {
			await data.supabase.auth.signOut();
			loading = false;
			errorMessage = 'This account is not linked to a staff record.';
			return;
		}

		if (!staffRow.is_active) {
			await data.supabase.auth.signOut();
			loading = false;
			errorMessage =
				'Your account has been created, but it is still waiting for administrator approval.';
			return;
		}

		loading = false;
		await goto('/staff/dashboard');
	}
</script>

<Header showLogout={false} />

<svelte:head>
	<title>Staff Login</title>
</svelte:head>

<section class="login-box">
	<h1>Staff Login</h1>
	<p class="sub">Enter your account/password</p>

	<form class="card" on:submit={handleSubmit}>
		<label>
			Email
			<input
				type="email"
				bind:value={email}
				placeholder="name@thehut.org.au"
				required
				autocomplete="email"
			/>
		</label>

		<label>
			Password
			<input
				type="password"
				bind:value={password}
				placeholder="••••••••"
				required
				autocomplete="current-password"
			/>
		</label>

		{#if timeoutMessage}
			<p class="info">You have been signed out after 30 minutes of inactivity.</p>
		{/if}

		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}

		<div class="actions">
			<button class="btn" type="submit" disabled={loading}>
				{#if loading}
					Signing in...
				{:else}
					Sign in
				{/if}
			</button>
		</div>

		<div class="extra-links">
			<a href="/staff/register">New to the portal? Create an account here</a>
		</div>
	</form>
</section>

<style>
	.login-box {
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

	.info {
		margin: 12px 0 0;
		color: #1d4ed8;
		font-size: 14px;
		line-height: 1.5;
	}

	.error {
		margin: 12px 0 0;
		color: #b91c1c;
		font-size: 14px;
		line-height: 1.5;
	}

	.actions {
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

	.extra-links {
		margin-top: 5px;
	}

	.extra-links a {
		color: #152238;
		text-decoration: none;
		font-size: x-small;
		font-weight: 500;
	}

	.extra-links a:hover {
		text-decoration: underline;
	}
</style>